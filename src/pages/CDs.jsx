import ListaProductos from '../components/ListaProductos.jsx'

export default function CDs({ onAgregarCarrito }) {
  return (
    <ListaProductos
      titulo="CDs"
      formato="CD"
      onAgregarCarrito={onAgregarCarrito}
    />
  )
}