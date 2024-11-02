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

    /**
     * Método que genera la estructura html de una card para el producto
     * @returns {Object} objeto dom con todos los elementos a mosrtar
     */
    generarCard() {
        const $card = document.createElement("article");
        $card.classList.add("bg-dark", "w-100", "h-100", "d-flex", "flex-column", "position-relative");
        $card.setAttribute("data-id", this.#id);

        const $name = document.createElement("h2");
        $name.classList.add("h4", "px-2", "pt-2");
        $name.innerText = this.#nombre;

        const $price = document.createElement("p");
        $price.classList.add("fs-7", "px-2");
        $price.innerText = `$${this.#precio} ARS`;

        const $imgContainer = document.createElement("div");
        $imgContainer.classList.add("p-0", "position-relative", "order-first")

        const $img = document.createElement("img");
        $img.classList.add("img-fluid", "img-card");
        $img.src = this.#imagenes[0];
        $img.alt = `Foto de portada del juego ${this.#nombre}`;

        $img.addEventListener("click", () => this.abrirModal());

        const $btn = document.createElement("button");
        $btn.classList.add("btn", "btn-primary", "justify-self-end", "position-absolute", "btn-card");
        $btn.setAttribute("title", "Agregar al carrito");
        $btn.innerText = "➕";

        $btn.addEventListener("click", () => agregarAlCarrito(this.#id));

        $imgContainer.append($img, $btn);
        $card.append($name, $price, $imgContainer);
        return $card;
    }

    /**
     * Método que genera la estructura HTML del producto para mostrar en el carrito
     * @param {Number} cantidad Cantidad de unidades del producto
     * @returns {Object}
     */
    generarCardCarrito(cantidad) {
        /* ESTRUCTURA ESPERADA:
        <article>
            <div class="card-img-container">
                <img src="portada.jpg">
            </div>
            <div class="card-body-grid">
                <h2>Nombre</h2>
                <p>Precio x Unidad</p>
                <button>Eliminar</button>
                <button>Agregar</button>
            </div>
        </article>
        */
        const $card = document.createElement("article");
        $card.classList.add("bg-dark", "d-flex");
        $card.setAttribute("data-id", this.#id);

        const $cardImg = document.createElement("div");
        $cardImg.classList.add("card-img-container");

        const $portada = document.createElement("img");
        $portada.classList.add("img-fluid", "rounded-start", "h-100")
        $portada.src = this.#imagenes[0];
        $portada.alt = `Portada del videojuego ${this.#nombre}`;

        $cardImg.append($portada);

        const $cardBody = document.createElement("div");
        $cardBody.classList.add("card-body-grid", "w-100", "p-3")

        const $nombre = document.createElement("h2");
        $nombre.classList.add("h3");
        $nombre.innerText = `X${cantidad} - ${this.#nombre}`;

        const $precio = document.createElement("p");
        $precio.innerText = `$${this.#precio} ARS`;

        const $eliminar = document.createElement("button");
        $eliminar.classList.add("btn", "btn-outline-danger");
        $eliminar.innerText = "Eliminar";
        $eliminar.addEventListener("click", () => {
            eliminarDelCarrito(this.#id)
            cantidad -= 1;
            $nombre.innerText = `X${cantidad} - ${this.#nombre}`;
            if (cantidad <= 0) { $card.remove() }
        });

        const $agregar = document.createElement("button");
        $agregar.classList.add("btn", "btn-outline-success");
        $agregar.innerText = "Agregar";
        $agregar.addEventListener("click", () => {
            agregarAlCarrito(this.#id)
            cantidad += 1;
            $nombre.innerText = `X${cantidad} - ${this.#nombre}`;
        });

        $cardBody.append($nombre, $precio, $eliminar, $agregar);
        $card.append($cardImg, $cardBody);
        return $card;
    }

    /**
     * Método que genera la estructura HTML de la modal del producto
     */
    generarModal(){
        /* ESTRUCTURA ESPERADA:
        <dialog class="producto-modal">
            <div class="header">
                <h2>Nombre</h2>
                <form method="dialog">
                    <button class="btn btn-outline-danger">❌</button>
                </form>
            </div>
            <div class="slider">
                <img class="img-grande" src="imagen_grande.jpg">

                <div>
                    <button>👈</button>
                    <ul class="img-chicas">
                        <li><img src="imagen" alt="imagen"></li>
                        <li><img src="imagen" alt="imagen"></li>
                        <li><img src="imagen" alt="imagen"></li>
                        <li><img src="imagen" alt="imagen"></li>
                        ...
                    </ul>
                    <button>👉</button>
                </div>
            </div>
            <div class="body">
                <img src="portada.jpg" alt="...">
                <p>Descripción</p>
                <ul class="generos">
                    <li>Genero 1</li>
                    <li>Genero 2</li>
                    ...
                </ul>
                <div>
                    <input type="number" min="1" max="99" value="1">
                    <button>Agregar al carrito</button>
                </div>
            </div>
        </dialog>
        */
        const $dialog = document.createElement("dialog");
        $dialog.classList.add("modal-producto", "bg-dark-dark", "text-light", "rounded", "w-75");

        const $header = document.createElement("div");
        $header.classList.add("header", "d-flex", "justify-content-between");

        const $titulo = document.createElement("h2");
        $titulo.innerText = `> ${this.#nombre}`;

        const $formCerrar = document.createElement("form");
        $formCerrar.setAttribute("method", "dialog");

        const $btnCerrar = document.createElement("button");
        $btnCerrar.classList.add("btn", "btn-outline-danger")
        $btnCerrar.innerText = "❌";

        $formCerrar.append($btnCerrar);
        $header.append($titulo, $formCerrar);

        const $sliderContainer = document.createElement("div");
        $sliderContainer.classList.add("slider-container");

        const $imgGrande = document.createElement("img");
        $imgGrande.classList.add("img-fluid");
        $imgGrande.src = this.#imagenes[1];
        $imgGrande.alt = "Captura de pantalla 1";

        const $btnIzq = document.createElement("button");
        $btnIzq.innerText = "👈";
        $btnIzq.addEventListener("click", () => {

        })

        const $ulImg = document.createElement("ul");

        for(let i = 1; i < this.#imagenes.length; i++){
            const $li = document.createElement("li");

            const $imgChica = document.createElement("img");
            $imgChica.classList.add("img-fluid");
            $imgChica.src = this.#imagenes[i];
            $imgChica.alt = `Captura de pantalla ${i}`;

            $imgChica.addEventListener("click", (ev) => {
                $imgGrande.src = ev.currentTarget.src;
                $imgGrande.alt = ev.currentTarget.alt;
            })

            $li.append($imgChica);
            $ulImg.append($li);
        }

        const $btnDer = document.createElement("button");
        $btnDer.innerText = "👉";
        $btnIzq.addEventListener("click", () => {
            
        })

        $sliderContainer.append($imgGrande, $btnIzq, $ulImg, $btnDer);

        const $masInfo = document.createElement("div");
        $masInfo.classList.add("mas-info")

        const $portada = document.createElement("img");
        $portada.classList.add("img-fluid", "rounded");
        $portada.src = this.#imagenes[0];
        $portada.alt = `Portada del juego ${this.#nombre}`;

        const $ulGeneros = document.createElement("ul");
        $ulGeneros.classList.add("mt-3")

        for(let i in this.#generos) {
            const $li = document.createElement("li");

            const $span = document.createElement("span");
            $span.classList.add("badge", "text-bg-dark");
            $span.innerText = GENEROS[this.#generos[i]];

            $li.append($span);
            $ulGeneros.append($li);
        }
        const $descrp = document.createElement("p");
        $descrp.innerText = this.#descripcion;

        const $form = document.createElement("div");
        $form.classList.add("form");

        const $cantUnidades = document.createElement("input");
        $cantUnidades.classList.add("form-control", "input")
        $cantUnidades.setAttribute("type", "number");
        $cantUnidades.setAttribute("min", "1");
        $cantUnidades.setAttribute("max", "99");
        $cantUnidades.setAttribute("value", "1");

        const $btnCarrito = document.createElement("button");
        $btnCarrito.classList.add("btn", "btn-primary", "btn-carrito")
        $btnCarrito.innerText = "Añadir al carrito";

        $btnCarrito.addEventListener("click", () => agregarAlCarrito(this.#id, parseInt($cantUnidades.value)));

        $form.append($cantUnidades, $btnCarrito);
        $masInfo.append($portada, $ulGeneros, $descrp, $form);
        $dialog.append($header, $sliderContainer, $masInfo)
        return $dialog;
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

    abrirModal() {
        const $modal = this.generarModal();
        document.body.append($modal);
        $modal.showModal();

        $modal.addEventListener('close', () => { $modal.remove(); })
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