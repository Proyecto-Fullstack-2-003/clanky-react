
export default function Carrito({
  carrito,
  onCambiarCantidad,
  onEliminarProducto,
  onVaciarCarrito
}) {
  const total = carrito.reduce(
    (suma, producto) =>
      suma + Number(producto.precio) * Number(producto.cantidad),
    0
  )

  const formatoPrecio = (valor) =>
    Number(valor).toLocaleString('es-CL')

  return (
    <section className="container-fluid">

      <h1 className="titulo-seccion mb-4">
        Tu carrito
      </h1>

      {carrito.length === 0 ? (
        <div className="alert alert-light text-center shadow">
          <i className="bi bi-cart-x fs-1 d-block mb-3"></i>

          <h2 className="h4">Tu carrito está vacío</h2>

          <p>¡Encuentra algo de música que te guste!</p>

          <a href="#/catalogo" className="btn btn-clanky">
            Ir al catálogo
          </a>
        </div>
      ) : (
        <>
          <div className="table-responsive bg-white p-3 shadow">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {carrito.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          width="60"
                          height="60"
                          style={{ objectFit: 'contain' }}
                        />

                        <div>
                          <div className="fw-semibold">
                            {producto.nombre}
                          </div>

                          <small className="text-muted">
                            Stock: {producto.stock}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      ${formatoPrecio(producto.precio)}
                    </td>

                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          aria-label={`Quitar una unidad de ${producto.nombre}`}
                          onClick={() =>
                            onCambiarCantidad(producto.id, -1)
                          }
                        >
                          −
                        </button>

                        <span className="fw-bold">
                          {producto.cantidad}
                        </span>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          aria-label={`Agregar una unidad de ${producto.nombre}`}
                          disabled={
                            producto.cantidad >= Number(producto.stock)
                          }
                          onClick={() =>
                            onCambiarCantidad(producto.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="fw-bold">
                      ${formatoPrecio(
                        producto.precio * producto.cantidad
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        aria-label={`Eliminar ${producto.nombre}`}
                        onClick={() =>
                          onEliminarProducto(producto.id)
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">

            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onVaciarCarrito}
            >
              Vaciar carrito
            </button>

            <div className="text-md-end text-white">
              <h2 className="h4">
                Total: ${formatoPrecio(total)}
              </h2>

              <button
                type="button"
                className="btn btn-clanky btn-lg mt-2"
                onClick={() =>
                  window.alert(
                    'El siguiente paso será implementar el checkout.'
                  )
                }
              >
                
<a
  href="#/checkout"
  className="btn btn-clanky btn-lg mt-2"
>
  <i className="bi bi-credit-card me-2"></i>
  Continuar con la compra
</a>

              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
