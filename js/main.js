'use strict';

/*
Author: Corbalan, Nicolas Leonel
--Index--
00 Page title
00 Variables
00 Json
00 Show filtered games (function)
00 Filters configuration
00 Cart
00 Checkout
00 Validations

TO DO:
Oferta de 10 seg a modo de banner flotante que después desaparece
Checkout
*/

document.title = 'Tienda - Pwonz';
/* Variables (Start) ******************************************************/
const IMG_URL = '../img/games/';

const games = [];
const genres = {};
// const cart = new Cart();

let filterByName = '';
let filterByPrice = Infinity;
const filterByGenre = [];
/* Variables (End) ******************************************************/


/* Json (Start) ******************************************************/
fetch('db.json').then(response => response.json()).then(db => {
  
  db.t_games.forEach(game => {
    games.push(new Game({
      id: game.id,
      name: game.name,
      description: game.description,
      genres: game.genres,
      price: game.price,
      discount: game.discount,
      cover: game.cover,
      carouselImages: game.carousel_images
    }))
  });
  
  showFilteredGames();
})
/* Json (End) ******************************************************/


/* Show filtered games (Start) ******************************************************/
function showFilteredGames(_games = games) {
  // Reset
  const $container = document.querySelector('#catalog');
  $container.innerText = '';
  

  // Filter
  console.log("HOla");
  
  // if(filterByName !== '') {
  //   _games = _games.filter(game => game.getName.trim().toLowerCase().includes(filterByName.trim().toLowerCase()));
  // }
  // _games = _games.filter(game => game.getPrice <= filterByPrice);
  // _games = _games.filter(game => game.hasGenres(filterByGenre));
  console.log(_games);
  

  // Show  
  _games.forEach(game => $container.append(game.createDefaultCard()));
}
/* Show filtered games (End) ******************************************************/


/* Filters configuration (Start) ******************************************************/
document.getElementById('searchByName').addEventListener('input', (ev) => {
  filterByName = ev.currentTarget.value();
  showFilteredGames();
})

// document.getElementById('filterByPrice').addEventListener('input', (ev) => {
//   const $msjContainer = document.getElementById('mo');
//   const inputValue = parseInt(ev.currentTarget.value);

//   let msj = `Menos de ${inputValue}`;
//   msj = ((inputValue >= ev.currentTarget.max)) ? 'Cualquier precio' : msj;
//   msj = (inputValue <= 0) ? 'Gratuito' : msj;

//   $msjContainer.innerText = msj;

//   filterByPrice = inputValue;
//   showFilteredGames();
// })

// const $checkBoxes = document.querySelectorAll('input[type='checkbox']');
// $checkBoxes.forEach($checkbox => {
//   $checkbox.addEventListener('change', (ev) => {
//     const genreId = ev.currentTarget.value;
//     if(ev.currentTarget.checked) {
//       filterByGenre.push(genreId);
//     }else {
//       let index = filterByGenre.indexOf(genreId);
//       filterByGenre.splice(index, 1);
//     }

//     showFilteredGames();
//   })
// })
/* Filters configuration (End) ******************************************************/


/* Dom (Start) ******************************************************/
function createDomElement({tag, attributes = {}, content}){
  const $domElement = document.createElement(tag);

  for(let att in attributes) {
    $domElement.setAttribute(att, attributes[att]);
  }
  if(typeof content === 'object') $domElement.append(content);
  if(typeof content === 'string') $domElement.innerText = content;

  return $domElement;
}

/**
 * 
 * @param {DomElement} modalContent (*) All the dom elements that will be inside (please avoid using strings as content)
 * @param {Boolean} staticBackdrop Makes it able or unable to close the modal by clicking outside of it.
 * @param {String} insertOn 'append' or 'prepend' to put it on the document.body
 * @returns {DomElement} The modal
 */
function createModal({modalContent, staticBackdrop = false, insertOn = null}) {

  const $modal = document.createElement('dialog');

  // Put the content on the modal
  if(typeof modalContent === 'object') $modal.append(modalContent);
  if(typeof modalContent === 'string') $modal.innerHTML = modalContent;

  // Event to remove the modal when it closes
  $modal.addEventListener('close', ()=>{ $modal.remove() })

  // Close the modal by clicking in the "backdrop"
  if(!staticBackdrop) {
    $modal.addEventListener('click', (ev) => {
      const condA = ev.x < $modal.offsetLeft;
      const condB = ev.x > $modal.offsetLeft + $modal.offsetWidth;
      const condC = ev.y < $modal.offsetTop;
      const condD = ev.y > $modal.offsetTop + $modal.offsetHeight;
    
      if(condA || condB || condC || condD) {
        $modal.close();
      }  
    })
  
  }

  // Insert in the document.body
  if(insertOn !== null && typeof insertOn === 'string') {
    if(insertOn.trim().toLowerCase() === 'append') {
      document.body.append($modal);
    }else if(insertOn.trim().toLowerCase() === 'prepend') {
      document.body.prepend($modal);
    }
  }


  return $modal;

}
/* Dom (End) ******************************************************/

/* Validations (Start) ******************************************************/
function isEmptyString(value) {
  return !(typeof value === 'string' && value.trim().length > 0);
}
/* Validations (End) ******************************************************/

console.log(isEmptyString(" "));
