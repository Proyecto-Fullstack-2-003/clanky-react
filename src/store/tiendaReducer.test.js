
import { describe, it, expect } from 'vitest'

import {
    crearEstado,
    tiendaReducer,
    detalleCarrito,
    resumenCarrito,
} from './tiendaReducer.js'

const disco = {
    id: 1,
    nombre: 'Disco de prueba',
    formato: 'Vinilo',
    precio: 10000,
    stock: 5,
    imagen: 'https://example.com/disco.jpg',
}

const otroDisco = {
    id: 2,
    nombre: 'Segundo disco',
    formato: 'CD',
    precio: 8000,
    stock: 3,
    imagen: 'https://example.com/otro.jpg',
}

function crearEstadoPrueba(carrito = []) {
    return crearEstado(
        [{ ...disco }, { ...otroDisco }],
        carrito,
    )
}

describe('tiendaReducer', () => {
    it('agrega un producto al carrito', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'AGREGAR',
            id: 1,
        })

        expect(resultado.carrito).toEqual([
            { id: 1, cantidad: 1 },
        ])
    })

    it('aumenta la cantidad si el producto ya está en el carrito', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'AGREGAR',
            id: 1,
        })

        expect(resultado.carrito).toEqual([
            { id: 1, cantidad: 2 },
        ])
    })

    it('no permite agregar un producto inexistente', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'AGREGAR',
            id: 999,
        })

        expect(resultado.carrito).toEqual([])
        expect(resultado.aviso.tipo).toBe('warning')
    })

    it('no permite superar el stock disponible', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 5 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'AGREGAR',
            id: 1,
        })

        expect(resultado.carrito).toEqual([
            { id: 1, cantidad: 5 },
        ])
        expect(resultado.aviso.tipo).toBe('warning')
    })

    it('actualiza la cantidad sin alterar los demás productos', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
            { id: 2, cantidad: 2 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'CANTIDAD',
            id: 1,
            cantidad: 3,
        })

        expect(resultado.carrito).toEqual([
            { id: 1, cantidad: 3 },
            { id: 2, cantidad: 2 },
        ])
    })

    it('elimina del carrito un producto con cantidad cero', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
            { id: 2, cantidad: 2 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'CANTIDAD',
            id: 1,
            cantidad: 0,
        })

        expect(resultado.carrito).toEqual([
            { id: 2, cantidad: 2 },
        ])
    })

    it('rechaza cantidades negativas o mayores al stock', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
        ])

        const negativo = tiendaReducer(estado, {
            type: 'CANTIDAD',
            id: 1,
            cantidad: -1,
        })

        const exceso = tiendaReducer(estado, {
            type: 'CANTIDAD',
            id: 1,
            cantidad: 6,
        })

        expect(negativo.carrito).toEqual(estado.carrito)
        expect(exceso.carrito).toEqual(estado.carrito)
        expect(negativo.aviso.tipo).toBe('warning')
        expect(exceso.aviso.tipo).toBe('warning')
    })

    it('quita un producto del carrito', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
            { id: 2, cantidad: 2 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'QUITAR',
            id: 1,
        })

        expect(resultado.carrito).toEqual([
            { id: 2, cantidad: 2 },
        ])
    })

    it('vacía el carrito', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
            { id: 2, cantidad: 2 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'VACIAR',
        })

        expect(resultado.carrito).toEqual([])
    })

    it('calcula correctamente el subtotal y las unidades', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 2 },
            { id: 2, cantidad: 1 },
        ])

        expect(resumenCarrito(estado)).toEqual({
            subtotal: 28000,
            unidades: 3,
        })
    })

    it('devuelve el detalle del carrito con los datos de los productos', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 2 },
        ])

        expect(detalleCarrito(estado)).toEqual([
            { ...disco, cantidad: 2 },
        ])
    })

    it('completa una compra y descuenta el stock', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 2 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'COMPRAR',
        })

        expect(resultado.carrito).toEqual([])
        expect(
            resultado.productos.find((p) => p.id === 1).stock,
        ).toBe(3)
    })

    it('no permite comprar con el carrito vacío', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'COMPRAR',
        })

        expect(resultado.productos[0].stock).toBe(5)
        expect(resultado.aviso.tipo).toBe('warning')
    })

    it('crea un producto nuevo con datos válidos', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'GUARDAR_PRODUCTO',
            id: null,
            datos: {
                nombre: 'Nuevo álbum',
                formato: 'Vinilo',
                precio: '12000',
                stock: '4',
                imagen: 'https://example.com/nuevo.jpg',
            },
        })

        expect(resultado.productos).toHaveLength(3)
        expect(resultado.productos[2]).toMatchObject({
            id: 3,
            nombre: 'Nuevo álbum',
            precio: 12000,
            stock: 4,
        })
    })

    it('edita un producto existente', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'GUARDAR_PRODUCTO',
            id: 1,
            datos: {
                nombre: 'Disco actualizado',
                formato: 'Vinilo',
                precio: '15000',
                stock: '6',
                imagen: 'https://example.com/actualizado.jpg',
            },
        })

        expect(
            resultado.productos.find((p) => p.id === 1),
        ).toMatchObject({
            nombre: 'Disco actualizado',
            precio: 15000,
            stock: 6,
        })
    })

    it('elimina un producto del catálogo y del carrito', () => {
        const estado = crearEstadoPrueba([
            { id: 1, cantidad: 1 },
            { id: 2, cantidad: 1 },
        ])

        const resultado = tiendaReducer(estado, {
            type: 'ELIMINAR_PRODUCTO',
            id: 1,
        })

        expect(resultado.productos.map((p) => p.id)).toEqual([2])
        expect(resultado.carrito).toEqual([
            { id: 2, cantidad: 1 },
        ])
    })

    it('devuelve el mismo estado ante una acción desconocida', () => {
        const estado = crearEstadoPrueba()

        const resultado = tiendaReducer(estado, {
            type: 'ACCION_DESCONOCIDA',
        })

        expect(resultado).toBe(estado)
    })
})
