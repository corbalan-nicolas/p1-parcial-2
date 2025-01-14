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
  constructor({id, name, descr, genres, cover, carouselImages, price, discount, sales = 0}) {
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
    const $container = document.createElement('div')
    $container.addEventListener('click', () => { this.showDetails($container) })
    
    const $aTitle = createDomElement('a', {'href': '#'})
    const $title = createDomElement('h2', {}, this.#name)
    $aTitle.append($title)
    $container.append($aTitle)

    const $cover = createDomElement('img', {'src': `${GAMES_IMG_URL}${this.#cover.header}`, 'alt': `Portada del juego ${this.#name}`})
    $container.append($cover)

    const $price = createDomElement('p', {}, `USD$ ${this.getPrice}`)
    $container.append($price);

    const $addToCart = createDomElement('button', {}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
      ev.stopPropagation();
    })
    $container.append($addToCart)

    return $container
  }

  showDetails(originalCard) {
    const $header = document.createElement('div')

    const $h2 = createDomElement('h2', {}, this.#name)

    const $btnClose = createDomElement('button', {}, 'Cerrar')
    $btnClose.addEventListener('click', () => {
      $btnClose.closest('dialog').close()
    })

    $header.append($h2, $btnClose)
    
    const $body = document.createElement('div')
    
    const $carousel = document.createElement('div')
    const $more = document.createElement('div')
    
    $body.append($carousel, $more)
    
    const $cover = createDomElement('img', {'src': GAMES_IMG_URL + this.#cover.header, 'alt': `Portada del videojuego ${this.#name}`})
    
    const $descr = createDomElement('p', {}, this.#descr);

    const $price = createDomElement('p', {}, `USD$ ${this.getPrice}`);

    const $addToCart = createDomElement('button', {}, 'Añadir al carrito')
    $addToCart.addEventListener('click', (ev) => {
      cart.addProduct(this.#id);
    })
    
    $more.append($cover, $descr, $price, $addToCart);
    
    const $modal = createModal({content: [$header, $body], insert: {element: originalCard, position: 'before'}})
    $modal.showModal()
  }

  hasGenres(genres) {
    for(const genre of genres){
      if(!this.#genres.includes(genre)) {
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

  get getSales() {
    return this.#sales
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