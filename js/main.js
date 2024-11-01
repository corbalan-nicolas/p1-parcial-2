"use strict";

/*
 * CORBALAN, NICOLAS LEONEL
 */

/*
    TO DO
    - Carrito cuando tiene 2 digitos
*/
// VARIABLES ------------------------------------------------------------------------------------------------------------------
// arrays



const productos = [];
// https://store.steampowered.com/
// https://chatgpt.com/
const carrito = new Carrito();

// Filtros
let filtroNombre = ""; // Variable para filtrar por nombre
let filtroPrecio = Infinity; // Para filtrar por precio
const filtroGeneros = []; // Variable para filtrar por géneros

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
    actualizarCarrito();
});



// MOSTRAR --------------------------------------------------------------------------------------------------------------------



/**
 * Función que muestra todos los productos pasados como argumento en el html
 * @param {Array} arrayProductos productos los cuales mostrará en pantalla
 */
function mostrarProductos(_arrayProductos = productos) {
    // Borro todo lo que tenía antes
    $contenedorProductos.innerText = "";

    // Le aplico todos los filtros
    _arrayProductos = filtrarPorNombre(_arrayProductos);
    _arrayProductos = filtrarPorPrecio(_arrayProductos);
    _arrayProductos = filtrarPorGenero(_arrayProductos);

    // Recorro el array que pasaron como argumento y lo muestro
    _arrayProductos.forEach((producto)=> {
        $contenedorProductos.append(producto.generarEstructuraHtml());
    })
    // Le agrego los eventos clicks a todos los botones
    const $botones = document.querySelectorAll(".agregar-producto");
    asignarEventoClick($botones);
}

/*
 * Genero los filtros de forma dinámica
 */
const $contenedor = document.getElementById("generos");
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
    $contenedor.append($label);
}



// EVENTOS --------------------------------------------------------------------------------------------------------------------
$verCarrito.addEventListener("click", ()=> {
    // Abrir modal y etc etc
    const $modal = carrito.generarModal();
    document.body.append($modal);
    $modal.showModal();

    // Eventos dentro del carrito
    const $arrayAgregar = $modal.querySelectorAll(".btn-agregar")
    const $arrayEliminar = $modal.querySelectorAll(".btn-eliminar")

    $arrayAgregar.forEach($agregar => $agregar.addEventListener("click", (ev)=> {
        console.log("Agregar");
        const productoId = +ev.currentTarget.parentNode.dataset.id;
        console.log(productoId);
        carrito.agregarProducto(productoId);
        const $span = ev.currentTarget.previousElementSibling.previousElementSibling.lastElementChild
        $span.innerText = parseInt($span.innerText) + 1
        actualizarCarrito();
    }))
    $arrayEliminar.forEach($eliminar => $eliminar.addEventListener("click", (ev)=> {
        console.log("Eliminar");
        const productoId = +ev.currentTarget.parentNode.dataset.id;
        console.log(productoId);
        carrito.eliminarProducto(productoId);
        const $span = ev.currentTarget.previousElementSibling.lastElementChild
        $span.innerText = parseInt($span.innerText) - 1
        if(parseInt($span.innerText) <= 0) { $span.parentNode.parentNode.remove() }
        actualizarCarrito();
    }))

    $modal.addEventListener("close", ()=> $modal.remove())
})

document.querySelector("#buscador").addEventListener("input", ()=> {
    filtroNombre = document.querySelector("#buscador").value;

    mostrarProductos();
})

document.querySelector("#filtroPrecio").addEventListener("input", (ev)=> {
    const $span = document.querySelector("#txtFiltroPrecio");
    const value = parseInt(ev.currentTarget.value);

    filtroPrecio = value;

    $span.innerText = `Menos de ${value}`; // En caso de que el value sea min o max, el texto se reemplazará
    if(value >= ev.currentTarget.max){ $span.innerText = "Cualquier precio" }
    if(value <= ev.currentTarget.min){ $span.innerText = "Gratuito" }

    mostrarProductos();
})
const $listaCheckbox = document.querySelectorAll("aside input[type='checkbox']");

$listaCheckbox.forEach(($checkbox)=> {
    $checkbox.addEventListener("click", (ev)=>{
        if(ev.currentTarget.checked) {
            filtroGeneros.push(+ev.currentTarget.dataset.i);
        }else {
            let posicion = filtroGeneros.indexOf(+ev.currentTarget.dataset.i);
            filtroGeneros.splice(posicion, ++posicion);
        }

        mostrarProductos();
    })
})

function asignarEventoClick(nodeList) {
    nodeList.forEach(($btn)=> {
        $btn.addEventListener("click", (ev)=> {
            const productoId = +ev.currentTarget.parentNode.dataset.id
            // Para que no se repita el producto
            carrito.agregarProducto(productoId);
            // console.log(carrito);
            actualizarCarrito();
        })

        $btn.previousElementSibling.querySelector("img").addEventListener("click", (ev)=> {
            const productoId = parseInt(ev.currentTarget.parentNode.parentNode.dataset.id);
            const busqueda = productos.find(producto => producto.getId === productoId);

            const $modal = busqueda.generarModal();
            document.body.append($modal);
            $modal.showModal();

            const $imgGrande = document.querySelector(".imgGrande");
            const $imgChicas = document.querySelectorAll("ol img");
            const $scroll = "h";

            console.log($imgChicas[1].parentNode.scroll());

            // $contenedor.scrollLeft += 150px;

            $imgChicas.forEach(($img)=> {
                $img.addEventListener("click", (ev)=> {
                    $imgGrande.alt = ev.currentTarget.alt;
                    $imgGrande.src = ev.currentTarget.src;
                })
            })

            $modal.querySelector(".contenido button").addEventListener("click", (ev)=> {
                const productoId = +ev.currentTarget.parentNode.parentNode.dataset.id;
                carrito.agregarProducto(productoId);
                actualizarCarrito();
            })

            $modal.addEventListener("close", ()=> $modal.remove())
        })
    })
}

function actualizarCarrito() {
    const $span = document.querySelector("#cantidadProductos");
    $span.innerText = carrito.getCantidadProductos;
    $span.parentNode.classList.add("activo");
    if (carrito.getCantidadProductos === 0) {
        $span.parentNode.classList.remove("activo");
    }
    document.querySelector("#precioTotal").innerText = carrito.getPrecioTotal
}



// FILTROS --------------------------------------------------------------------------------------------------------------------
function filtrarPorNombre(_productos = productos) {
    if(filtroNombre.trim() == "") { return _productos } // Si no hay nada, retorna el array con los productos recibidos
    return _productos.filter(producto => producto.getNombre.toLowerCase().trim().includes(filtroNombre.toLowerCase().trim()));
}

function filtrarPorPrecio(_productos = productos) {
    return _productos.filter(producto => producto.getPrecio <= filtroPrecio);
}

function filtrarPorGenero(_productos = productos) {
    return _productos.filter(producto => producto.tieneGeneros(filtroGeneros));
}