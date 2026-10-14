
import { useState } from 'react'

const diapositivas = [
  {
    titulo: 'Clásicos en CD',
    descripcion:
      'Mantén tu colección física al día. Encuentra los discos más sonados del momento y novedades recién llegadas en formato CD.',
    boton: 'Explorar CDs',
    destino: '#/cds',
    imagen:
      'https://i0.wp.com/elplanetaurbano.com/wp-content/uploads/2018/10/NocheDisquer%C3%ADas3.jpg?fit=770%2C471&ssl=1',
    textoBoton: 'btn-warning text-dark',
    alt: 'Colección de discos físicos'
  },
  {
    titulo: 'Olivia Rodrigo y su nuevo álbum',
    descripcion:
      'Ya disponible la edición especial en vinilo de "You Seem Pretty Sad For A Girl So In Love". Consigue el tuyo antes de que se agote.',
    boton: 'Ir a Vinilos',
    destino: '#/vinilos',
    imagen:
      'https://thehofstrachronicle.com/wp-content/uploads/2026/06/Showbiz-by-PS.webp',
    textoBoton: 'btn-light text-dark',
    alt: 'Novedades musicales'
  },
  {
    titulo: 'Merch y Coleccionables',
    descripcion:
      'Lleva tu amor por la música más allá de las canciones. Descubre accesorios y coleccionables de tus fandoms favoritos.',
    boton: 'Ver Coleccionables',
    destino: '#/merch',
    imagen:
      'https://madrid365.es/wp-content/uploads/2023/05/1-2023-05-30T212833.784.png',
    textoBoton: 'btn-success',
    alt: 'Productos y coleccionables musicales'
  }
]

const categorias = [
  {
    nombre: 'VINILOS',
    destino: '#/vinilos',
    imagen:
      'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=600&auto=format&fit=crop',
    alt: 'Discos de vinilo'
  },
  {
    nombre: "CD'S",
    destino: '#/cds',
    imagen:
      'https://dojiw2m9tvv09.cloudfront.net/41657/2/cd16232549.jpeg?114&t=1787884050',
    alt: 'Colección de CDs'
  },
  {
    nombre: 'MERCH',
    destino: '#/merch',
    imagen:
      'https://images.squarespace-cdn.com/content/v1/613add39ff51db1c827d41c2/2161650c-f0f9-4905-a4db-91204bcae5e6/CONTAIN+WEBSITE+BANNERS_ARTIST_MERCH-2.jpg',
    alt: 'Merchandising de artistas'
  }
]

export default function Inicio() {
  const [indiceActual, setIndiceActual] = useState(0)

  const diapositiva = diapositivas[indiceActual]

  function anterior() {
    setIndiceActual((indice) =>
      indice === 0 ? diapositivas.length - 1 : indice - 1
    )
  }

  function siguiente() {
    setIndiceActual((indice) =>
      (indice + 1) % diapositivas.length
    )
  }

  return (
    <div className="inicio">

      {/* Carrusel principal */}
      <section
        className="inicio-carrusel mb-5"
        aria-label="Novedades destacadas"
      >
        <div className="inicio-hero">

          <img
            key={diapositiva.imagen}
            src={diapositiva.imagen}
            alt={diapositiva.alt}
            className="inicio-hero-imagen"
          />

          <div className="inicio-hero-sombra"></div>

          <div className="inicio-hero-contenido">
            <h1 className="display-4 fw-bold mb-3">
              {diapositiva.titulo}
            </h1>

            <p className="lead mb-3">
              {diapositiva.descripcion}
            </p>

            <a
              href={diapositiva.destino}
              className={`btn ${diapositiva.textoBoton} fw-bold mt-2 inicio-hero-boton`}
            >
              {diapositiva.boton}
            </a>
          </div>

          <button
            type="button"
            className="inicio-control inicio-control-anterior"
            onClick={anterior}
            aria-label="Diapositiva anterior"
          >
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>

          <button
            type="button"
            className="inicio-control inicio-control-siguiente"
            onClick={siguiente}
            aria-label="Siguiente diapositiva"
          >
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>

          <div
            className="inicio-indicadores"
            role="group"
            aria-label="Seleccionar diapositiva"
          >
            {diapositivas.map((item, indice) => (
              <button
                key={item.titulo}
                type="button"
                className={`inicio-indicador ${
                  indice === indiceActual ? 'activo' : ''
                }`}
                aria-label={`Mostrar diapositiva ${indice + 1}: ${item.titulo}`}
                aria-pressed={indice === indiceActual}
                onClick={() => setIndiceActual(indice)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Acceso al catálogo */}
      <section className="inicio-acceso-catalogo text-center mt-4 mb-5">
        <a
          href="#/catalogo"
          className="btn btn-clanky fw-bold px-5 py-3 fs-5 text-uppercase"
        >
          Ver Catálogo
        </a>
      </section>

      {/* Categorías */}
      <section className="inicio-categorias mb-5">
        <h2 className="inicio-titulo-categorias mb-4">
          Explora nuestras categorías
        </h2>

        <div className="row justify-content-center g-4">
          {categorias.map((categoria) => (
            <div
              key={categoria.nombre}
              className="col-12 col-md-4 col-lg-3"
            >
              <a
                href={categoria.destino}
                className="inicio-enlace-categoria"
                aria-label={`Explorar ${categoria.nombre}`}
              >
                <article className="inicio-tarjeta-categoria">

                  <img
                    src={categoria.imagen}
                    alt={categoria.alt}
                    loading="lazy"
                  />

                  <div className="inicio-categoria-overlay">
                    <h3>{categoria.nombre}</h3>
                  </div>

                </article>
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
