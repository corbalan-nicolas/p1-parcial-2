class Carrito {
    #productos;
    constructor() {
        /**
         * Array de objetos que almacena el idProducto y la cantidad
         */
        if(localStorage.getItem("carrito") !== null) {
            this.#productos = JSON.parse(localStorage.getItem("carrito"));
            this.actualizarCarrito();
        }else {
            this.#productos = [];
        }
    }

    /**
     * Método que agrega XX unidades de un producto al carrito
     * @param {Number} id id del producto
     * @param {Number} _cantidad (opcional) por defecto 1. Cantidad del mismo producto a agregar
     */
    agregarProducto(id, _cantidad = 1) {
        const res = this.#productos.some((producto) => {
            if(producto.id === id){
                // Existe, asi que aumento la cantidad y retorno true
                producto.cantidad += _cantidad;
                return true;
            }
        })
        // Si el producto no existe, pusheo el nuevo objeto
        if(!res) { this.#productos.push({id, cantidad : _cantidad}); }

        // Guardo el nuevo carrito en el localStorage y lo actualizo en el html
        localStorage.setItem("carrito", JSON.stringify(this.#productos));
        this.actualizarCarrito();
    }

    /**
     * Método que elimina XX unidades de un producto del carrito
     * @param {Number} id id del producto
     * @param {Number} _cantidad (opcional) por defecto 1. Cantidad de productos a eliminar
     */
    eliminarProducto(id, _cantidad = 1) {
        this.#productos.some((producto, i) => {
            if(id === producto.id){
                // Existe, asi que elimino la cantidad solicidata
                producto.cantidad -= _cantidad;
                // Si hay 0 unidades o menos, lo borra del array
                if(producto.cantidad <= 0) { this.#productos.splice(i, 1) }
                return true; // Para que deje de recorrer el ciclo
            }
        })

        // Guardo el nuevo carrito en el localStorage
        localStorage.setItem("carrito", JSON.stringify(this.#productos));
        this.actualizarCarrito();
    }

    /**
     * Método que se encarga de actualizar el botón para abrir el carrito
     * (para mostrar la cantidad de productos y el precio total)
     */
    actualizarCarrito() {
        const insignia = document.querySelector("#cantidadProductos");
        insignia.classList.add("d-none"); // Por default, va a tener display none
        insignia.innerText = this.getCantidadProductos;

        if(this.getCantidadProductos > 0) {
            insignia.classList.remove("d-none");
        }
    }

    /**
     * Método que genera la estructura HTML de la modal
     * @returns {Object} objeto dom del $dialog
     */
    generarModal() {
        const $dialog = document.createElement("dialog");
        $dialog.classList.add("modal", "bg-dark-dark", "text-light", "rounded", "w-50", "d-flex", "flex-column");

        const $header = document.createElement("div");
        $header.classList.add("modal--header", "d-flex", "justify-content-between");

        const $titulo = document.createElement("p");
        $titulo.classList.add("modal--header-titulo", "h2");
        $titulo.innerText = "Tu carrito";

        const $formCerrar = document.createElement("form");
        $formCerrar.setAttribute("method", "dialog");

        const $btnCerrar = document.createElement("button");
        $btnCerrar.classList.add("btn", "btn-outline-danger")
        $btnCerrar.innerText = "❌";

        $formCerrar.append($btnCerrar);
        $header.append($titulo, $formCerrar);

        const $body = document.createElement("div");
        $body.classList.add("border-bottom", "border-top", "py-3", "mb-3", "overflow-auto", "carrito-body", "flex-grow-1");

        for(let producto of this.#productos){
            const $card = juegos.find(juego => juego.getId === producto.id).generarCardCarrito(producto.cantidad);
            $body.append($card);
        }

        const $footer = document.createElement("div");

        const $precioTotal = document.createElement("p");
        $precioTotal.classList.add("text-end", "fw-bold")
        $precioTotal.innerText = `Total: $${this.getPrecioTotal} ARS`;

        const $btnComprar = document.createElement("button");
        $btnComprar.classList.add("btn", "btn-primary", "d-block", "ms-auto")
        $btnComprar.innerText = "Continuar con el pago";

        $btnComprar.addEventListener("click", () => {
            alert("De momento no es posible realizar esta compra, intente de nuevo en unos 2 meses 😙");
        })

        $body.querySelectorAll("article .btn").forEach($btn => $btn.addEventListener("click", () => {
            $precioTotal.innerText = `Total: $${this.getPrecioTotal} ARS`;
        }))

        $footer.append($precioTotal, $btnComprar);
        $dialog.append($header, $body, $footer)
        return $dialog;
    }

    /**
     * Método que retorna la cantidad total de productos dentro del carrito
     * @returns {Number}
     */
    get getCantidadProductos() {
        return this.#productos.reduce((acumulador, producto)=> acumulador + producto.cantidad, 0);
    }

    /**
     * Método que retorna el precio total a pagar entre todos los productos del carrito
     * @returns {Number}
     */
    get getPrecioTotal() {
        return this.#productos.reduce((acumulador, producto) => {
            // Encuentro el producto con el id, para poder obtener el precio y sumarlo
            const busqueda = juegos.find(juego => juego.getId === producto.id);
            return acumulador + busqueda.getPrecio * producto.cantidad;
        }, 0).toFixed(2);
    }
}