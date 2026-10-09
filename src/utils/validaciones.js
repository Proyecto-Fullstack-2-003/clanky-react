
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
