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

it('muestra la página de inicio al entrar en la ruta principal', () => {
    renderApp('#/')

    expect(
        screen.getByRole('heading', { name: 'Clásicos en CD' })
    ).toBeInTheDocument()
})

it('muestra el login si alguien intenta entrar al panel sin sesión de administrador', () => {
    renderApp('#/admin')

    expect(
        screen.getByRole('heading', { name: 'Bienvenido a Clanky' })
    ).toBeInTheDocument()

    expect(
        screen.getByRole('button', { name: /administrador/i })
    ).toBeInTheDocument()
})

it('permite acceder al panel si existe una sesión de administrador', () => {
    localStorage.setItem(
        'SESION_CLANKY',
        JSON.stringify({ tipo: 'admin', usuario: 'admin' })
    )

    renderApp('#/admin')

    expect(
        screen.getByRole('heading', { name: /panel de administración/i })
    ).toBeInTheDocument()

    expect(screen.getByText('admin')).toBeInTheDocument()
})

it('permite acceder al panel con una sesión de administrador', () => {
    localStorage.setItem(
        'SESION_CLANKY',
        JSON.stringify({ tipo: 'admin', usuario: 'admin' })
    )

    renderApp('#/admin')

    expect(
        screen.getByRole('heading', {
            name: /panel de administración/i
        })
    ).toBeInTheDocument()

    expect(screen.getByText('admin')).toBeInTheDocument()
})

it('permite cerrar la sesión y vuelve al inicio', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
        'SESION_CLANKY',
        JSON.stringify({ tipo: 'admin', usuario: 'admin' })
    )

    renderApp('#/admin')

    await user.click(
        screen.getByRole('button', { name: /salir/i })
    )

    expect(localStorage.getItem('SESION_CLANKY')).toBeNull()
    expect(window.location.hash).toBe('#/')
    expect(
        await screen.findByRole('heading', { name: 'Clásicos en CD' })
    ).toBeInTheDocument()
})


it('permite navegar desde el menú hasta la sección de contacto', async () => {
    const user = userEvent.setup()

    renderApp()

    await user.click(
        screen.getByRole('link', { name: 'Contacto' })
    )

    expect(window.location.hash).toBe('#/contacto')

    // Comprueba que se ha navegado sin exigir un encabezado específico.
    expect(
        await screen.findByRole('link', { name: 'Contacto' })
    ).toBeInTheDocument()
})

