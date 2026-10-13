
import { useEffect, useState } from 'react'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { useTienda } from './context/TiendaContext.jsx'
import { detalleCarrito, resumenCarrito } from './store/tiendaReducer.js'
import Admin from './pages/Admin.jsx'
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

  const { estado, dispatch } = useTienda()

  const carrito = detalleCarrito(estado)

  const [ultimaCompra, setUltimaCompra] = useState(() => {
    try {
      const guardada = localStorage.getItem('CLANKY_ULTIMA_COMPRA')
      return guardada ? JSON.parse(guardada) : null
    } catch {
      return null
    }
  })

  const [sesion, setSesion] = useState(() => {
    try {
      const guardada = localStorage.getItem('SESION_CLANKY')
      return guardada ? JSON.parse(guardada) : null
    } catch {
      return null
    }
  })
  function iniciarSesion(datos) {
    localStorage.setItem('SESION_CLANKY', JSON.stringify(datos))
    setSesion(datos)
  }

  function cerrarSesion() {
    localStorage.removeItem('SESION_CLANKY')
    setSesion(null)
    window.location.hash = '#/'
  }


  // Agregar productos sin superar el stock disponible.
  function agregarAlCarrito(producto) {
    dispatch({ type: 'AGREGAR', id: producto.id })
  }

  // Modificar cantidades del carrito.
  function cambiarCantidad(id, cambio) {
    const item = carrito.find((producto) => producto.id === id)
    if (!item) return

    dispatch({ type: 'CANTIDAD', id, cantidad: item.cantidad + cambio })
  }

  function eliminarProducto(id) {
    dispatch({ type: 'QUITAR', id })
  }

  function vaciarCarrito() {
    dispatch({ type: 'VACIAR' })
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
      dispatch({ type: 'COMPRAR' })
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

  const cantidadCarrito = resumenCarrito(estado).unidades

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
      pagina = <Login onLogin={iniciarSesion} />
      break

    case '#/admin':
      pagina = sesion?.tipo === 'admin' ? (
        <Admin sesion={sesion} />) : (
        <Login onLogin={iniciarSesion} />
      )
      break

    case '#/':
    default:
      pagina = <Inicio />
      break
  }

  return (
    <>
      <Header cantidadCarrito={cantidadCarrito} sesion={sesion} onCerrarSesion={cerrarSesion} />

      <main>
        {estado.aviso && (
          <div className="container">
            <div
              className={`alert alert-${estado.aviso.tipo} alert-dismissible mt-3`}
              role="status"
            >
              {estado.aviso.texto}

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar aviso"
                onClick={() => dispatch({ type: 'CERRAR_AVISO' })}
              ></button>
            </div>
          </div>)}
        {pagina}
      </main>

      <Footer />
    </>
  )
}
