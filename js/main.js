"use strict";

/*
 * CORBALAN, NICOLAS LEONEL
 */

// VARIABLES ------------------------------------------------------------------------------------------------------------------
// arrays
let productos = [];
const carrito = [];

// dom
const $productos = document.querySelector("#productos");
const $verCarrito = document.querySelector("#verCarrito");

console.log($productos);
// objetos
const CATEGORIAS = {
    1 : "Comidas",
    2 : "Recuerdos",
    3 : "Papita"
}

// JSON -----------------------------------------------------------------------------------------------------------------------
fetch("productos.json").then(response => response.json()).then(productoJson => {
    productos = productoJson.map((producto)=> {
        return new Producto(
            producto.id,
            producto.nombre,
            producto.descripcion,
            producto.precio,
            producto.imagen,
            producto.categoria
        );
    });

    // console.log(productos);
});

// MOSTRAR PRODUCTOS ----------------------------------------------------------------------------------------------------------

// EVENTOS --------------------------------------------------------------------------------------------------------------------
$verCarrito.addEventListener("click", ()=> {
    // Abrir modal y etc etc
    console.log(carrito);
})