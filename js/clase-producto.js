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
        $btn.className = "agregar-producto";

        // Contenido
        $nombre.innerText = this.#nombre;
        $img.setAttribute("src", this.#imagenes[0]);
        $img.setAttribute("alt", "Foto del producto", this.#imagenes);
        $descripcion.innerText = this.#descripcion;
        $precio.innerText = this.#precio + " ARS$";
        // Generos
        for(const genero of this.#generos) {
            const $span = document.createElement("span");
            $span.innerText = GENEROS[genero];
            $categorias.append($span);
        }
        $btn.innerText = "Agregar al carrito";

        // Copilación de elementos
        $contenido.append($nombre, $img, $precio, $categorias);
        $contenedor.append($contenido, $btn);

        return $contenedor;
    }

    generarModal() {
        // ELEMENTOS (la mayoría)
        const $modal = document.createElement("dialog");
        const $nombre = document.createElement("h2");
        const $imgGrande = document.createElement("img");
        const $portada = document.createElement("img");
        const $descrip = document.createElement("p");
        const $btnAgregar = document.createElement("button");
        const $formCerrar = document.createElement("form");
        const $btnCerrar = document.createElement("button");
        const $contImagenes = document.createElement("ol");
        const $contHeader = document.createElement("div"); // Contenedor header
        const $contSlider = document.createElement("div"); // Contenedor slider
        const $contConten = document.createElement("div"); // Contenedor contenido
        const $contGenero = document.createElement("div"); // Contenedor de los géneros

        // CONTENIDO
        $nombre.innerText = this.#nombre;
        $imgGrande.setAttribute("src", this.#imagenes[1]);
        $imgGrande.setAttribute("alt", `Captura de pantalla N°1`);
        $portada.setAttribute("src", this.#imagenes[0]);
        $portada.setAttribute("alt", `Portada del juego ${this.#nombre}`);
        $descrip.innerText = this.#descripcion;
        $btnCerrar.innerText = "❌";
        $btnAgregar.innerText = "Agregar al carrito";
        for(let i = 1; i < this.#imagenes.length; i++) {
            const $li = document.createElement("li");
            const $img = document.createElement("img");
            $img.setAttribute("src", this.#imagenes[i]);
            $img.setAttribute("alt", `Captura de pantalla N°${i}`);

            $li.append($img);
            $contImagenes.append($li);
        }
        for(let i = 0; i < this.#generos.length; i++) {
            const $span = document.createElement("span");
            $span.innerText = GENEROS[this.#generos[i]];

            $contGenero.append($span);
        }

        // ATRIBUTOS
        $modal.classList.add("modal-producto");
        $contHeader.classList.add("header");
        $contSlider.classList.add("slider");
        $contConten.classList.add("contenido");
        $imgGrande.classList.add("imgGrande");
        $formCerrar.setAttribute("method", "dialog")

        // APPENDS FINALES
        $formCerrar.append($btnCerrar);
        $contHeader.append($nombre, $formCerrar);
        $contSlider.append($imgGrande, $contImagenes);
        $contConten.append($portada, $contGenero, $descrip, $btnAgregar);
        $modal.append($contHeader, $contSlider, $contConten);
        return $modal;
    }

    tieneGeneros(generos) {
        for(const genero of generos) {
            if(this.#generos.includes(genero)) {
                continue;
            }else {
                return false;
            }
        }
        //Si recorrió todo el for y no retornó falso, significa que tiene todos los generos
        return true;
    }

    get getId() {
        return this.#id;
    }

    get getNombre() {
        return this.#nombre;
    }

    get getPrecio(){
        return this.#precio;
    }
}