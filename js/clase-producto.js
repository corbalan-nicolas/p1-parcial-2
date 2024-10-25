"use strict";

class Producto {
    #id; // int
    #nombre; // str
    #descripcion; // str
    #precio; // int
    #imagen; // str
    #categoria; // str

    constructor(id, nombre, descripcion, precio, imagen, categoria){
        this.#id = id;
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#precio = precio;
        this.#imagen = imagen;
        this.#categoria = categoria;
    }

    generarEstructuraHtml() {
        // Creación de elementos
        const $contenedor = document.createElement("article");
        const $nombre = document.createElement("h2");
        const $descripcion = document.createElement("p");
        const $precio = document.createElement("p");
        const $img = document.createElement("img");
        const $categorias = document.createElement("p");
        const $btn = document.createElement("button");

        // Atributos
        $contenedor.setAttribute("data-id", this.#id);
        $contenedor.className = "producto";
        console.log(this.#imagen);
        $img.setAttribute("src", this.#imagen[0]);
        $img.setAttribute("alt", "Foto del producto", this.#imagen);

        // Contenido
        $nombre.innerText = this.#nombre;
        $descripcion.innerText = this.#descripcion;
        $precio.innerText = this.#precio;
        $categorias.innerText = this.#categoria;
        $btn.innerText = "Agregar al carrito";

        // Copilación de elementos
        $contenedor.append($nombre, $img, $precio, $categorias, $btn);

        console.log($contenedor);
        return $contenedor;
    }

    get getPrecio(){
        return this.#precio;
    }
}