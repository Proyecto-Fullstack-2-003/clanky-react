
import { useState } from 'react'
import { validarCheckout } from '../utils/validaciones.js'

export default function Checkout({ carrito, onFinalizarCompra }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    comuna: '',
    region: '',
    entrega: 'normal',
    pago: 'tarjeta',
    resultadoSimulado: 'aprobado'
  })

  const [errores, setErrores] = useState({})
  const [codigoCupon, setCodigoCupon] = useState('')
  const [cuponAplicado, setCuponAplicado] = useState('')
  const [mensajeCupon, setMensajeCupon] = useState('')

  const formatoPrecio = (valor) =>
    Number(valor).toLocaleString('es-CL')

  const subtotal = carrito.reduce(
    (suma, producto) =>
      suma + Number(producto.precio) * Number(producto.cantidad),
    0
  )

  const descuento =
    cuponAplicado && subtotal > 0
      ? Math.round(subtotal * 0.1)
      : 0

  const costosEntrega = {
    retiro: 0,
    normal: 3990,
    express: 6990
  }

  const costoEntrega = costosEntrega[formulario.entrega]
  const total = subtotal - descuento + costoEntrega

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }))

    setErrores((actual) => ({
      ...actual,
      [name]: ''
    }))
  }

  function aplicarCupon() {
    const codigo = codigoCupon.trim().toUpperCase()

    if (subtotal <= 0) {
      setMensajeCupon('No hay productos para aplicar el cupón.')
      return
    }

    if (['CLANKY10', 'DISCO10'].includes(codigo)) {
      setCuponAplicado(codigo)
      setMensajeCupon('Cupón aplicado: tienes un 10% de descuento.')
    } else {
      setCuponAplicado('')
      setMensajeCupon('El cupón ingresado no es válido.')
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const nuevosErrores = validarCheckout(formulario)
    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    if (carrito.length === 0) {
      window.location.hash = '#/carrito'
      return
    }

    onFinalizarCompra({
      ...formulario,
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
      direccion: formulario.direccion.trim(),
      comuna: formulario.comuna.trim(),
      region: formulario.region,
      cupon: cuponAplicado,
      subtotal,
      descuento,
      costoEntrega,
      total
    })
  }

  if (carrito.length === 0) {
    return (
      <section className="container">
        <div className="alert alert-warning text-center">
          Tu carrito está vacío. Agrega productos antes de continuar.

          <div className="mt-3">
            <a href="#/catalogo" className="btn btn-clanky">
              Ir al catálogo
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="container">
      <h1 className="titulo-seccion mb-4">
        Finalizar compra
      </h1>

      <form onSubmit={manejarEnvio} noValidate>
        <div className="row g-4">

          <div className="col-lg-7">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="h4 mb-4">Datos de entrega</h2>

                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    autoComplete="name"
                  />
                  {errores.nombre && (
                    <div className="invalid-feedback">
                      {errores.nombre}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-7 mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                      value={formulario.email}
                      onChange={manejarCambio}
                      autoComplete="email"
                    />
                    {errores.email && (
                      <div className="invalid-feedback">
                        {errores.email}
                      </div>
                    )}
                  </div>

                  <div className="col-md-5 mb-3">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                      value={formulario.telefono}
                      onChange={manejarCambio}
                      autoComplete="tel"
                    />
                    {errores.telefono && (
                      <div className="invalid-feedback">
                        {errores.telefono}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    Dirección
                  </label>
                  <input
                    id="direccion"
                    name="direccion"
                    className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                    value={formulario.direccion}
                    onChange={manejarCambio}
                    autoComplete="street-address"
                    placeholder="Calle, número y departamento"
                  />
                  {errores.direccion && (
                    <div className="invalid-feedback">
                      {errores.direccion}
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="comuna" className="form-label">
                      Comuna
                    </label>
                    <input
                      id="comuna"
                      name="comuna"
                      className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                      value={formulario.comuna}
                      onChange={manejarCambio}
                      autoComplete="address-level2"
                    />
                    {errores.comuna && (
                      <div className="invalid-feedback">
                        {errores.comuna}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">
                      Región
                    </label>
                    <select
                      id="region"
                      name="region"
                      className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                      value={formulario.region}
                      onChange={manejarCambio}
                    >
                      <option value="">Selecciona una región</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Metropolitana">Metropolitana de Santiago</option>
                      <option value="O'Higgins">Libertador General Bernardo O'Higgins</option>
                      <option value="Maule">Maule</option>
                      <option value="Ñuble">Ñuble</option>
                      <option value="Biobío">Biobío</option>
                      <option value="La Araucanía">La Araucanía</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                    </select>
                    {errores.region && (
                      <div className="invalid-feedback">
                        {errores.region}
                      </div>
                    )}
                  </div>
                </div>

                <hr />

                <h2 className="h4 mb-3">Método de entrega</h2>

                <div className="mb-3">
                  <label htmlFor="entrega" className="form-label">
                    Selecciona una opción
                  </label>
                  <select
                    id="entrega"
                    name="entrega"
                    className="form-select"
                    value={formulario.entrega}
                    onChange={manejarCambio}
                  >
                    <option value="retiro">
                      Retiro en tienda - Gratis
                    </option>
                    <option value="normal">
                      Despacho a domicilio - $3.990
                    </option>
                    <option value="express">
                      Despacho express - $6.990
                    </option>
                  </select>
                </div>

                <h2 className="h4 mt-4 mb-3">Método de pago</h2>

                <div className="mb-3">
                  <label htmlFor="pago" className="form-label">
                    Forma de pago
                  </label>
                  <select
                    id="pago"
                    name="pago"
                    className="form-select"
                    value={formulario.pago}
                    onChange={manejarCambio}
                  >
                    <option value="tarjeta">Tarjeta (simulación)</option>
                    <option value="transferencia">Transferencia (simulación)</option>
                    <option value="efectivo">Pago al retirar (simulación)</option>
                  </select>
                </div>

                <div className="alert alert-info small">
                  Esta tienda es una demostración académica. No se realizará
                  ningún cobro real ni se solicitarán datos bancarios.
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="resultadoSimulado"
                    className="form-label fw-bold"
                  >
                    Resultado simulado de la pasarela
                  </label>
                  <select
                    id="resultadoSimulado"
                    name="resultadoSimulado"
                    className="form-select"
                    value={formulario.resultadoSimulado}
                    onChange={manejarCambio}
                  >
                    <option value="aprobado">
                      Pago aprobado
                    </option>
                    <option value="rechazado">
                      Pago rechazado
                    </option>
                  </select>
                  <div className="form-text">
                    Se utiliza para demostrar ambas vistas durante la evaluación.
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">Resumen de compra</h2>

                {carrito.map((producto) => (
                  <div
                    key={producto.id}
                    className="d-flex justify-content-between gap-3 mb-3"
                  >
                    <div>
                      <div className="fw-semibold">
                        {producto.nombre}
                      </div>
                      <small className="text-muted">
                        Cantidad: {producto.cantidad}
                      </small>
                    </div>
                    <span className="text-nowrap">
                      ${formatoPrecio(
                        Number(producto.precio) * Number(producto.cantidad)
                      )}
                    </span>
                  </div>
                ))}

                <hr />

                <label htmlFor="cupon" className="form-label">
                  ¿Tienes un cupón de descuento?
                </label>

                <div className="input-group mb-2">
                  <input
                    id="cupon"
                    className="form-control"
                    value={codigoCupon}
                    onChange={(evento) => setCodigoCupon(evento.target.value)}
                    placeholder="CLANKY10"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={aplicarCupon}
                  >
                    Aplicar
                  </button>
                </div>

                {mensajeCupon && (
                  <p className={`small ${cuponAplicado ? 'text-success' : 'text-danger'}`}>
                    {mensajeCupon}
                  </p>
                )}

                <div className="d-flex justify-content-between mt-3">
                  <span>Subtotal</span>
                  <span>${formatoPrecio(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Descuento</span>
                  <span>-${formatoPrecio(descuento)}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Entrega</span>
                  <span>
                    {costoEntrega === 0
                      ? 'Gratis'
                      : `$${formatoPrecio(costoEntrega)}`}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                  <span>Total</span>
                  <span>${formatoPrecio(total)}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-clanky btn-lg w-100"
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Confirmar compra
                </button>

                <a
                  href="#/carrito"
                  className="btn btn-outline-secondary w-100 mt-2"
                >
                  Volver al carrito
                </a>
              </div>
            </div>
          </div>

        </div>
      </form>
    </section>
  )
}
