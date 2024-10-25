"use strict";

class Producto {
    #id; // int
    #nombre; // str
    #descripcion; // str
    #precio; // int
    #imagenes; // str
    #generos; // str

    constructor(id, nombre, descripcion, precio, imagenes, generos){
        this.#id = id;
        this.#nombre = nombre;
        this.#descripcion = descripcion;
        this.#precio = precio;
        this.#imagenes = imagenes;
        this.#generos = generos;
    }

    generarEstructuraHtml() {
        // Creación de elementos
        const $contenedor = document.createElement("article");
        const $contenido = document.createElement("div");
        const $nombre = document.createElement("h2");
        const $descripcion = document.createElement("p");
        const $precio = document.createElement("p");
        const $img = document.createElement("img");
        const $categorias = document.createElement("p");
        const $btn = document.createElement("button");

        // Atributos
        $contenedor.setAttribute("data-id", this.#id);
        $contenedor.className = "producto";
        $img.setAttribute("src", this.#imagenes[0]);
        $img.setAttribute("alt", "Foto del producto", this.#imagenes);

        // Contenido
        $nombre.innerText = this.#nombre;
        $descripcion.innerText = this.#descripcion;
        $precio.innerText = this.#precio;
        $categorias.innerText = this.#generos;
        $btn.innerText = "Agregar al carrito";

        // Copilación de elementos
        $contenido.append($nombre, $img, $precio, $categorias);
        $contenedor.append($contenido, $btn);

        return $contenedor;
    }

    tieneGeneros(generos) {
        for(const genero of generos) {
            if(this.#generos.includes(genero)) {
                continue;
            }else {
                return false;
            }
        }
        return true;
    }

    get getPrecio(){
        return this.#precio;
    }



    get getNombre() {
        return this.#nombre;
    }
}