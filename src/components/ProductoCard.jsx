
export default function ProductoCard({
  producto,
  onAgregarCarrito
}) {
  const sinStock = Number(producto.stock) <= 0

  const colorFormato =
    producto.formato === 'Vinilo'
      ? 'bg-warning text-dark'
      : 'bg-danger text-white'

  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <article className="card tarjeta-producto shadow-sm h-100">

        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="card-img-top imagen-producto"
          loading="lazy"
        />

        <div className="card-body d-flex flex-column">

          <span className={`badge ${colorFormato} mb-2 align-self-start`}>
            {producto.formato}
          </span>

          <h2 className="h5 fw-bold">
            {producto.nombre}
          </h2>

          <p className="producto-precio mt-auto mb-3">
            ${Number(producto.precio).toLocaleString('es-CL')}
          </p>

          <p className="producto-stock">
            Stock: {producto.stock}
          </p>

          <button
            type="button"
            className="btn btn-clanky w-100"
            disabled={sinStock}
            onClick={() => onAgregarCarrito(producto)}
          >
            <i className="bi bi-cart-plus me-1"></i>

            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>

        </div>
      </article>
    </div>
  )
}
