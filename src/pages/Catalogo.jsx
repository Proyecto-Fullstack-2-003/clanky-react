import ProductoCard from '../components/ProductoCard.jsx'
import { productosIniciales } from '../data/productosIniciales.js'

export default function Catalogo() {
  return (
    <section>

      <h1>Catálogo</h1>

      <p>
        Explora todos nuestros productos.
      </p>

      <div className="grilla-productos">

        {productosIniciales.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
          />
        ))}

      </div>

    </section>
  )
}