import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Inicio from './Inicio.jsx'

describe('Página de inicio de Clanky', () => {
  it('muestra la primera diapositiva al abrir Inicio', () => {
    render(<Inicio />)

    expect(
      screen.getByRole('heading', {
        name: 'Clásicos en CD'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: 'Explorar CDs'
      })
    ).toHaveAttribute('href', '#/cds')
  })

  it('avanza a la siguiente diapositiva', async () => {
    const user = userEvent.setup()

    render(<Inicio />)

    await user.click(
      screen.getByRole('button', {
        name: 'Siguiente diapositiva'
      })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Olivia Rodrigo y su nuevo álbum'
      })
    ).toBeInTheDocument()
  })

  it('vuelve a la última diapositiva al retroceder desde la primera', async () => {
    const user = userEvent.setup()

    render(<Inicio />)

    await user.click(
      screen.getByRole('button', {
        name: 'Diapositiva anterior'
      })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Merch y Coleccionables'
      })
    ).toBeInTheDocument()
  })

  it('muestra los enlaces al catálogo y a las tres categorías', () => {
    render(<Inicio />)

    expect(
      screen.getByRole('link', { name: 'Ver Catálogo' })
    ).toHaveAttribute('href', '#/catalogo')

    expect(
      screen.getByRole('link', { name: 'Explorar VINILOS' })
    ).toHaveAttribute('href', '#/vinilos')

    expect(
      screen.getByRole('link', { name: "Explorar CD'S" })
    ).toHaveAttribute('href', '#/cds')

    expect(
      screen.getByRole('link', { name: 'Explorar MERCH' })
    ).toHaveAttribute('href', '#/merch')
  })
})
