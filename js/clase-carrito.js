class Carrito {
    #carritoProductos;
    constructor() {
        /**
         * Array de objetos que almacena el idProducto y la cantidad
         */
        if(localStorage.getItem("carrito") !== null) {
            this.#carritoProductos = JSON.parse(localStorage.getItem("carrito"));
        }else {
            this.#carritoProductos = [];
        }
        this.$btnVerCarrito = document.querySelector("#verCarrito");
    }

    generarModal() {
        const $modal = document.createElement("dialog");
        $modal.classList.add("modal-carrito");

        // Cerrar modal
        const $formCerrar = document.createElement("form");
        const $btnCerrar = document.createElement("button");
        $formCerrar.setAttribute("method", "dialog");
        $btnCerrar.innerText = "❌";
        $formCerrar.append($btnCerrar);

        // Titulo
        const $h2 = document.createElement("h2");
        $h2.innerText = "Tu carrito";

        // Productos
        const $contenedorProductos = document.createElement("div");
        for(let producto of this.#carritoProductos){
            const busqueda = productos.find(comparador => comparador.getId === producto.id);
            $contenedorProductos.append(busqueda.generarEstructuraCarrito(producto.cantidad));
        }

        // Append final
        $modal.append($formCerrar, $contenedorProductos);
        return $modal;
    }

    agregarProducto(id) {
        // Busco el producto en el carrito para ver si existe
        const res = this.#carritoProductos.find((producto) => {
            if(id === producto.id){
                // Existe, así que sólo le aumento la cantidad en 1
                producto.cantidad++;
                return true;
            }
        })
        if(!res) {
            this.#carritoProductos.push({id, cantidad : 1});
        }
        // Guardo el nuevo carrito en el localStorage
        localStorage.setItem("carrito", JSON.stringify(this.#carritoProductos));
    }

    eliminarProducto(id) {
        const res = this.#carritoProductos.find((producto, i) => {
            if(id === producto.id){
                // Existe, asi que elimino la cantidad en 1
                producto.cantidad--;
                if(producto.cantidad === 0) { this.#carritoProductos.splice(i, 1) }
                return true;
            }
        })
        // Guardo el nuevo carrito en el localStorage
        localStorage.setItem("carrito", JSON.stringify(this.#carritoProductos));
    }

    consola() {
        console.log("Carrito actualmente", this.#carritoProductos);
    }

    get getCantidadProductos() {
        // return this.#carritoProductos.reduce((total, producto)=> total + producto.cantidad, 0);
        return this.#carritoProductos.reduce((total, producto)=> total + producto.cantidad, 0);
    }

    get getPrecioTotal() {
        const total = this.#carritoProductos.reduce((total, producto) => {
            // Encuentro el producto con el id, para poder obtener el precio
            const busqueda = productos.find(comparador => comparador.getId === producto.id);
            return total + busqueda.getPrecio * producto.cantidad
        }, 0);

        return total;
    }
}