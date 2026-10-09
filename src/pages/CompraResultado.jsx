
export default function CompraResultado({ compra, aprobada }) {
  const formatoPrecio = (valor) =>
    Number(valor || 0).toLocaleString('es-CL')

  if (!compra) {
    return (
      <section className="container">
        <div className="alert alert-warning text-center">
          No hay una compra para mostrar.

          <div className="mt-3">
            <a href="#/catalogo" className="btn btn-clanky">
              Volver al catálogo
            </a>
          </div>
        </div>
      </section>
    )
  }

  const productos = compra.productos || []

  return (
    <section className="container">
      <div className="card shadow mx-auto" style={{ maxWidth: '850px' }}>
        <div className="card-body p-4 p-md-5">

          <div className="text-center mb-4">
            <i
              className={`bi ${
                aprobada
                  ? 'bi-check-circle-fill text-success'
                  : 'bi-x-circle-fill text-danger'
              }`}
              style={{ fontSize: '4rem' }}
              aria-hidden="true"
            ></i>

            <h1 className="h2 text-dark mt-3">
              {aprobada
                ? '¡Compra exitosa!'
                : 'La compra no pudo completarse'}
            </h1>

            <p className="text-muted">
              {aprobada
                ? 'Tu pedido quedó registrado correctamente.'
                : 'El pago fue rechazado en esta simulación. Puedes intentarlo nuevamente.'}
            </p>
          </div>

          <div className={`alert ${aprobada ? 'alert-success' : 'alert-danger'}`}>
            <strong>Pedido:</strong> {compra.numeroOrden}
            <br />
            <strong>Estado:</strong> {aprobada ? 'Aprobado' : 'Rechazado'}
            <br />
            <strong>Fecha:</strong> {compra.fecha}
          </div>

          <h2 className="h5 mt-4">Datos de entrega</h2>

          <p className="mb-1">
            <strong>Cliente:</strong> {compra.nombre}
          </p>
          <p className="mb-1">
            <strong>Correo:</strong> {compra.email}
          </p>
          <p className="mb-1">
            <strong>Dirección:</strong> {compra.direccion}
          </p>
          <p className="mb-1">
            <strong>Comuna:</strong> {compra.comuna}
          </p>
          <p className="mb-1">
            <strong>Región:</strong> {compra.region}
          </p>
          <p className="mb-1">
            <strong>Entrega:</strong>{' '}
            {compra.entrega === 'retiro'
              ? 'Retiro en tienda'
              : compra.entrega === 'express'
                ? 'Despacho express'
                : 'Despacho a domicilio'}
          </p>
          <p>
            <strong>Pago:</strong>{' '}
            {compra.pago === 'tarjeta'
              ? 'Tarjeta (simulación)'
              : compra.pago === 'transferencia'
                ? 'Transferencia (simulación)'
                : 'Pago al retirar (simulación)'}
          </p>

          <h2 className="h5 mt-4">Productos del pedido</h2>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td className="text-center">
                      {producto.cantidad}
                    </td>
                    <td className="text-end">
                      ${formatoPrecio(
                        Number(producto.precio) *
                        Number(producto.cantidad)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ms-auto" style={{ maxWidth: '350px' }}>
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>${formatoPrecio(compra.subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Descuento</span>
              <span>-${formatoPrecio(compra.descuento)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Entrega</span>
              <span>${formatoPrecio(compra.costoEntrega)}</span>
            </div>

            {compra.cupon && (
              <p className="small text-success mt-2">
                Cupón aplicado: {compra.cupon}
              </p>
            )}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>${formatoPrecio(compra.total)}</span>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
            {aprobada ? (
              <a href="#/catalogo" className="btn btn-clanky">
                Seguir comprando
              </a>
            ) : (
              <a href="#/checkout" className="btn btn-clanky">
                Intentar nuevamente
              </a>
            )}

            <a href="#/" className="btn btn-outline-secondary">
              Volver al inicio
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
