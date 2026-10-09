import ListaProductos from '../components/ListaProductos.jsx'

export default function Merch({ onAgregarCarrito }) {
  return (
    <ListaProductos
      titulo="Merch"
      formato="Merch"
      onAgregarCarrito={onAgregarCarrito}
    />
  )
}