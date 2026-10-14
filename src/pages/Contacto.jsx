
import { useState } from 'react'
import { validarContacto } from '../utils/validaciones.js'

const CAMPOS_INICIALES = {
  email: '',
  asunto: '',
  mensaje: ''
}

export default function Contacto() {
  const [campos, setCampos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [mostrarAviso, setMostrarAviso] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target

    const nuevosCampos = {
      ...campos,
      [name]: value
    }

    setCampos(nuevosCampos)

    // Validar el campo mientras se escribe.
    const erroresValidacion = validarContacto(nuevosCampos)

    setErrores((anteriores) => ({
      ...anteriores,
      [name]: erroresValidacion[name] || ''
    }))

    setTocados((anteriores) => ({
      ...anteriores,
      [name]: true
    }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const erroresValidacion = validarContacto(campos)

    setErrores(erroresValidacion)
    setTocados({
      email: true,
      asunto: true,
      mensaje: true
    })

    // Si hay errores, no mostrar el aviso de éxito.
    if (Object.keys(erroresValidacion).length > 0) {
      return
    }

    setMostrarAviso(true)

    // El formulario original se limpiaba después del envío.
    setCampos({ ...CAMPOS_INICIALES })
    setErrores({})
    setTocados({})
  }

  function clasesCampo(nombre, esMensaje = false) {
    const base = esMensaje
      ? 'form-control rounded-0'
      : 'form-control form-control-lg rounded-0'

    if (!tocados[nombre]) {
      return base
    }

    return `${base} ${
      errores[nombre] ? 'is-invalid' : 'is-valid'
    }`
  }

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div
            className="card border-0 rounded-0"
            style={{
              border: '3px solid #111 !important',
              boxShadow: '8px 8px 0px #111'
            }}
          >
            <div className="card-body p-4 p-md-5 bg-white text-dark">
              <h1
                className="h2 text-center mb-2 fw-bold"
                style={{ color: '#d12020' }}
              >
                Contáctanos
              </h1>

              <p className="text-center text-muted mb-4 fw-bold">
                Escríbenos por dudas sobre tus discos o envíos.
              </p>

              {mostrarAviso && (
                <div
                  className="alert alert-success alert-dismissible fade show fw-bold"
                  role="alert"
                >
                  ¡Mensaje enviado con éxito! Nos pondremos en
                  contacto pronto.

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setMostrarAviso(false)}
                  />
                </div>
              )}

              <form id="formContacto" noValidate onSubmit={manejarEnvio}>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label fw-bold"
                  >
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={campos.email}
                    onChange={manejarCambio}
                    className={clasesCampo('email')}
                    placeholder="nombre@ejemplo.com"
                    aria-invalid={Boolean(
                      tocados.email && errores.email
                    )}
                    aria-describedby="errorEmail"
                    style={{ border: '2px solid #111' }}
                  />

                  <div
                    id="errorEmail"
                    className="text-danger mt-1 small fw-bold"
                  >
                    {errores.email || ''}
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="asunto"
                    className="form-label fw-bold"
                  >
                    Asunto
                  </label>

                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={campos.asunto}
                    onChange={manejarCambio}
                    className={clasesCampo('asunto')}
                    placeholder="¿En qué podemos ayudarte?"
                    aria-invalid={Boolean(
                      tocados.asunto && errores.asunto
                    )}
                    aria-describedby="errorAsunto"
                    style={{ border: '2px solid #111' }}
                  />

                  <div
                    id="errorAsunto"
                    className="text-danger mt-1 small fw-bold"
                  >
                    {errores.asunto || ''}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="mensaje"
                    className="form-label fw-bold"
                  >
                    Mensaje
                  </label>

                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="5"
                    value={campos.mensaje}
                    onChange={manejarCambio}
                    className={clasesCampo('mensaje', true)}
                    placeholder="Escribe tu mensaje aquí..."
                    aria-invalid={Boolean(
                      tocados.mensaje && errores.mensaje
                    )}
                    aria-describedby="errorMensaje"
                    style={{ border: '2px solid #111' }}
                  />

                  <div
                    id="errorMensaje"
                    className="text-danger mt-1 small fw-bold"
                  >
                    {errores.mensaje || ''}
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn fw-bold px-5 py-2 fs-5 text-uppercase mt-2"
                    style={{
                      backgroundColor: '#d12020',
                      color: '#ffdd00',
                      border: '2px solid #111',
                      boxShadow: '4px 4px 0px #111',
                      transition: '0.2s'
                    }}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
