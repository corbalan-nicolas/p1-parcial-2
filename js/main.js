'use strict'
document.title = 'Pwonz';

// VARIABLES - STARTS ------------------------------------------------------------------------------------------
const cart = new Cart();

const genres = {}
const catalog = []

let filterByName = '';
let filterByPrice = 9999;
let filterByGenres = [];

let lastGameOffered = null

const genresContainer = document.querySelector('#genresContainer')
const catalogContainer = document.querySelector('#catalog')

const GAMES_IMG_URL = 'img/games/' // The file with all the "games" images (banners and covers)
// VARIABLES - ENDING ------------------------------------------------------------------------------------------



// JSON - STARTS -----------------------------------------------------------------------------------------------
fetch('database.json').then(response => response.json()).then(database => {
  // GENRES
  // Sort genres by name to make it easier for the user to find a specific genre.
  database['t_genres'].sort((a, b) => {
    if(a.name > b.name) {
      return 1
    }else if(a.name < b.name) {
      return -1
    }
    return 0
  })
  
  for(const genre of database['t_genres']) {
    const id = genre.id_genre
    const name = genre.name
    
    const $p = createDomElement('p', {}, `${id.toString().padStart(2, ' ')}: ${name}`)
    

    // I keep the sorted genres in the 'genres' variable. (they don't keep the order tho)
    genres[`${id}`] = name

    // Create the DOM elements and append them into the 'genresContainer'
    const $container = document.createElement('div')
    genresContainer.append($container)
    
    const $label = createDomElement('label', {'for': `genre?id=${id}`}, name)
    $container.append($label)
    
    const $checkbox = createDomElement('input', {'type': 'checkbox', 'id': `genre?id=${id}`})
    $label.prepend($checkbox)
    $checkbox.addEventListener('change', (ev) => {
      modifyFilterByGenres(id)
    
      if(ev.currentTarget.checked) generateSpecialOffer(id)
    })
  }

  // GAMES
  for(const game of database['t_games']) {
    catalog.push(new Game(game))
  }

  // RESET
  document.querySelector('#filterByName').value = '';
  document.querySelector('#filterByPrice').value = document.querySelector('#filterByPrice').max;
  sortCatalog(document.querySelector('#sortBy').value)
  
  // SHOW
  showFilteredCatalog()
})
// JSON - ENDING -----------------------------------------------------------------------------------------------



// SHOW CATALOG - STARTS ---------------------------------------------------------------------------------------
function showFilteredCatalog(games = catalog) {
  catalogContainer.innerText = '';

  // Filters
  filterByName = filterByName.trim().toLowerCase();
  if(filterByName !== '') {
    games = games.filter(game => game.getName.trim().toLowerCase().includes(filterByName));
  }
  games = games.filter(game => parseInt(game.getPrice) <= parseInt(filterByPrice));
  games = games.filter(game => game.hasGenres(filterByGenres));
  
  // Cards
  if(games.length == 0) {
    document.querySelector('.no-results').classList.remove('d-none')
  }else {
    document.querySelector('.no-results').classList.add('d-none')
    for(const game of games) {
      catalogContainer.append(game.createCard())
    }
  }
}

document.querySelector('#btnShowCart').addEventListener('click', () => { cart.showModal()})
// SHOW CATALOG - ENDING ---------------------------------------------------------------------------------------



// SORT BY - STARTS --------------------------------------------------------------------------------------------
function sortCatalog(by = 'moreRelevant', games = catalog) {
  switch (by) {
    case 'moreRelevant':
      games.sort((a, b) => b.getSales - a.getSales)
      break
      
    case 'lowerPrice':
      games.sort((a, b) => a.getPrice - b.getPrice)
      break
      
    case 'higherPrice':
      games.sort((a, b) => b.getPrice - a.getPrice)
      break
      
    case 'name':
      games.sort((a, b) => {
        if(a.getName < b.getName) {
          return -1
        }
        if(a.getName > b.getName) {
          return 1
        }
        return 0
      })
      break

    default:
        games.sort((a, b) => a.getSales - b.getSales)
        break;
  }
} 

document.querySelector('#sortBy').addEventListener('change', (ev) => {
  sortCatalog(ev.currentTarget.value)
  showFilteredCatalog()
})
// SORT BY - ENDING --------------------------------------------------------------------------------------------



// FILTER BY - STARTS ------------------------------------------------------------------------------------------
let filterByNameTimer = null
document.querySelector('#filterByName').addEventListener('input', (ev) => {
  filterByName = ev.currentTarget.value

  if(filterByNameTimer != null) clearTimeout(filterByNameTimer)
  filterByNameTimer = setTimeout(showFilteredCatalog, 300)
})

let filterByPriceTimer = null
document.querySelector('#filterByPrice').addEventListener('input', (ev) => {
  const $span = document.querySelector('#filterByPriceSpan');

  if(ev.currentTarget.value >= ev.currentTarget.max) { $span.innerText = 'Cualquier precio' }
  else { $span.innerText = `Menos de USD$ ${ev.currentTarget.value}` }

  filterByPrice = ev.currentTarget.value;

  if(filterByPriceTimer != null) clearTimeout(filterByPriceTimer)
  filterByPriceTimer = setTimeout(showFilteredCatalog, 300)
})

// Call it when every checkbox is generated (in the json call)
function modifyFilterByGenres(genre) {
  if(filterByGenres.includes(genre)) {
    const indexOfGenre = filterByGenres.indexOf(genre);
    filterByGenres.splice(indexOfGenre, 1)
  }else {
    filterByGenres.push(genre);
  }
  showFilteredCatalog();
}
// FILTER BY - ENDING ------------------------------------------------------------------------------------------



// SPECIAL OFFER - STARTS --------------------------------------------------------------------------------------
function generateSpecialOffer(genre) {
  // If there's an active offer already. It won't do anything (return false)
  if(document.querySelector('.special-offer')) return false

  const $noModal = createModal({attributes: {'class': 'special-offer'}})
  
  // Pick a game and get all the data
  let offerData = {}
  const search = catalog.some((game) => game.hasGenres([genre]) && game.getDiscount > 0)
  if(false && search) {
    // Pick a game based on the selected genre
    console.log("Hay un juego de oferta en esta categoría! más concretamente este:", search);
  }else {
    // Pick a random game with discount
    const posibilities = catalog.filter((current) => current.getDiscount > 0)
    
    let picked;
    do {
      picked = posibilities[Math.floor(Math.random() * posibilities.length)].getId
    }while(picked === lastGameOffered)
    lastGameOffered = picked

    offerData = catalog.find((game) => game.getId == picked)
  }
  
  const closeModal = function() {
    $noModal.classList.add('go-right')
    $noModal.addEventListener('transitionend', () => {
      $noModal.close()
      clearTimeout(autoClose)
    })
  }

  const $img = createDomElement('img', {'class': 'cover', 'src': `${GAMES_IMG_URL + offerData.getCoverCapsule}`, 'alt': `Portada del juego ${offerData.getName}`})
  const $title = createDomElement('h2', {'class': 'title'}, `Ahorrá un ${offerData.getDiscount}%`)
  const $price = createDomElement('p', {'class': 'price'}, `USD $${offerData.getPrice}`)
  const $btnClose = createDomElement('button', {'class': 'btn btn--cube btn-close btn--text-only'}, 'X')
  $btnClose.addEventListener('click', (ev) => {
    ev.stopPropagation()

    closeModal()
  })
  
  const $addToCart = createDomElement('button', {'class': 'btn btn-add-to-cart'}, 'Añadir al carrito')
  $addToCart.addEventListener('click', (ev) => {
    ev.stopPropagation()
    cart.addProduct(offerData.getId)

    closeModal()
  })
  
  $noModal.addEventListener('click', () => {
    offerData.showDetails()

    closeModal()
  })
  
  const $body = createDomElement('div', {'class': 'offer-body'})
  $body.append($title, $btnClose, $price, $addToCart)

  $noModal.append($img, $body)
  $noModal.show()
  
  let autoClose = setTimeout(() => {
    closeModal()
  }, 10000)
}
// SPECIAL OFFER - ENDING --------------------------------------------------------------------------------------



// DOM FUNCTIONS - STARTS --------------------------------------------------------------------------------------
/**
 * A function that creates a DOM element. Very useful to avoid repeating so much code
 * @param {String} tag the html tag you want to create
 * @param {Object} attributes an object with all the ${'attribute': 'value'} you want to put it on the dom element
 * @param {String} content a string, dom element, or an array of dom elements
 */
function createDomElement(tag, attributes = {}, content = ''){
  const $domElement = document.createElement(tag)
  
  for(const att in attributes) {
    $domElement.setAttribute(att, attributes[att])
  }
  
  if (content != '') $domElement.innerText = content
  return $domElement
}


/**
 * 
 * @param {Object} namedParams Named Parameters D:
 * @returns Modal
 */
function createModal({content = null, attributes = {}, staticBackdrop = false, closeEvent = true, insert = {element: document.body, position: 'append'}}){
  const $modal = document.createElement('dialog')
  

  // CONRENT
  if(content !== null) {
    if(typeof content === 'string') {
      // Recieved a string. E.g. '<p>Hello world</p>'
      $modal.innerText = content
      // $modal.innerHTML = content // ⚠ NO ESTÁ PERMITIDO EN LA CONSIGNA, PERO QUERÍA CONTEMPLARLO IGUALMENTE ⚠
    }else if (typeof content === 'object' && content.length === undefined) {
      // Recieved ONE single <DOM element> (I guess)
      $modal.append(content)
    }else if (typeof content === 'object') {
      // Recieved multiples <DOM elements> in an array
      for(const i of content) {
        $modal.append(i)
      }
    }
  }


  // ATTRIBUTES
  for(const att in attributes) {
    $modal.setAttribute(att, attributes[att])
  }


  // STATIC BACKDROP
  if(!staticBackdrop) {
    $modal.addEventListener('mousedown', (ev) => {
      const element = ev.currentTarget.getBoundingClientRect()
  
      const conditionA = ev.clientX < element.left
      const conditionB = ev.clientX > element.right
      const conditionC = ev.clientY < element.top
      const conditionD = ev.clientY > element.bottom
  
      if(conditionA || conditionB || conditionC || conditionD) {
        $modal.close();
      }
    })
  }


  // CLOSE EVENT
  if(closeEvent) $modal.addEventListener('close', () => { $modal.remove() })


  // INSERT
  switch(insert.position) {
    case 'before':
      insert.element.before($modal);
      break;
    case 'prepend':
      insert.element.prepend($modal);
      break;
    case 'append':
      insert.element.append($modal);
      break;
    case 'after':
      insert.element.after($modal);
      break;
    default:
      // No insert
      break;
  }
  
  return $modal;
}
// DOM FUNCTIONS - ENDING --------------------------------------------------------------------------------------



// DARK MODE - STARTS ------------------------------------------------------------------------------------------
let theme = localStorage.getItem('theme')

if (theme !== 'white' && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add('dark-mode');
}

document.querySelector('#btnDarkMode').addEventListener('click', (ev) => {
  document.body.classList.toggle('dark-mode');
  setThemeInLocalStorage()
})

function setThemeInLocalStorage() {
  if (document.body.classList.contains('dark-mode')) {
    theme = 'dark'
  }else {
    theme = 'white'
  }
  localStorage.setItem('theme', theme)
}
// DARK MODE - ENDING ------------------------------------------------------------------------------------------



// SHORTCUTS - STARTS ------------------------------------------------------------------------------------------
// document.addEventListener('keydown', (ev) => {
//   // OPEN CART
//   if (ev.key == 'C' || ev.key == 'c') {
//     const dialog = document.querySelector('dialog')
//     if(dialog) dialog.close()

//     cart.showModal()
//   }
// })
// cart.showModal()
// SHORTCUTS - ENDING ------------------------------------------------------------------------------------------