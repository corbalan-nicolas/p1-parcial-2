'use strict';

class Game {
  #id;
  #name;
  #description;
  #genres;
  #price;
  #discount;
  #cover;
  #carouselImages;

  constructor({id, name, description, genres, price, discount, cover, carouselImages}) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#genres = genres;
    this.#price = price;
    this.#discount = discount;
    this.#cover = cover;
    this.#carouselImages = carouselImages;
  }

  /**
   * @returns {DOMElement} <article>
   */
  createDefaultCard() {
    /* STRUCTURE
    <article class="card card--default" data-game-id="###">
      <h2><a>Game name</a><h2>
      <img src="img/portada.jpg" alt="portada de juego X">
      <div>
        <p class="card__price">$30.000 ARS</p>
        <button>Añadir al carrito</button>
      </div>
    </article>
    */
    const $card = createDomElement({tag: 'article', attributes: {'class': 'card card--default', 'data-game-id': this.#id}});
    const $link = createDomElement({tag: 'a', attributes: {'href': '#detalleProducto'}, content: this.#name});
    const $header = createDomElement({tag: 'h2', content: $link});
    const $cover = createDomElement({tag: 'img', attributes: {'src': IMG_URL + this.#cover}})
    const $price = createDomElement({tag: 'p', attributes: {'class': 'card__price'}, content: this.#price});
    const $btn = createDomElement({tag: 'button', content: 'Añadir al carrito'});

    $card.addEventListener('click', this.showGameDetails)
    $link.addEventListener('click', this.showGameDetails)

    $card.append($header, $cover, $price, $btn);
    return $card;
  }

  showGameDetails() {
    console.log("HOla");
    
    const name = this.getName;
    console.log(this.getName);
    
    const $header = createDomElement({tag: 'header'})
    const $name = createDomElement({tag: 'h2', content: name})
    const $formClose = createDomElement({tag: 'form', attributes: {'method': 'dialog', 'action': '#'}});
    const $btnClose = createDomElement({tag: 'button', content: '❌'})
    $formClose.append($btnClose);
    $header.append($name, $formClose);

    const $modal = createModal({modalContent: $header, insertOn: 'prepend'});
    $modal.showModal();
  }

  get getName() { return this.#name }
}

/**
 *  "name": "Celeste",
            "description": "Ayuda a Madeline a sobrevivir a sus demonios internos en su viaje a la cima de la Montaña Celeste, en este juego de plataformas súper ajustado de los creadores de TowerFall. Enfréntate a cientos de desafíos hechos a mano, descubre secretos tortuosos y descubre el misterio de la montaña.",
            "genres": [3, 4],
            "price": 17000,
            "discount": 0,
            "cover": "celeste_portada.jpg",
            "carousel_images"
 */