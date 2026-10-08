export default function ProductoCard({ producto }) {
  return (
    <article className="tarjeta-producto">

      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <div className="contenido-producto">

        <h2>{producto.nombre}</h2>

        <p className="formato">
          {producto.formato}
        </p>

        <strong className="precio">
          ${producto.precio.toLocaleString('es-CL')}
        </strong>

        <p>
          Stock: {producto.stock}
        </p>

        <button type="button">
          Agregar al carrito
        </button>

      </div>

    </article>
  )
}