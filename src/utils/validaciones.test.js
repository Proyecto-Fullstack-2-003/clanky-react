import { describe, expect, it } from 'vitest'
import { validarCheckout } from './validaciones.js'

const datosValidos = {
  nombre: 'Usuario de Prueba',
  email: 'prueba@example.com',
  telefono: '912345678',
  direccion: 'Av. Libertad 123',
  comuna: 'Viña del Mar',
  region: 'Valparaíso'
}

describe('Validaciones del checkout', () => {
  it('acepta todos los datos válidos', () => {
    expect(validarCheckout(datosValidos)).toEqual({})
  })

  it('rechaza un correo electrónico incorrecto', () => {
    const errores = validarCheckout({
      ...datosValidos,
      email: 'correo-invalido'
    })

    expect(errores).toHaveProperty('email')
  })

  it('rechaza un teléfono demasiado corto', () => {
    const errores = validarCheckout({
      ...datosValidos,
      telefono: '1234'
    })

    expect(errores).toHaveProperty('telefono')
  })

  it('identifica varios campos incorrectos', () => {
    const errores = validarCheckout({
      ...datosValidos,
      nombre: ' A ',
      email: 'incorrecto',
      telefono: '123',
      direccion: 'abc',
      comuna: ' ',
      region: ''
    })

    expect(errores).toHaveProperty('nombre')
    expect(errores).toHaveProperty('email')
    expect(errores).toHaveProperty('telefono')
    expect(errores).toHaveProperty('direccion')
    expect(errores).toHaveProperty('comuna')
    expect(errores).toHaveProperty('region')
  })
})
