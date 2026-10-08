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

export default function App() {

  const [ruta, setRuta] = useState(
    window.location.hash || '#/'
  )

  useEffect(() => {

    function actualizarRuta() {
      setRuta(window.location.hash || '#/')
    }

    window.addEventListener(
      'hashchange',
      actualizarRuta
    )

    return () => {
      window.removeEventListener(
        'hashchange',
        actualizarRuta
      )
    }

  }, [])

  let pagina

  switch (ruta) {

    case '#/catalogo':
      pagina = <Catalogo />
      break

    case '#/vinilos':
      pagina = <Vinilos />
      break

    case '#/cds':
      pagina = <CDs />
      break

    case '#/merch':
      pagina = <Merch />
      break

    case '#/contacto':
      pagina = <Contacto />
      break

    case '#/carrito':
      pagina = <Carrito />
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
      <Header />

      <main>
        {pagina}
      </main>

      <Footer />
    </>
  )
}