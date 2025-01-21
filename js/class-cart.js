class Cart {
  #products
  constructor(products = []) {
    if(localStorage.getItem('cart') !== null) {
      this.#products = JSON.parse(localStorage.getItem('cart'));
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
    localStorage.setItem('cart', JSON.stringify(this.#products))
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

    localStorage.setItem('cart', JSON.stringify(this.#products))
    this.updateMiniCart()
  }

  emptyCart() {
    this.#products.length = 0

    localStorage.setItem('cart', JSON.stringify(this.#products))
    this.updateMiniCart()
  }

  updateMiniCart() {
    const $span = document.querySelector('#quantityOfProducts')
    $span.innerText = this.getQuantityOfProducts;
  }

  showModal() {
    const $header = createDomElement('div', {'class': 'header'})
    const $gamesContainer = createDomElement('div', {'class': 'games-container'})
    const $title = createDomElement('h2', {}, 'Tu carro de la compra')
    const $btnClose = createDomElement('button', {'aria-label': 'Cerrar carrito', 'class': 'btn'}, 'X')
    $btnClose.addEventListener('click', (ev) => { ev.currentTarget.closest('dialog').close() })

    $header.append($title, $btnClose);
    const $modal = createModal({content: [$header, $gamesContainer]})
    
    const $totalToPay = createDomElement('p', {}, `Total: ${this.getTotalToPay}`)
    
    for(const cartData of this.#products) {
      const gameData = catalog.find(game => game.getId == cartData.id).getAllData
      
      const $container = createDomElement('div', {'class': 'card--horizontal'})
      $gamesContainer.append($container)

      const $h3 = createDomElement('h3', {'class': 'title'}, gameData.name)

      const $quantity = createDomElement('span', {'class': 'quantity'}, `x${cartData.amount} `)
      $h3.prepend($quantity)

      const $img = createDomElement('img', {'class': 'cover', 'src': GAMES_IMG_URL + gameData.cover.capsule, 'alt': `Portada del juego ${gameData.name}`})
      
      const $price = createDomElement('p', {'class': 'price'}, `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`)

      const $btnAdd = createDomElement('button', {}, 'Agregar')
      $btnAdd.addEventListener('click', () => {
        this.addProduct(cartData.id)
        $quantity.innerText = `x${cartData.amount} `
        $price.innerText = `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`
        $totalToPay.innerText = `Total: ${this.getTotalToPay}`
      })
      
      const $btnDelete = createDomElement('button', {}, 'Eliminar')
      $btnDelete.addEventListener('click', (ev) => {
        ev.stopPropagation()

        this.deleteProduct(cartData.id)
        $quantity.innerText = `x${cartData.amount} `
        $price.innerText = `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`
        $totalToPay.innerText = `Total: ${this.getTotalToPay}`

        if(this.getQuantityOfProducts <= 0) $modal.close()
        if(cartData.amount <= 0) $container.remove()
      })
      
      $container.append($h3, $img, $price, $btnAdd, $btnDelete)
    }

    const $btnEmptyCart = createDomElement('button', {}, 'Vaciar carrito')
    const $btnCheckout = createDomElement('button', {}, 'Continuar con el pago')

    if(this.getQuantityOfProducts > 0) {
      $btnEmptyCart.addEventListener('click', (ev) => {
        this.emptyCart()
        $modal.close()
      })
      
      $btnCheckout.addEventListener('click', () => {
        this.generateCheckoutModal()
        $modal.close()
      })
    }else {
      $btnEmptyCart.disabled = 'true'
      $btnCheckout.disabled = 'true'
    }
    
    $modal.append($totalToPay, $btnEmptyCart, $btnCheckout)
    $modal.showModal()
  }

  generateCheckoutModal() {
    function createInput({type= 'text', id, labelText, placeholder = '', autocomplete = 'off'}) {  
      const $inputContainer = createDomElement('div')
      const $label = createDomElement('label', {'for': id}, labelText)
      const $input = createDomElement('input', {'type': type, 'id': id, 'name': id, 'placeholder': placeholder, 'autocomplete': autocomplete})
      const $error = createDomElement('small')
      
      $inputContainer.append($label, $input, $error)
        
      return {
          container: $inputContainer,
          label: $label,
          input: $input,
          error: $error
        }
    }
    
  
    const $modal = createModal({})
    const $title = createDomElement('h2', {}, 'Continuar con el pago')
    const $form = createDomElement('form', {id:'formCheckout', method:'post', action:'#'})
    
    const $payMethodContainer = createDomElement('div')
    const $payMethodTitle = createDomElement('h3', {}, 'Método de pago')
    
    const $typeOfCardContainer = createDomElement('div')
    const $typeOfCardLabel = createDomElement('label', {'for': 'typeOfCard'}, 'Selecciona un método de pago')
    const $typeOfCard = createDomElement('select', {'name': 'typeOfCard', 'id': 'typeOfCard'})
    $typeOfCard.append(new Option('Visa', 'Visa'))
    $typeOfCard.append(new Option('MasterCard', 'MasterCard'))
    $typeOfCardContainer.append($typeOfCardLabel, $typeOfCard)
    
    const $targetNum = createInput({id: 'targetNum', placeholder: '0000 0000 0000 0000', labelText: '(*) Número de tarjeta'})
    
    const $caducityContainer = createDomElement('div')
    const $caducityLabel = createDomElement('label', {'for': 'caducityMonth'}, 'Fecha de caducidad')
    const $caducityMonth = createDomElement('select', {'name': 'caducityMonth', 'id': 'caducityMonth', 'aria-label': 'Mes de caducidad'})
    for(let i = 1; i <= 12; i++) {
      const $option = new Option(i, i)
      $caducityMonth.append($option)
    }
    
    const $caducityYear = createDomElement('select', {'name': 'caducityYear', 'id': 'caducityYear', 'aria-label': 'Año de caducidad'})
    const actualYear = new Date().getFullYear()
    const marginOfYears = actualYear + 25
    for(let i = actualYear; i <= marginOfYears; i++) {
      const $option = new Option(i, i)
      $caducityYear.append($option)
    }
    $caducityContainer.append($caducityLabel, $caducityMonth, $caducityYear)
    
    $payMethodContainer.append($payMethodTitle, $typeOfCardContainer, $targetNum.container, $caducityContainer)
    

    
    const $facturationInfoContainer = createDomElement('div')
    const $facturationInfoTitle = createDomElement('h3', {}, 'Información de facturación')
    const $name = createInput({type: 'text', id: 'name', labelText: '(*) Nombre'})
    const $direct = createInput({type:'text', id: 'direct', labelText: '(*) Dirección de facturación'})
    const $directLine2 = createInput({type:'text', id: 'directLine2', labelText: 'Dirección de facturación (segunda línea)'})
    const $locality = createInput({type:'text', id: 'locality', labelText: '(*) Localidad'})
    const $zip = createInput({type:'text', id: 'zip', labelText: '(*) Código postal o zip'})
    const $country = createInput({type:'text', id: 'country', labelText: '(*) País'})
    const $tel = createInput({type:'tel', id: 'tel', labelText: '(*) Número telefónico'})
    $facturationInfoContainer.append($facturationInfoTitle, $name.container, $tel.container, $direct.container, $directLine2.container, $locality.container, $zip.container, $country.container)
    


    const $recieveContainer = createDomElement('div')
    const $recieveTitle = createDomElement('h3', {}, 'Direccion de correo electrónico')
    const $message = createDomElement('p', {}, 'Los códigos de steam serán enviados al correo electrónico introducido, así que por favor asegúrese de que sean correctos')
    const $email = createInput({type: 'email', id: 'email', labelText: '(*) Gmail', autocomplete:'on'})
    const $repeatEmail = createInput({type: 'email', id: 'repeatEmail', labelText: '(*) Repetir gmail'})
    $recieveContainer.append($recieveTitle, $message, $email.container, $repeatEmail.container)
    
    const $btnPrevStep = createDomElement('button', {}, 'Volver')
    $btnPrevStep.addEventListener('click', (ev) => {
      ev.preventDefault()
      $modal.close()
      this.showModal()
    })
    
    const $btnNextStep = createDomElement('button', {}, 'Continuar')
    $btnNextStep.addEventListener('click', (ev) => {
    })
    
    $form.append($payMethodContainer, $facturationInfoContainer, $recieveContainer, $btnPrevStep, $btnNextStep)
    $modal.append($title, $form)
    $modal.showModal()

    $form.addEventListener('submit', (ev) => {
      ev.preventDefault()
      console.log('Evento submit activado')
      const formData = new FormData(ev.currentTarget)
      let isValidForm = true
      
      // Target Number
      if(isEmptyString(formData.get('targetNum'))) {
        $targetNum.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }else if(!isNumber(formData.get('targetNum'))) {
        $targetNum.error.innerText = 'Sólo se admiten números (sin espacios ni guiones)'
        isValidForm = false
      }
      
      // Caducity month - caducityMonth
      if(!isBetweenNumbers(formData.get('caducityMonth'), 1, 12)){
        console.log('caducityMonth no es valido')
        isValidForm = false
      }
      
      // Caducity Year - caducityYear
      if(!isBetweenNumbers(formData.get('caducityYear'), actualYear, marginOfYears)){
        console.log('caducityYear no es valido')
        isValidForm = false
      }
      
      // Name - name
      if(isEmptyString(formData.get('name'))){
        $name.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // Telephone - tel
      if(isEmptyString(formData.get('tel'))){
        $tel.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // Direction - direct
      if(isEmptyString(formData.get('direct'))){
        $direct.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // Direction (second line) - directLine2
      if(formData.get('directLine2')){
      
      }
      
      // Locality - locality
      if(isEmptyString(formData.get('locality'))){
        $locality.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // Zip - zip
      if(isEmptyString(formData.get('zip'))){
        $zip.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // Country - country
      if(isEmptyString(formData.get('country'))){
        $country.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }
      
      // email - email
      if(isEmptyString(formData.get('email'))){
        $email.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }else if(!isValidEmail(formData.get('email'))) {
        $email.error.innerText = 'Este correo electrónico no es válido'
        isValidForm = false
      }else if(areDifferentStrings(formData.get('email'), formData.get('repeatEmail'))){
        $repeatEmail.error.innerText = 'Los correos no coinciden'
        isValidForm = false
      }
      
      // Repeat repeatEmail
      if(isEmptyString(formData.get('repeatEmail'))){
        $repeatEmail.error.innerText = 'Este campo es obligatorio, no puede dejarlo vacío'
        isValidForm = false
      }else if(!isValidEmail(formData.get('repeatEmail'))) {
        $repeatEmail.error.innerText = 'Este correo electrónico no es válido'
        isValidForm = false
      }else if(areDifferentStrings(formData.get('email'), formData.get('repeatEmail'))){
        $repeatEmail.error.innerText = 'Los correos no coinciden'
        isValidForm = false
      }
      


      // "SENDING" THE FORM
      if(isValidForm) {
        // $form.submit()
        const payMethod = formData.get('typeOfCard')
        const email = formData.get('email');
        const lastCardNumbers = (formData.get('targetNum').slice(-2).padStart(4, '*'))
        $modal.close()
        this.generatePrePayModal(payMethod, lastCardNumbers, email)
      }
    })
  }
  
  generatePrePayModal(payMethod, lastCardNumbers, email){
    const $header = createDomElement('div', {'class': 'header'})
    const $gamesContainer = createDomElement('div', {'class': 'games-container'})
    const $title = createDomElement('h2', {}, 'Revision + Compra')
    $header.append($title);

    const $modal = createModal({})
    const $totalToPay = createDomElement('p', {}, `Total: ${this.getTotalToPay}`)
    
    for(const cartData of this.#products) {
      const gameData = catalog.find(game => game.getId == cartData.id).getAllData
      
      const $container = document.createElement('div')
      
      const $h3 = createDomElement('h3', {}, gameData.name)
      
      const $quantity = createDomElement('span', {}, `x${cartData.amount} `)
      $h3.prepend($quantity)
      
      const $img = createDomElement('img', {'src': GAMES_IMG_URL + gameData.cover.capsule, 'alt': `Portada del juego ${gameData.name}`})
      
      const $price = createDomElement('p', {}, `USD$ ${((gameData.price - (gameData.discount * gameData.price) / 100) * cartData.amount).toFixed(2)}`)
      
      $container.append($h3, $img, $price)
      $gamesContainer.append($container)
    }
    
    const $payMethodContainer = document.createElement('div')
    const $payMethodKey = createDomElement('p', {}, 'Método de pago')
    const $payMethodValue = createDomElement('p', {}, `${payMethod} que termina en ${lastCardNumbers}`)
    $payMethodContainer.append($payMethodKey, $payMethodValue)
    
    const $securityCodeContainer = document.createElement('div')
    const $securityCodeKey = createDomElement('p', {}, 'Código de seguridad')
    const $securityCodeValue = createDomElement('input', {'type': 'number'})
    const $securityCodeError = createDomElement('small')
    $securityCodeContainer.append($securityCodeKey, $securityCodeValue, $securityCodeError)
    
    const $emailContainer = document.createElement('div')
    const $emailKey = createDomElement('p', {}, 'Correo electrónico')
    const $emailValue = createDomElement('p', {}, `${email}`)
    $emailContainer.append($emailKey, $emailValue)
    
    const $termsLabel = createDomElement('label', {}, '(*) Acepto los términos de condiciones y servicios y le doy acceso total a mis tarjetas de crédito y permiso para su uso libre')
    const $termsCheckbox = createDomElement('input', {'type': 'checkbox'})
    const $termsError = createDomElement('small')
    $termsLabel.prepend($termsCheckbox)
    
    const $btnCancel = createDomElement('button', {}, 'Cancelar')
    $btnCancel.addEventListener('click', (ev) => { $modal.close() })
    
    const $btnBuy = createDomElement('button', {}, 'Comprar')
    $btnBuy.addEventListener('click', (ev) => {
      let isValidForm = true
      
      if(!$termsCheckbox.checked) {
        $termsError.innerText = 'Para continuar debe aceptar los términos de condiciones'
        isValidForm = false
      }
      
      if(isEmptyString($securityCodeValue.value)) {
        $securityCodeError.innerText = 'Ingrese el código de seguridad para continuar'
        isValidForm = false
      }
      

      if(isValidForm) {
        this.emptyCart()
        $modal.close()
        this.purchaseCompleteModal()
      }
    })
    
    $modal.append($header, $gamesContainer, $totalToPay, $payMethodContainer, $securityCodeContainer, $emailContainer, $termsLabel, $btnCancel, $btnBuy)
    $termsLabel.after($termsError)
    $modal.showModal()
  }

  purchaseCompleteModal() {
    const $modal = createModal({})
    const $title = createDomElement('h2', {}, '¡Gracias por su compra!')
    const $message = createDomElement('p', {}, 'Su compra ha sido exitosa, puede ver los códigos de regalo dentro de su Email ¡no se olvide de revisar la casilla de Spam!')
    const $btnClose = createDomElement('button', {}, 'Entendido')
    $btnClose.addEventListener('click', () => { $modal.close() })
    $modal.append($title, $message, $btnClose)
    $modal.showModal($title, $message)
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