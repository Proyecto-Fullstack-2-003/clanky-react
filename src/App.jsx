
import { useEffect, useState } from 'react'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Vinilos from './pages/Vinilos.jsx'
import CDs from './pages/CDs.jsx'
import Merch from './pages/Merch.jsx'
import Contacto from './pages/Contacto.jsx'
import Carrito from './pages/Carrito.jsx'
import Login from './pages/Login.jsx'
import Checkout from './pages/Checkout.jsx'
import CompraResultado from './pages/CompraResultado.jsx'

export default function App() {
  const [ruta, setRuta] = useState(
    window.location.hash || '#/'
  )

  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('CARRITO_DISQUERIA')
      const productos = guardado ? JSON.parse(guardado) : []

      if (!Array.isArray(productos)) return []

      return productos.map((producto) => ({
        ...producto,
        cantidad: Math.max(1, Number(producto.cantidad) || 1)
      }))
    } catch {
      return []
    }
  })

  const [ultimaCompra, setUltimaCompra] = useState(() => {
    try {
      const guardada = localStorage.getItem('CLANKY_ULTIMA_COMPRA')
      return guardada ? JSON.parse(guardada) : null
    } catch {
      return null
    }
  })

  // Guardar el carrito cuando cambia.
  useEffect(() => {
    localStorage.setItem(
      'CARRITO_DISQUERIA',
      JSON.stringify(carrito)
    )
  }, [carrito])

  // Agregar productos sin superar el stock disponible.
  function agregarAlCarrito(producto) {
    if (!producto || Number(producto.stock) <= 0) {
      window.alert('Este producto no tiene stock disponible.')
      return
    }

    const existente = carrito.find(
      (item) => item.id === producto.id
    )

    if (existente) {
      const cantidadActual = Number(existente.cantidad) || 1

      if (cantidadActual >= Number(producto.stock)) {
        window.alert(
          `No puedes agregar más unidades. Stock disponible: ${producto.stock}`
        )
        return
      }

      setCarrito((actual) =>
        actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (Number(item.cantidad) || 1) + 1 }
            : item
        )
      )
    } else {
      setCarrito((actual) => [
        ...actual,
        { ...producto, cantidad: 1 }
      ])
    }
  }

  // Modificar cantidades del carrito.
  function cambiarCantidad(id, cambio) {
    const producto = carrito.find((item) => item.id === id)

    if (!producto) return

    const cantidadActual = Number(producto.cantidad) || 1
    const nuevaCantidad = cantidadActual + cambio

    if (nuevaCantidad > Number(producto.stock)) {
      window.alert(
        `Solo hay ${producto.stock} unidades disponibles.`
      )
      return
    }

    if (nuevaCantidad <= 0) {
      eliminarProducto(id)
      return
    }

    setCarrito((actual) =>
      actual.map((item) =>
        item.id === id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    )
  }

  function eliminarProducto(id) {
    setCarrito((actual) =>
      actual.filter((item) => item.id !== id)
    )
  }

  function vaciarCarrito() {
    setCarrito([])
  }

  // Registrar el resultado de la compra simulada.
  function finalizarCompra(datosCheckout) {
    if (carrito.length === 0) {
      window.location.hash = '#/carrito'
      return
    }

    const aprobada = datosCheckout.resultadoSimulado === 'aprobado'

    const compra = {
      ...datosCheckout,
      numeroOrden: `CLK-${Date.now().toString().slice(-8)}`,
      fecha: new Date().toLocaleString('es-CL'),
      estado: aprobada ? 'aprobada' : 'rechazada',
      productos: carrito.map((producto) => ({ ...producto }))
    }

    try {
      localStorage.setItem(
        'CLANKY_ULTIMA_COMPRA',
        JSON.stringify(compra)
      )
    } catch {
      window.alert(
        'No se pudo guardar el resumen de compra en este navegador.'
      )
    }

    setUltimaCompra(compra)

    // Solo vaciamos el carrito si la compra fue aprobada.
    if (aprobada) {
      setCarrito([])
    }

    window.location.hash = aprobada
      ? '#/compra-exitosa'
      : '#/compra-fallida'
  }

  // Escuchar los cambios de navegación.
  useEffect(() => {
    function actualizarRuta() {
      setRuta(window.location.hash || '#/')
    }

    window.addEventListener('hashchange', actualizarRuta)

    return () => {
      window.removeEventListener('hashchange', actualizarRuta)
    }
  }, [])

  const cantidadCarrito = carrito.reduce(
    (total, producto) =>
      total + Number(producto.cantidad || 0),
    0
  )

  let pagina

  switch (ruta) {
    case '#/catalogo':
      pagina = (
        <Catalogo onAgregarCarrito={agregarAlCarrito} />
      )
      break

    case '#/vinilos':
      pagina = (
        <Vinilos onAgregarCarrito={agregarAlCarrito} />
      )
      break

    case '#/cds':
      pagina = (
        <CDs onAgregarCarrito={agregarAlCarrito} />
      )
      break

    case '#/merch':
      pagina = (
        <Merch onAgregarCarrito={agregarAlCarrito} />
      )
      break

    case '#/contacto':
      pagina = <Contacto />
      break

    case '#/carrito':
      pagina = (
        <Carrito
          carrito={carrito}
          onCambiarCantidad={cambiarCantidad}
          onEliminarProducto={eliminarProducto}
          onVaciarCarrito={vaciarCarrito}
        />
      )
      break

    case '#/checkout':
      pagina = (
        <Checkout
          carrito={carrito}
          onFinalizarCompra={finalizarCompra}
        />
      )
      break

    case '#/compra-exitosa':
      pagina = (
        <CompraResultado
          compra={ultimaCompra?.estado === 'aprobada' ? ultimaCompra : null}
          aprobada={true}
        />
      )
      break

    case '#/compra-fallida':
      pagina = (
        <CompraResultado
          compra={ultimaCompra?.estado === 'rechazada' ? ultimaCompra : null}
          aprobada={false}
        />
      )
      break

    case '#/login':
      pagina = <Login />
      break

    case '#/':
    default:
      pagina = <Inicio />
      break
  }

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} />

      <main>
        {pagina}
      </main>

      <Footer />
    </>
  )
}
