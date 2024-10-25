"use strict";

/*
 * CORBALAN, NICOLAS LEONEL
 */

// VARIABLES ------------------------------------------------------------------------------------------------------------------
// arrays
const productos = [];
const carrito = [];

// dom
const $contenedorProductos = document.querySelector("#productos");
const $verCarrito = document.querySelector("#verCarrito");

// objetos
const CATEGORIAS = {
    1 : "Metroidvania",
    2 : "Videojuego de pelea",
    3 : "Plataforma",
    4 : "Aventura",
    5 : "Disparos",
    6 : "Rol",
    7 : "Logica",
    8 : "Disparos en primera persona",
    9 : "Estrategia"
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
            producto.categorias
        );
        // Lo pusheo en el array
        productos.push(obj);
    });
    mostrarProductos(productos);
});

// MOSTRAR PRODUCTOS ----------------------------------------------------------------------------------------------------------

function mostrarProductos(arrayProductos) {
    arrayProductos.forEach((producto)=> {
        console.log($contenedorProductos);
        $contenedorProductos.append(producto.generarEstructuraHtml());
    })
}

// EVENTOS --------------------------------------------------------------------------------------------------------------------
$verCarrito.addEventListener("click", ()=> {
    // Abrir modal y etc etc
    console.log(carrito);
})