class Game {
  #id
  #name
  #descr
  #genres
  #cover
  #carouselImages
  #price
  #discount
  #sales // in this case, it is used to sort by relevance
  constructor({ id, name, descr, genres, cover, carouselImages, price, discount, sales = 0 }) {
    this.#id = id
    this.#name = name
    this.#descr = descr
    this.#genres = genres
    this.#cover = cover
    this.#carouselImages = carouselImages
    this.#price = price
    this.#discount = discount
    this.#sales = sales
  }

  createCard() {
    const $container = createDomElement('div', {'class': 'card'})
    $container.addEventListener('click', () => { this.showDetails($container) })

    const $aTitle = createDomElement('a', { 'href': '#' })
    const $title = createDomElement('h2', {'class': 'card__title'}, this.#name)
    $title.append($aTitle)
    $container.append($title)

    const $cover = createDomElement('img', {'class': 'card__cover', 'src': `${GAMES_IMG_URL}${this.#cover.header}`, 'alt': `Portada del juego ${this.#name}` })
    $container.append($cover)

    const $priceContainer = createDomElement('div', {'class': 'price-container'})
    const $price = createDomElement('p', {'class': 'price__calculated'}, `USD$ ${this.getPrice}`)

    if(this.#discount > 0) {
      $priceContainer.classList.add('price-container--discount')
      const $discount = createDomElement('p', {'class': 'price__discount'}, '-' + this.#discount + '%')
      const $realPrice = createDomElement('p', {'class': 'price__real'}, `USD$ ${this.#price}`)

      $priceContainer.append($discount, $realPrice)
    }

    const $addToCart = createDomElement('button', {'class': 'btn btn--primary'}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
      ev.stopPropagation();
    })

    $priceContainer.append($price, $addToCart)
    $container.append($priceContainer)

    return $container
  }

  showDetails(originalCard = document.body) {
    const $header = createDomElement('div', {'class': 'header'})

    const $h2 = createDomElement('h2', {}, this.#name)

    const $btnClose = createDomElement('button', {class: 'btn btn--text-only'}, 'X')
    $btnClose.addEventListener('click', () => {
      $btnClose.closest('dialog').close()
    })

    $header.append($h2, $btnClose)

    const $body = createDomElement('div', {'class': 'body body--product-details'})

    const $carousel = createDomElement('div', {'class': 'product-details__carousel'})
    
    const $bigImgContainer = createDomElement('div', {'class': 'big-img-container'})
    const $bigImg = createDomElement('img', {'class': 'big-img', 'src': GAMES_IMG_URL + this.#carouselImages[0], 'alt': 'Captura de pantalla 1', 'data-i': 0 })
    $bigImgContainer.append($bigImg)

    const $carouselControls = createDomElement('div', {'class': 'product-details__carousel-controls'})
    $carousel.append($bigImgContainer, $carouselControls)
    
    const $ulCarousel = createDomElement('ul', { 'class': 'small-images-container' })
    $carouselControls.append($ulCarousel)

    this.#carouselImages.forEach((image, i) => {
      const $li = document.createElement('li')
      $ulCarousel.append($li)

      const $img = createDomElement('img', {'class': 'small-img', 'src': GAMES_IMG_URL + image, 'alt': `Captura de pantalla ${i + 1}` })
      $li.append($img)
      $img.addEventListener('click', () => {
        $bigImg.alt = `Captura de pantalla ${i + 1}`
        $bigImg.src = GAMES_IMG_URL + image;
        $bigImg.setAttribute('data-i', i)
      })
    })
    
    /**
     * 
     * @param {*} dir (-1 = Left && 1 = Right)
     * @param {*} carouselImages 
     */
    function changeBigImage(dir, carouselImages) {
      let newI = +$bigImg.dataset.i + dir
      if(newI < 0) newI = carouselImages.length - 1
      if(newI >= carouselImages.length) newI = 0
      
      $bigImg.alt = 'Captura de pantalla ' + newI + 1
      $bigImg.src = GAMES_IMG_URL + carouselImages[newI];
      $bigImg.setAttribute('data-i', newI) 

      // new index * smallImages width. Eg
      // 3 * 100 = 300 -> scroll to 300
      $ulCarousel.scrollTo(newI * 100, 0)
    }

    const $btnPrev = createDomElement('button', {'class': 'btn'}, '👈')
    $btnPrev.addEventListener('click', () => { changeBigImage(-1, this.#carouselImages) })
    
    const $btnNext = createDomElement('button', {'class': 'btn'}, '👉')
    $btnNext.addEventListener('click', () => { changeBigImage(1, this.#carouselImages) })

    $carouselControls.prepend($btnPrev)
    $carouselControls.append($btnNext)

    const $more = createDomElement('div', {'class': 'product-details__more-info'})

    $body.append($carousel, $more)

    const $cover = createDomElement('img', {'class': 'product-header', 'src': GAMES_IMG_URL + this.#cover.header, 'alt': `Portada del videojuego ${this.#name}` })

    const $descr = createDomElement('p', {'class': 'description'}, this.#descr);

    const $price = createDomElement('p', {'class': 'price'}, `USD$ ${this.getPrice}`);

    const $addToCart = createDomElement('button', {class: 'btn'}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
    })

    const $footer = document.createElement('div')
    
    const $ulGenres = createDomElement('ul', {'class': 'genres'})
    for(const genre of this.#genres) {
      const $li = document.createElement('li', {})
      $li.innerText = `${genres[genre]}`
      $ulGenres.append($li)
    }
    
    $footer.append($ulGenres)
    $more.append($cover, $descr, $price, $addToCart)

    const $modal = createModal({ content: [$header, $body, $footer], insert: { element: originalCard, position: 'before' } })
    $modal.showModal()
  }

  hasGenres(genres) {
    for (const genre of genres) {
      if (!this.#genres.includes(genre)) {
        return false
      }
    }
    return true
  }

  get getId() {
    return this.#id
  }

  get getName() {
    return this.#name
  }

  get getPrice() {
    return (this.#price - (this.#discount * this.#price) / 100).toFixed(2)
  }

  get getCoverCapsule() {
    return this.#cover.capsule
  }

  get getSales() {
    return this.#sales
  }
  
  get getDiscount() {
    return this.#discount
  }
  
  get getAllData() {
    return {
      'id': this.#id,
      'name': this.#name,
      'descr': this.#descr,
      'genres': this.#genres,
      'cover': this.#cover,
      'carouselImages': this.#carouselImages,
      'price': this.#price,
      'discount': this.#discount,
      'sales': this.#sales
    }
  }
}