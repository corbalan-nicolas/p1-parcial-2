'use strict'
document.title = 'Pwonz';

// VARIABLES - STARTS ------------------------------------------------------------------------------------------
const cart = new Cart();

const genres = {}
const catalog = []

let filterByName = '';
let filterByPrice = 9999;
let filterByGenres = [];

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
      modifyFilterByGenres(id);
    })
  }

  // GAMES
  for(const game of database['t_games']) {
    catalog.push(new Game(game))
  }

  // RESET
  document.querySelector('#filterByName').value = '';
  document.querySelector('#filterByPrice').value = 60;
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



// DOM FUNCTIONS - STARTS --------------------------------------------------------------------------------------
/**
 * A function that creates a DOM element. Very useful to avoid repeating so much code
 * @param {String} tag the html tag you want to create
 * @param {Object} attributes an object with all the ${'attribute': 'value'} you want to put it on the dom element
 * @param {String} content very self-explanatory, isn it?
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
 * @param {Object} namedParams Named Parameters
 * @returns Modal
 */
// function createModal({content,  = {type: 'modal', staticBackdrop: false, closeEvent: true, insert = {element: document.body,position: 'prepend'}}}){
function createModal({content = null, staticBackdrop = false, closeEvent = true, insert = {element: document.body, position: 'prepend'}}){
  const $modal = document.createElement('dialog')
  

  // CONRENT
  if(content !== null) {
    if(typeof content === 'string') {
      // Recieved a string. E.g. '<p>Hello world</p>'
      // $modal.innerHTML = content // ⚠ NO PERMITIDO EN LA CONSIGNA, PERO QUERÍA CONTEMPLARLO IGUALMENTE ⚠
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