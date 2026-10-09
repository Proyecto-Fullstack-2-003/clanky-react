import ListaProductos from '../components/ListaProductos.jsx'

export default function Catalogo({ onAgregarCarrito }) {
  return (
    <ListaProductos
      titulo="Catálogo"
      onAgregarCarrito={onAgregarCarrito}
    />
  )
}