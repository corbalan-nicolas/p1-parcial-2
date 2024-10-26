"use strict";

/*
 * CORBALAN, NICOLAS LEONEL
 */

// VARIABLES ------------------------------------------------------------------------------------------------------------------
// arrays



const productos = [];
const carrito = [];
const filtrosPorGenero = [];

// dom
const $contenedorProductos = document.querySelector("#productos");
const $verCarrito = document.querySelector("#verCarrito");

// objetos
const GENEROS = {
    2 : "Videojuego de pelea",
    1 : "Metroidvania",
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



fetch("productos.json").then(response => response.json()).then(productoJson => {
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
        productos.push(obj);
    });
    mostrarProductos(productos);
});



// MOSTRAR --------------------------------------------------------------------------------------------------------------------



/**
 * Función que muestra todos los productos pasados como argumento en el html
 * @param {Array} arrayProductos productos los cuales mostrará en pantalla
 */
function mostrarProductos(arrayProductos) {
    // Borro todo lo que tenía antes
    $contenedorProductos.innerText = "";
    // Recorro el array que pasaron como argumento y lo muestro
    arrayProductos.forEach((producto)=> {
        $contenedorProductos.append(producto.generarEstructuraHtml());
    })
    // Le agrego los eventos clicks a todos los botones
    const $botones = document.querySelectorAll(".agregar-producto");
    asignarEventoClick($botones);
}

/*
 * Genero los filtros de forma dinámica
 */
const $aside = document.createElement("aside"); // Contenedor general
const $ul = document.createElement("ul"); // ul con los filtros
const $li = document.createElement("li"); // cada tipo de filtro
const $a = document.createElement("a");
const $tipoFiltro = document.createElement("span");
const $icono = document.createElement("span");
const $contenido = document.createElement("span");

$tipoFiltro.innerText = "Filtrar por género";
$icono.innerText = "🔽";

$a.setAttribute("href", "#");
$a.classList.add("titulo");
$contenido.classList.add("contenido");

$a.append($tipoFiltro, $icono);

// filtros por género (array)
for(let i in GENEROS) {
    // Creo los elementos
    const $label = document.createElement("label");
    const $checkbox = document.createElement("input");
    const $texto = document.createElement("span");

    // Atributos
    $label.setAttribute("for", "genero" + GENEROS[i]);
    $checkbox.setAttribute("type", "checkbox");
    $checkbox.setAttribute("data-i", i);
    $checkbox.setAttribute("id", "genero" + GENEROS[i]);

    // Contenido
    $texto.innerText = GENEROS[i];

    // Copilación de elementos
    $label.append($checkbox, $texto);
    $contenido.append($label);
}

$li.append($a, $contenido);
$ul.append($li);
$aside.append($ul);
document.body.prepend($aside);
/*
// Estructura de cada filtro
<li>
    <a href="#" class="titulo"><span>Ítem 02</span> <span>🔽</span></a>
    <span class="contenido">
        <label for="id-check"><input id="id-check" type="checkbox"><span>GENERO</span></label>
    </span>
</li>
*/



// EVENTOS --------------------------------------------------------------------------------------------------------------------
$verCarrito.addEventListener("click", ()=> {
    // Abrir modal y etc etc
    console.log(carrito);
})

const $listaCheckbox = document.querySelectorAll("aside input[type='checkbox']");

$listaCheckbox.forEach(($checkbox)=> {
    $checkbox.addEventListener("click", (ev)=>{
        if(ev.currentTarget.checked) {
            filtrosPorGenero.push(+ev.currentTarget.dataset.i);
        }else {
            let posicion = filtrosPorGenero.indexOf(+ev.currentTarget.dataset.i);
            filtrosPorGenero.splice(posicion, ++posicion);
        }

        const productosFiltrados = productos.filter(producto => producto.tieneGeneros(filtrosPorGenero));
        mostrarProductos(productosFiltrados);
    })
})

function asignarEventoClick(nodeList) {
    nodeList.forEach((btn)=> {
        btn.addEventListener("click", (ev)=> {
            const productoId = +ev.currentTarget.parentNode.dataset.id
            // Para que no se repita el producto
            carrito.push(productoId);
            console.log(carrito);
        })
    })
}