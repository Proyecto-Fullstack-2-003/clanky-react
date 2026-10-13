
 // @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'

import {
  CLAVES,
  leerJSON,
  cargarTienda,
  guardarTienda,
} from './storage.js'

import { productosIniciales } from '../data/productosIniciales.js'
import { crearEstado } from '../store/tiendaReducer.js'

beforeEach(() => {
  localStorage.clear()
})

describe('leerJSON', () => {
  it('devuelve el valor guardado en formato JSON', () => {
    localStorage.setItem('prueba', JSON.stringify({ nombre: 'Clanky' }))

    expect(leerJSON('prueba', null)).toEqual({ nombre: 'Clanky' })
  })

  it('devuelve la alternativa cuando la clave no existe', () => {
    expect(leerJSON('inexistente', [])).toEqual([])
  })

  it('devuelve la alternativa cuando el JSON está corrupto', () => {
    localStorage.setItem('prueba', '{json incorrecto')

    expect(leerJSON('prueba', null)).toBeNull()
  })
})

describe('guardarTienda', () => {
  it('guarda los productos y el carrito', () => {
    const estado = crearEstado(productosIniciales, [])

    expect(guardarTienda(estado)).toBe(true)

    const guardado = JSON.parse(
      localStorage.getItem(CLAVES.tienda),
    )

    expect(guardado.productos).toEqual(productosIniciales)
    expect(guardado.carrito).toEqual([])
  })
})

describe('cargarTienda', () => {
  it('carga el catálogo inicial si no hay datos guardados', () => {
    const estado = cargarTienda()

    expect(estado.productos).toEqual(productosIniciales)
    expect(estado.carrito).toEqual([])
  })

  it('recupera el catálogo y el carrito guardados', () => {
    const producto = productosIniciales[0]

    const datos = {
      productos: productosIniciales,
      carrito: [{ id: producto.id, cantidad: 2 }],
    }

    localStorage.setItem(CLAVES.tienda, JSON.stringify(datos))

    const estado = cargarTienda()

    expect(estado.carrito).toEqual([
      { id: producto.id, cantidad: 2 },
    ])
    expect(estado.productos).toEqual(productosIniciales)
  })

  it('ignora un carrito antiguo si el formato es inválido', () => {
    const producto = productosIniciales[0]

    localStorage.setItem(
      CLAVES.carritoAntiguo,
      JSON.stringify([
        { id: producto.id, cantidad: 1 },
        { id: producto.id, cantidad: 2 },
        { id: 999999, cantidad: 1 },
        { id: producto.id, cantidad: -1 },
      ]),
    )

    const estado = cargarTienda()

    expect(estado.carrito).toEqual([
      { id: producto.id, cantidad: 1 },
    ])
  })

  it('recupera el carrito antiguo si no existe el nuevo', () => {
    const producto = productosIniciales[0]

    localStorage.setItem(
      CLAVES.carritoAntiguo,
      JSON.stringify([{ id: producto.id, cantidad: 1 }]),
    )

    const estado = cargarTienda()

    expect(estado.carrito).toEqual([
      { id: producto.id, cantidad: 1 },
    ])
  })

  it('recupera el catálogo inicial si los productos guardados son inválidos', () => {
    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({
        productos: [{ id: -1, nombre: 'Producto inválido' }],
        carrito: [],
      }),
    )

    const estado = cargarTienda()

    expect(estado.productos).toEqual(productosIniciales)
  })

  it('ignora las entradas de carrito que no son objetos válidos', () => {
    const producto = productosIniciales[0]

    localStorage.setItem(
      CLAVES.tienda,
      JSON.stringify({
        productos: productosIniciales,
        carrito: [
          null,
          { id: producto.id, cantidad: 0 },
          { id: producto.id, cantidad: 1 },
        ],
      }),
    )

    const estado = cargarTienda()

    expect(estado.carrito).toEqual([
      { id: producto.id, cantidad: 1 },
    ])
  })
})
