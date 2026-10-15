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
            screen.getByRole('heading', { name: 'Clásicos en CD' })
        ).toBeInTheDocument()
    })

    it('permite navegar desde el inicio hasta el catálogo', async () => {
        const user = userEvent.setup()

        renderApp()

        await user.click(
            screen.getByRole('link', { name: /Ver catálogo/i })
        )

        expect(
            await screen.findByRole('heading', { name: 'Catálogo' })
        ).toBeInTheDocument()
    })

    it('permite agregar un producto al carrito y visualizarlo', async () => {
        const user = userEvent.setup()

        renderApp('#/catalogo')

        const tarjetaProducto = screen
            .getByText('PINK FLOYD - DARK SIDE OF THE MOON')
            .closest('article')

        await user.click(
            tarjetaProducto.querySelector('button')
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

    it('permite completar una compra desde el carrito hasta el resultado', async () => {
        const user = userEvent.setup()

        renderApp('#/catalogo')

        const tarjetaProducto = screen
            .getByText('PINK FLOYD - DARK SIDE OF THE MOON')
            .closest('article')

        await user.click(
            tarjetaProducto.querySelector('button')
        )

        await user.click(screen.getByRole('link', { name: 'Carrito' }))

        expect(
            screen.getByRole('heading', { name: 'Tu carrito' })
        ).toBeInTheDocument()

        await user.click(
            screen.getByRole('link', {
                name: /Continuar con la compra/i
            })
        )

        expect(window.location.hash).toBe('#/checkout')

        expect(
            screen.getByRole('heading', { name: 'Finalizar compra' })
        ).toBeInTheDocument()

        await user.type(
            screen.getByLabelText('Nombre completo'),
            'Juan Pérez'
        )

        await user.type(
            screen.getByLabelText('Correo electrónico'),
            'juan@test.cl'
        )

        await user.type(
            screen.getByLabelText('Teléfono'),
            '912345678'
        )

        await user.type(
            screen.getByLabelText('Dirección'),
            'Av. Siempre Viva 123'
        )

        await user.type(
            screen.getByLabelText('Comuna'),
            'Viña del Mar'
        )

        await user.selectOptions(
            screen.getByLabelText('Región'),
            'Valparaíso'
        )

        await user.click(
            screen.getByRole('button', { name: /Confirmar compra/i })
        )

        expect(
            screen.getByRole('heading', { name: /compra/i })
        ).toBeInTheDocument()

        expect(localStorage.getItem('CLANKY_ULTIMA_COMPRA')).not.toBeNull()
    })
})