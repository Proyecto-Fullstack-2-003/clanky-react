import ListaProductos from '../components/ListaProductos.jsx'

export default function Vinilos({ onAgregarCarrito }) {
  return (
    <ListaProductos
      titulo="Vinilos"
      formato="Vinilo"
      onAgregarCarrito={onAgregarCarrito}
    />
  )
}