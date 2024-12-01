"use strict";

/*
 * CORBALAN, NICOLAS LEONEL
 */

// VARIABLES ------------------------------------------------------------------------------------------------------------------

/**
 * Esta variable almacena todos los juegos de la tienda
 * @type {Array<Object>}
 */
const juegos = [];
const carrito = new Carrito();

// Filtros
let filtroNombre = ""; // Variable para filtrar por nombre (escrito por input)
let filtroPrecio = Infinity; // Para filtrar por precio
const filtroGeneros = []; // Variable para filtrar por géneros

// Objetos
const GENEROS = {
    1 : "Metroidvania",
    2 : "Videojuego de pelea",
    3 : "Plataformas",
    4 : "Aventura",
    5 : "Shooter",
    6 : "Rol (RPG)",
    7 : "Logica",
    8 : "Shooter en 1ra persona",
    9 : "Estrategia",
    10 : "Simulación",
    11 : "Mundo abierto",
    12 : "Supervivencia",
    13 : "Acción",
    14 : "Shooter en 3ra persona",
    15 : "Rítmico",
    16 : "Habilidad",
    17 : "Multijugador cooperativo",
    18 : "Survival Horror",
    19 : "Puzzle",
    20 : "Beat 'em up",
    21 : "Física",
    22 : "Roguelike",
    23 : "Gestión de recursos"
}

// JSON -----------------------------------------------------------------------------------------------------------------------

fetch("juegos.json").then(response => response.json()).then(productoJson => {
    productoJson.forEach((producto)=> {
        // Guardo el producto en una variable
        const obj = new Producto(
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.imagenes,
            producto.generos
        );
        // Lo pusheo en el array
        juegos.push(obj);
    });

    mostrarJuegosFiltrados(juegos);
});

// MOSTRAR --------------------------------------------------------------------------------------------------------------------

/**
 * Función que muestra todos los juegos en el <main> a modo de card, para luego asignarle
 * los eventos clicks respectivos (agregar al carrito & abrir modal)
 * @param {Array} _arrayJuegos (opcional) juegos a mostrar
 */
function mostrarJuegosFiltrados(_arrayJuegos = juegos) {
    const $row = document.querySelector("#rowProducts");
    $row.innerText = "";

    // Filtro los juegos
    filtroNombre = filtroNombre.trim().toLowerCase();
    if(filtroNombre !== "") {
        _arrayJuegos = _arrayJuegos.filter(juego => juego.getNombre.trim().toLowerCase().includes(filtroNombre));
    }
    _arrayJuegos = _arrayJuegos.filter(juego => juego.getPrecio <= filtroPrecio);
    _arrayJuegos = _arrayJuegos.filter(juego => juego.tieneGeneros(filtroGeneros));

    // Recorro el array filtrado y genero la estructura html para finalmente mostrarlo
    _arrayJuegos.forEach((producto)=> {
        const $col = document.createElement("div");
        $col.classList.add("col-6", "col-sm-4", "mb-4");

        $col.append(producto.generarCard());
        $row.append($col)
    })
}
/*
 * Genero los filtros de forma dinámica recorriendo el objeto GENEROS
 */
const $ul = document.getElementById("generos");
for(let i in GENEROS) {
    const $li = document.createElement("li");
    $li.classList.add("list-group-item", "bg-dark", "text-light");

    const $label = document.createElement("label");
    $label.classList.add("d-flex", "align-items-center");
    $label.setAttribute("for", "genero" + GENEROS[i]);

    const $checkbox = document.createElement("input");
    $checkbox.classList.add("me-2");
    $checkbox.setAttribute("type", "checkbox");
    $checkbox.setAttribute("data-i", i);
    $checkbox.setAttribute("id", "genero" + GENEROS[i]);

    const $texto = document.createElement("span");
    $texto.innerText = GENEROS[i];

    $label.append($checkbox, $texto);
    $li.append($label);
    $ul.append($li);
}

// CARRITO --------------------------------------------------------------------------------------------------------------------

document.querySelector("#btnCarrito").addEventListener("click", ()=> {
    const $modal = carrito.generarModal();
    document.body.append($modal);
    $modal.showModal();

    $modal.addEventListener('close', () => { $modal.remove(); })
})

function agregarAlCarrito(id, _cantidad = 1) {
    carrito.agregarProducto(id, _cantidad);
}

function eliminarDelCarrito(id, _cantidad = 1) {
    carrito.eliminarProducto(id, _cantidad);
}

// FILTROS --------------------------------------------------------------------------------------------------------------------

/**
 * Evento para filtrar por nombre
 */
document.querySelector("#filtroNombre").addEventListener("input", (ev)=> {
    filtroNombre = ev.currentTarget.value;
    mostrarJuegosFiltrados();
})

/**
 * Evento para filtrar por precio
 */
document.querySelector("#filtroPrecio").addEventListener("input", (ev)=> {
    const $span = document.querySelector("#txtFiltroPrecio");
    const value = parseInt(ev.currentTarget.value);

    $span.innerText = `Menos de ${value}`; // En caso de que el value sea min o max, el texto se reemplazará
    if(value >= ev.currentTarget.max){ $span.innerText = "Cualquier precio" }
    if(value <= ev.currentTarget.min){ $span.innerText = "Gratuito" }

    filtroPrecio = value;
    mostrarJuegosFiltrados();

})

/**
 * Eventos para filtrar por género
 */
const $listaCheckbox = document.querySelectorAll("aside input[type='checkbox']");
$listaCheckbox.forEach(($checkbox)=> {
    $checkbox.addEventListener("click", (ev)=>{
        if(ev.currentTarget.checked) {
            filtroGeneros.push(+ev.currentTarget.dataset.i);
        }else {
            let i = filtroGeneros.indexOf(+ev.currentTarget.dataset.i);
            filtroGeneros.splice(i, 1);
        }
        mostrarJuegosFiltrados();
    })
})