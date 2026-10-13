import {useTienda} from '../context/TiendaContext.jsx'
import { useState } from 'react'
import ProductoCard from './ProductoCard.jsx'


export default function ListaProductos({
  titulo,
  formato,
  onAgregarCarrito
}) {
  const{estado}= useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('todos')

  // 1. Filtrar por formato, si la página lo requiere.
  const productosBase = estado.productos.filter((producto) => {
    if (!formato) {
      return true
    }

    return (
      producto.formato?.toLowerCase() === formato.toLowerCase()
    )
  })

  // 2. Filtrar por el texto escrito en el buscador.
  const textoBusqueda = busqueda.trim().toLowerCase()

  let productosVisibles = productosBase.filter((producto) => {
    const nombre = String(producto.nombre ?? '').toLowerCase()
    const tipo = String(producto.formato ?? '').toLowerCase()

    return (
      nombre.includes(textoBusqueda) ||
      tipo.includes(textoBusqueda)
    )
  })

  // 3. Ordenar los resultados sin modificar el array original.
  productosVisibles = [...productosVisibles]

  switch (orden) {
    case 'az':
      productosVisibles.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es')
      )
      break

    case 'za':
      productosVisibles.sort((a, b) =>
        b.nombre.localeCompare(a.nombre, 'es')
      )
      break

    case 'menor':
      productosVisibles.sort(
        (a, b) => Number(a.precio) - Number(b.precio)
      )
      break

    case 'mayor':
      productosVisibles.sort(
        (a, b) => Number(b.precio) - Number(a.precio)
      )
      break

    default:
      break
  }

  // 4. Mostrar los productos.
  return (
    <section className="pagina-catalogo">
      <h1 className="titulo-seccion">{titulo}</h1>

      <p className="subtitulo-seccion">
        Explora nuestros productos y encuentra tu próxima adquisición.
      </p>

      {/* Buscador y ordenamiento */}
      <div className="controles-productos">
        <div className="busqueda-productos">
          <input
            type="search"
            className="form-control form-control-lg border-dark border-2"
            placeholder="Buscar artista, disco o formato..."
            aria-label="Buscar productos"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        <div className="orden-productos">
          <select
            className="form-select form-select-lg border-dark border-2"
            aria-label="Ordenar productos"
            value={orden}
            onChange={(event) => setOrden(event.target.value)}
          >
            <option value="todos">Ordenar por...</option>
            <option value="az">Nombre (A - Z)</option>
            <option value="za">Nombre (Z - A)</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </div>
      </div>

      {/* Cantidad de resultados */}
      <p className="resultado-productos mb-3">
        Productos encontrados: {productosVisibles.length}
      </p>

      {/* Tarjetas de productos */}
      {productosVisibles.length > 0 ? (
        <div className="row g-4">
          {productosVisibles.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onAgregarCarrito={onAgregarCarrito}
            />
          ))}
        </div>
      ) : (
        <div className="alert alert-warning text-center">
          No se encontraron productos con esa búsqueda.
        </div>
      )}
    </section>
  )
}
