import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'
import { TiendaProvider } from './context/TiendaContext.jsx'

function renderApp(ruta = '#/') {
    window.location.hash = ruta

    return render(
        <TiendaProvider>
            <App />
        </TiendaProvider>
    )
}

beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/'
})

describe('Integración de la aplicación Clanky', () => {
    it('muestra la página de inicio', () => {
        renderApp()

        expect(
            screen.getByRole('heading', { name: 'Bienvenido a Clanky' })
        ).toBeInTheDocument()
    })

    it('permite navegar desde el inicio hasta el catálogo', async () => {
        const user = userEvent.setup()

        renderApp()

        await user.click(
            screen.getByRole('link', { name: 'Ver catálogo' })
        )

        expect(
            await screen.findByRole('heading', { name: 'Catálogo' })
        ).toBeInTheDocument()
    })

    it('permite agregar un producto al carrito y visualizarlo', async () => {
        const user = userEvent.setup()

        renderApp('#/catalogo')

        await user.click(
            (await screen.findAllByRole('button', {
                name: 'Agregar al carrito'
            }))[0]
        )

        await user.click(
            screen.getByRole('link', { name: 'Carrito' })
        )

        expect(
            await screen.findByRole('heading', { name: 'Tu carrito' })
        ).toBeInTheDocument()

        expect(
            screen.getByText('PINK FLOYD - DARK SIDE OF THE MOON')
        ).toBeInTheDocument()
    })
})