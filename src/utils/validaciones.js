import { normalizar } from './formatos.js'
export function validarCheckout(datos) {
  const errores = {}

  if (!datos.nombre.trim() || datos.nombre.trim().length < 3) {
    errores.nombre = 'Ingresa tu nombre completo.'
  }

  const email = datos.email.trim()
  const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!expresionEmail.test(email)) {
    errores.email = 'Ingresa un correo electrónico válido.'
  }

  const telefono = datos.telefono.replace(/\D/g, '')

  if (telefono.length < 8 || telefono.length > 15) {
    errores.telefono = 'Ingresa un teléfono válido.'
  }

  if (datos.direccion.trim().length < 5) {
    errores.direccion = 'Ingresa una dirección válida.'
  }

  if (!datos.comuna.trim()) {
    errores.comuna = 'Ingresa tu comuna.'
  }

  if (!datos.region.trim()) {
    errores.region = 'Selecciona una región.'
  }

  return errores
}

export const FORMATOS = ['Vinilo', 'CD', 'Merch']

export function validarProducto(datos, productos, id = null) {
  const errores = {}
  const nombre = datos.nombre.trim()

  if (nombre.length < 3) {
    errores.nombre = 'Ingresa al menos 3 caracteres.'
  
  } else if (
  productos.some(
    (producto) =>
      producto.id !== id &&
      normalizar(producto.nombre) === normalizar(nombre)
  )
) {
  errores.nombre = 'Ya existe un producto con ese nombre.'
}

if (!FORMATOS.includes(datos.formato)) {
  errores.formato = 'Selecciona Vinillo, CD o Merch'
}
if (
  String(datos.precio).trim() === '' ||
  !Number.isFinite(Number(datos.precio)) ||
  Number(datos.precio) <= 0
) {
  errores.precio = 'El precio debe ser mayor que cero'
}
if (
  String(datos.stock).trim() === '' ||
  !Number.isInteger(Number(datos.stock)) ||
  Number(datos.stock) < 0
) {
  errores.stock = 'El stock debe ser un entero mayor o igual a cero'
}

try {
  const url = new URL(datos.imagen.trim())

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error()
  }
} catch {
  errores.imagen = 'Ingresa una URL de imagen http o https.'
}

return errores
}

export function convertirProducto(datos){
  return{
    nombre: datos.nombre.trim(),
    formato: datos.formato,
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    imagen: datos.imagen.trim()
  }
}

export function validarContacto(campos){
  const errores= {}

  if(
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      campos.email.trim()
    )
  ) {
    errores.email = 'Ingresa un correo electrónico válido.'
  }
  if (
    !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'-]{5,100}$/.test(campos.asunto.trim())
  ) {
    errores.asunto = 'El asunto debe tener entre 5 y 100 caracteres válidos.'
  }
  if (
    !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,!?¿¡'"\-():;]{10,500}$/.test(
      campos.mensaje.trim()
    )
  ) {
    errores.mensaje =
      'El mensaje debe tener entre 10 y 500 caracteres válidos.'
  }  
  return errores
}
