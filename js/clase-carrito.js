class Carrito {
    #carritoProductos;
    constructor() {
        /**
         * Array de objetos que almacena el producto y la cantidad
         */
        this.#carritoProductos = [];
        this.$btnVerCarrito = document.querySelector("#verCarrito");
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
            const busqueda = productos.find(comparador => comparador.getId === producto.id);
            return total + busqueda.getPrecio * producto.cantidad
        }, 0);

        return total;
    }
}