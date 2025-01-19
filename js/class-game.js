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

    const $price = createDomElement('p', {'class': 'card__price'}, `USD$ ${this.getPrice}`)
    $container.append($price);

    const $addToCart = createDomElement('button', {'class': 'btn btn--primary'}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
      ev.stopPropagation();
    })
    $container.append($addToCart)

    return $container
  }

  showDetails(originalCard = document.body) {
    const $header = document.createElement('div')

    const $h2 = createDomElement('h2', {}, this.#name)

    const $btnClose = createDomElement('button', {}, 'Cerrar')
    $btnClose.addEventListener('click', () => {
      $btnClose.closest('dialog').close()
    })

    $header.append($h2, $btnClose)

    const $body = document.createElement('div')

    const $carousel = document.createElement('div')

    const $bigImg = createDomElement('img', { 'src': GAMES_IMG_URL + this.#carouselImages[0], 'alt': 'Captura de pantalla 1', 'data-i': 0 })

    const $ulCarousel = createDomElement('ul', { 'class': 'mini-images' })
    $carousel.append($bigImg, $ulCarousel)

    this.#carouselImages.forEach((image, i) => {
      const $li = document.createElement('li')
      $ulCarousel.append($li)

      const $img = createDomElement('img', { 'src': GAMES_IMG_URL + image, 'alt': `Captura de pantalla ${i + 1}` })
      $li.append($img)
      $img.addEventListener('click', () => {
        $bigImg.alt = `Captura de pantalla ${i + 1}`
        $bigImg.src = GAMES_IMG_URL + image;
        $bigImg.setAttribute('data-i', i)
      })
    })
     
    function changeBigImage(dir, carouselImages) {
      let newI = +$bigImg.dataset.i + dir
      if(newI < 0) newI = carouselImages.length - 1
      if(newI >= carouselImages.length) newI = 0
      
      $bigImg.alt = 'Captura de pantalla ' + newI + 1
      $bigImg.src = GAMES_IMG_URL + carouselImages[newI];
      $bigImg.setAttribute('data-i', newI) 
    }

    const $btnPrev = createDomElement('button', {}, '👈')
    $btnPrev.addEventListener('click', () => { changeBigImage(-1, this.#carouselImages) })
    
    const $btnNext = createDomElement('button', {}, '👉')
    $btnNext.addEventListener('click', () => { changeBigImage(1, this.#carouselImages) })
    $carousel.append($btnPrev, $btnNext)

    const $more = document.createElement('div')

    $body.append($carousel, $more)

    const $cover = createDomElement('img', { 'src': GAMES_IMG_URL + this.#cover.header, 'alt': `Portada del videojuego ${this.#name}` })

    const $descr = createDomElement('p', {}, this.#descr);

    const $price = createDomElement('p', {}, `USD$ ${this.getPrice}`);

    const $addToCart = createDomElement('button', {}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
    })
    
    const $ulGenres = createDomElement('ul', {})
    for(const genre of this.#genres) {
      const $li = document.createElement('li', {})
      $li.innerText = `${genres[genre]}`
      $ulGenres.append($li)
    }

    $more.append($cover, $descr, $price, $addToCart, $ulGenres)

    const $modal = createModal({ content: [$header, $body], insert: { element: originalCard, position: 'before' } })
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