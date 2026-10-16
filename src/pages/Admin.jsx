
import { useState } from 'react'
import { useTienda } from '../context/TiendaContext.jsx'
import { validarProducto } from '../utils/validaciones.js'

const FORMULARIO_VACIO = {
  nombre: '',
  formato: 'Vinilo',
  precio: '',
  stock: '',
  imagen: ''
}

export default function Admin({ sesion }) {
  const { estado, dispatch } = useTienda()

  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [productoEditando, setProductoEditando] = useState(null)
  const [errores, setErrores] = useState({})

  const productos = estado.productos

  function manejarCambio(evento) {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }))
  }

  function limpiarFormulario() {
    setFormulario(FORMULARIO_VACIO)
    setProductoEditando(null)
    setErrores({})
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const nuevosErrores = validarProducto(
      formulario,
      productos,
      productoEditando
    )

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    dispatch({
      type: 'GUARDAR_PRODUCTO',
      id: productoEditando,
      datos: formulario
    })

    limpiarFormulario()
  }

  function editarProducto(producto) {
    setProductoEditando(producto.id)

    setFormulario({
      nombre: producto.nombre,
      formato: producto.formato,
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen: producto.imagen
    })

    setErrores({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function eliminarProducto(producto) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar "${producto.nombre}"?`
    )

    if (!confirmado) return

    dispatch({
      type: 'ELIMINAR_PRODUCTO',
      id: producto.id
    })

    if (productoEditando === producto.id) {
      limpiarFormulario()
    }
  }

  return (
    <main className="container py-4">
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h1 className="h3">Panel de administración</h1>
          <p className="mb-0">
            Bienvenido, <strong>{sesion?.usuario || 'Administrador'}</strong>.
            Desde aquí puedes gestionar el inventario de Clanky.
          </p>
        </div>
      </div>


      <section className="card shadow-sm mb-4">
        <div className="card-header py-3">
          <h2 className="h5 mb-0">
            {productoEditando !== null
              ? 'Editar producto'
              : 'Agregar producto'}
          </h2>
        </div>

        <div className="card-body p-4">
          <form onSubmit={manejarEnvio} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="nombre" className="form-label">
                  Nombre del producto
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  className={`form-control ${
                    errores.nombre ? 'is-invalid' : ''
                  }`}
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  required
                />
                {errores.nombre && (
                  <div className="invalid-feedback">
                    {errores.nombre}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="formato" className="form-label">
                  Formato
                </label>
                <select
                  id="formato"
                  name="formato"
                  className={`form-select ${
                    errores.formato ? 'is-invalid' : ''
                  }`}
                  value={formulario.formato}
                  onChange={manejarCambio}
                >
                  <option value="Vinilo">Vinilo</option>
                  <option value="CD">CD</option>
                  <option value="Merch">Merch</option>
                </select>
                {errores.formato && (
                  <div className="invalid-feedback">
                    {errores.formato}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="precio" className="form-label">
                  Precio (CLP)
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  min="1"
                  step="1"
                  className={`form-control ${
                    errores.precio ? 'is-invalid' : ''
                  }`}
                  value={formulario.precio}
                  onChange={manejarCambio}
                  required
                />
                {errores.precio && (
                  <div className="invalid-feedback">
                    {errores.precio}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="stock" className="form-label">
                  Stock disponible
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  className={`form-control ${
                    errores.stock ? 'is-invalid' : ''
                  }`}
                  value={formulario.stock}
                  onChange={manejarCambio}
                  required
                />
                {errores.stock && (
                  <div className="invalid-feedback">
                    {errores.stock}
                  </div>
                )}
              </div>

              <div className="col-12">
                <label htmlFor="imagen" className="form-label">
                  URL de la imagen
                </label>
                <input
                  id="imagen"
                  name="imagen"
                  type="url"
                  placeholder="https://ejemplo.com/portada.jpg"
                  className={`form-control ${
                    errores.imagen ? 'is-invalid' : ''
                  }`}
                  value={formulario.imagen}
                  onChange={manejarCambio}
                  required
                />
                {errores.imagen && (
                  <div className="invalid-feedback">
                    {errores.imagen}
                  </div>
                )}
              </div>

              {formulario.imagen.trim() && (
                <div className="col-12">
                  <p className="form-label">Vista previa</p>
                  <img
                    src={formulario.imagen}
                    alt="Vista previa del producto"
                    style={{
                      width: '130px',
                      height: '130px',
                      objectFit: 'contain'
                    }}
                    className="border rounded p-2"
                    onError={(evento) => {
                      evento.currentTarget.style.display = 'none'
                    }}
                    onLoad={(evento) => {
                      evento.currentTarget.style.display = 'block'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button type="submit" className="btn btn-clanky">
                {productoEditando !== null
                  ? 'Guardar cambios'
                  : 'Agregar producto'}
              </button>

              {productoEditando !== null && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Inventario de productos</h2>
          <span className="badge text-bg-secondary">
            {productos.length} productos
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Imagen</th>
                <th scope="col">Producto</th>
                <th scope="col">Formato</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No hay productos en el inventario.
                  </td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        width="55"
                        height="55"
                        style={{ objectFit: 'contain' }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>{producto.formato}</td>
                    <td>
                      ${Number(producto.precio).toLocaleString('es-CL')}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          producto.stock === 0
                            ? 'text-bg-danger'
                            : 'text-bg-success'
                        }`}
                      >
                        {producto.stock}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editarProducto(producto)}
                          aria-label={`Editar ${producto.nombre}`}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarProducto(producto)}
                          aria-label={`Eliminar ${producto.nombre}`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

