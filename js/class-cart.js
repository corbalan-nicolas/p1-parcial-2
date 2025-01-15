class Cart {
  #products
  constructor(products = []) {
    if(localStorage.getItem("cart") !== null) {
      this.#products = JSON.parse(localStorage.getItem("cart"));
      this.updateMiniCart();
    }else {
        this.#products = products;
    }
  }

  addProduct(id, amount = 1) {
    const searchResult = this.#products.some((product) => {
      if(product.id === id){
          // 
          product.amount += amount;
          return true
      }
    })
    // 
    if(!searchResult) { this.#products.push({id, amount}) }

    //
    localStorage.setItem("cart", JSON.stringify(this.#products))
    this.updateMiniCart()
  }

  deleteProduct(id, amount = 1) {
    this.#products.some((game, i) => {
      if(game.id == id) {
        game.amount -= amount

        if(game.amount <= 0) this.#products.splice(i, 1)
        return true;
      }
    })

    localStorage.setItem("cart", JSON.stringify(this.#products))
    this.updateMiniCart()
  }

  updateMiniCart() {
    const $span = document.querySelector('#quantityOfProducts')
    $span.innerText = this.getQuantityOfProducts;
  }

  showModal() {
    // console.log("Productos:", this.#products);
    // console.log("Cantidad de productos:", this.getQuantityOfProducts)
    // console.log("Cantidad a pagar: USD$", this.getTotalToPay)

    const $header = createDomElement('div', {'class': 'header'})
    const $gamesContainer = createDomElement('div', {'class': 'games-container'})
    const $title = createDomElement('h2', {}, 'Tu carrito')
    const $btnClose = createDomElement('button', {}, 'Cerrar')
    $btnClose.addEventListener('click', (ev) => { ev.currentTarget.closest('dialog').close() })

    $header.append($title, $btnClose);
    const $modal = createModal({content: [$header, $gamesContainer]})
    
    const $totalToPay = createDomElement('p', {}, `Total: ${this.getTotalToPay}`)
    
    for(const cartData of this.#products) {
      const gameData = catalog.find(game => game.getId == cartData.id).getAllData
      
      const $container = document.createElement('div')
      $gamesContainer.append($container)

      const $h3 = createDomElement('h3', {}, gameData.name)

      const $quantity = createDomElement('span', {}, `x${cartData.amount} `)
      $h3.prepend($quantity)

      const $img = createDomElement('img', {'src': GAMES_IMG_URL + gameData.cover.capsule, 'alt': `Portada del juego ${gameData.name}`})
      
      const $price = createDomElement('p', {}, `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`)

      const $btnAdd = createDomElement('button', {}, 'Agregar')
      $btnAdd.addEventListener('click', () => {
        this.addProduct(cartData.id)
        $quantity.innerText = `x${cartData.amount} `
        $price.innerText = `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`
        $totalToPay.innerText = `Total: ${this.getTotalToPay}`
      })
      
      const $btnDelete = createDomElement('button', {}, 'Eliminar')
      $btnDelete.addEventListener('click', (ev) => {
        this.deleteProduct(cartData.id)
        $quantity.innerText = `x${cartData.amount} `
        $price.innerText = `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`
        $totalToPay.innerText = `Total: ${this.getTotalToPay}`

        if(cartData.amount <= 0) $container.remove()
        ev.stopPropagation()
      })
      
      $container.append($h3, $img, $price, $btnAdd, $btnDelete)
    }

    const $btnEmptyCart = createDomElement('button', {}, 'Vaciar carrito')
    $btnEmptyCart.addEventListener('click', (ev) => {
      this.#products.length = 0
      localStorage.setItem("cart", JSON.stringify(this.#products))
      
      $gamesContainer.innerText = ''
      this.updateMiniCart()

      $modal.close()
      
      ev.stopPropagation()
    })

    const $btnCheckout = createDomElement('button', {}, 'Continuar con el pago')

    $modal.append($totalToPay, $btnEmptyCart, $btnCheckout)
    $modal.showModal()
  }

  get getQuantityOfProducts() {
    return this.#products.reduce((total, currentValue) => total + currentValue.amount, 0)
  }
  
  get getTotalToPay() {
    return this.#products.reduce((total, currentValue) => {
      const search = catalog.find(game => game.getId == currentValue.id)
      return total + search.getPrice * currentValue.amount
    }, 0).toFixed(2)
  }
}