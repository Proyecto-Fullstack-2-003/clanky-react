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


import { validarProducto, convertirProducto, validarContacto } from './validaciones.js'

// Añade este import junto a los imports que ya tienes arriba.
// No dupliques el import de validarCheckout.

const productoValido = {
  nombre: 'Álbum Clanky',
  formato: 'Vinilo',
  precio: '10000',
  stock: '0',
  imagen: 'https://example.com/album.jpg',
}

describe('Validaciones de productos', () => {
  it('acepta un producto válido con stock cero', () => {
    expect(validarProducto(productoValido, [])).toEqual({})
  })

  it('rechaza nombres demasiado cortos', () => {
    const errores = validarProducto(
      { ...productoValido, nombre: 'AB' },
      [],
    )

    expect(errores).toHaveProperty('nombre')
  })

  it('rechaza nombres duplicados aunque cambien mayúsculas o tildes', () => {
    const productos = [
      { id: 1, nombre: 'Álbum Clanky' },
    ]

    const errores = validarProducto(
      { ...productoValido, nombre: 'album clanky' },
      productos,
    )

    expect(errores).toHaveProperty('nombre')
  })

  it('permite conservar el nombre al editar el mismo producto', () => {
    const productos = [
      { id: 1, nombre: 'Álbum Clanky' },
    ]

    expect(
      validarProducto(productoValido, productos, 1),
    ).not.toHaveProperty('nombre')
  })

  it('rechaza formatos no admitidos', () => {
    const errores = validarProducto(
      { ...productoValido, formato: 'Casete' },
      [],
    )

    expect(errores).toHaveProperty('formato')
  })

  it('rechaza precios no válidos', () => {
    for (const precio of ['', 'abc', '0', '-100']) {
      const errores = validarProducto(
        { ...productoValido, precio },
        [],
      )

      expect(errores).toHaveProperty('precio')
    }
  })

  it('rechaza stock negativo o decimal', () => {
    for (const stock of ['-1', '1.5', 'abc']) {
      const errores = validarProducto(
        { ...productoValido, stock },
        [],
      )

      expect(errores).toHaveProperty('stock')
    }
  })

  it('rechaza URLs de imagen inválidas o inseguras', () => {
    for (const imagen of ['no-es-una-url', 'javascript:alert(1)']) {
      const errores = validarProducto(
        { ...productoValido, imagen },
        [],
      )

      expect(errores).toHaveProperty('imagen')
    }
  })

  it('convierte los datos del formulario a los tipos correctos', () => {
    expect(convertirProducto(productoValido)).toEqual({
      nombre: 'Álbum Clanky',
      formato: 'Vinilo',
      precio: 10000,
      stock: 0,
      imagen: 'https://example.com/album.jpg',
    })
  })
})

describe('Validaciones de contacto', () => {
  it('acepta los datos de contacto válidos', () => {
    expect(
      validarContacto({
        email: 'alumno@duoc.cl',
        asunto: 'Consulta por un vinilo',
        mensaje: 'Quisiera saber si tienen este disco disponible.',
      }),
    ).toEqual({})
  })

  it('identifica los errores de correo, asunto y mensaje', () => {
    const errores = validarContacto({
      email: 'correo-invalido',
      asunto: 'abc',
      mensaje: 'corto',
    })

    expect(errores).toHaveProperty('email')
    expect(errores).toHaveProperty('asunto')
    expect(errores).toHaveProperty('mensaje')
  })
})
