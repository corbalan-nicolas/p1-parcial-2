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

    const $header = document.createElement('div')
    const $titulo = createDomElement('h2', {}, 'Tu carrito')
    const $btnClose = createDomElement('button', {}, 'Cerrar')
    $btnClose.addEventListener('click', (ev) => { ev.currentTarget.closest('dialog').close() })

    $header.append($titulo, $btnClose);
    const $modal = createModal({content: $header})
    
    const $totalToPay = createDomElement('p', {}, `Total: ${this.getTotalToPay}`)

    for(const cartData of this.#products) {
      const gameData = catalog.find(game => game.getId == cartData.id).getAllData
      
      const $container = document.createElement('div')
      $modal.append($container)

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
      console.log(gameData.name)
    }

    const $btnCheckout = createDomElement('button', {}, 'PAGARRRRR')

    $modal.append($totalToPay, $btnCheckout)
    $modal.showModal();
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




// TO DOOOOOOOOOOOOOOOO
// VER Q ONDA CON LA PRIMERA CARGA (NO PRODUCTOS DESDE EL RANGE)