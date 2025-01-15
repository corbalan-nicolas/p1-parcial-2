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
const catalogContainer = document.querySelector('#catalogContainer')

const GAMES_IMG_URL = 'img/games/'
// VARIABLES - ENDING ------------------------------------------------------------------------------------------



// JSON - STARTS -----------------------------------------------------------------------------------------------
fetch('database.json').then(response => response.json()).then(database => {
  // GENRES
  // Sort genres by name to make it easier for the user to find a specific genre.
  database['t_genres'].sort((a, b) => a.name > b.name)
  for(const genre of database['t_genres']) {
    const id = genre.id_genre
    const name = genre.name

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
  for(const game of games) {
    catalogContainer.append(game.createCard())
  }
}

document.querySelector('#btnShowCart').addEventListener('click', () => { cart.showModal()})
// SHOW CATALOG - ENDING ---------------------------------------------------------------------------------------



// SORT BY - STARTS --------------------------------------------------------------------------------------------
function sortCatalog(by = 'moreRelevant', games = catalog) {
  switch (by) {
    case 'moreRelevant':
      games.sort((a, b) => b.getSales - a.getSales)
      break;
      
    case 'lowerPrice':
      games.sort((a, b) => a.getPrice - b.getPrice)
      break;
      
    case 'higherPrice':
      games.sort((a, b) => b.getPrice - a.getPrice)
        break;
      
    case 'name':
      games.sort((a, b) => a.getName > b.getName)
        break;
        
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
document.querySelector('#filterByName').addEventListener('input', (ev) => {
  filterByName = ev.currentTarget.value;
  showFilteredCatalog();
})

document.querySelector('#filterByPrice').addEventListener('input', (ev) => {
  const $span = document.querySelector('#filterByPriceSpan');

  if(ev.currentTarget.value >= ev.currentTarget.max) { $span.innerText = 'Cualquier precio' }
  else { $span.innerText = `Menos de ${ev.currentTarget.value}` }

  filterByPrice = ev.currentTarget.value;
  showFilteredCatalog();
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
  if(document.querySelector('.special-offer')) return false

  const $noModal = createModal({content: 'special-ofertón', attributes: {'class': 'special-offer'}})
  
  // Pick a game and get all the data
  let offerData = {}
  const search = catalog.some((game) => game.hasGenres([genre]) && game.getDiscount > 0)
  if(false && search) {
    // Pick a game based on the selected genre
    console.log("Hay un juego de oferta en esta categoría! más concretamente este:", search);
  }else {
    // Pick a random
    const posibilities = catalog.filter((current) => current.getDiscount > 0)
    
    let picked;
    do {
      picked = posibilities[Math.floor(Math.random() * posibilities.length)].getId
    }while(picked === lastGameOffered)
    lastGameOffered = picked

    offerData = catalog.find((game) => game.getId == picked).getAllData
  }
  
  const $img = createDomElement('img', {'src': `${GAMES_IMG_URL + offerData.cover.capsule}`, 'alt': `Portada del juego ${offerData.name}`})
  
  const $title = createDomElement('h2', {}, `Conseguí ${offerData.name} a un ${offerData.discount}% de descuento`)

  const $btnClose = createDomElement('button', {}, 'Cerrar')
  $noModal.addEventListener('click', () => {
    $noModal.closest('dialog').close()
    clearTimeout(autoClose)
  })
  
  $noModal.append($img, $title, $btnClose)
  $noModal.show()
  
  let autoClose = setTimeout(() => {
    $noModal.close()
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
function createDomElement(tag, attributes, content = ''){
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
function createModal({content = null, attributes = {}, staticBackdrop = false, closeEvent = true, insert = {element: document.body, position: 'prepend'}}){
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
    $modal.addEventListener('click', (ev) => {
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



// {
//   "id": 0,
//   "name": "gameName",
//   "descr": "gameDescription",
//   "genres": [2],
//   "cover": {
//     "header": "game_name_header.jpg",
//     "capsule": "game_name_capsule.jpg"
//   },
//   "carouselImages": [
//     "game_name_carousel_1.jpg",
//     "game_name_carousel_2.jpg",
//     "game_name_carousel_3.jpg",
//     "game_name_carousel_4.jpg",
//     "game_name_carousel_5.jpg",
//     "game_name_carousel_6.jpg",
//     "game_name_carousel_7.jpg",
//     "game_name_carousel_8.jpg",
//     "game_name_carousel_9.jpg",
//     "game_name_carousel_10.jpg",
//     "game_name_carousel_11.jpg",
//     "game_name_carousel_12.jpg",
//     "game_name_carousel_13.jpg",
//     "game_name_carousel_14.jpg",
//     "game_name_carousel_15.jpg",
//     "game_name_carousel_16.jpg",
//     "game_name_carousel_17.jpg",
//     "game_name_carousel_18.jpg",
//     "game_name_carousel_19.jpg",
//     "game_name_carousel_20.jpg"
//   ],
//   "price": 0.99,
//   "discount": 0,
//   "sales": 0
// }