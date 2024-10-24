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
}