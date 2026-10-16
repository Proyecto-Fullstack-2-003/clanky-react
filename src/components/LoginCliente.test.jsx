
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import LoginCliente from './LoginCliente.jsx'

describe('LoginCliente', () => {
    beforeEach(() => {
        window.location.hash = ''
    })

    it('muestra los campos, las reglas de contraseña y el botón', () => {
        render(<LoginCliente onLogin={vi.fn()} />)

        expect(
            screen.getByLabelText(/correo electrónico/i)
        ).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()

        expect(screen.getByText(/8 caracteres/i)).toBeInTheDocument()
        expect(screen.getByText(/mayúscula/i)).toBeInTheDocument()
        expect(screen.getByText(/minúscula/i)).toBeInTheDocument()
        expect(screen.getByText(/número/i)).toBeInTheDocument()
        expect(screen.getByText(/carácter especial/i)).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /iniciar sesión/i })
        ).toBeInTheDocument()
    })

    it('muestra un error cuando el email no es válido', () => {
        const onLogin = vi.fn()
        render(<LoginCliente onLogin={onLogin} />)

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
            target: { value: 'correo-invalido' }
        })
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'ClaveSegura1!' }
        })
        fireEvent.click(
            screen.getByRole('button', { name: /iniciar sesión/i })
        )

        expect(screen.getByText('Ingresa un email válido.')).toBeInTheDocument()
        expect(onLogin).not.toHaveBeenCalled()
    })

    it('muestra un error cuando la contraseña no cumple los requisitos', () => {
        const onLogin = vi.fn()
        render(<LoginCliente onLogin={onLogin} />)

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
            target: { value: 'cliente@ejemplo.com' }
        })
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'clave' }
        })
        fireEvent.click(
            screen.getByRole('button', { name: /iniciar sesión/i })
        )

        expect(
            screen.getByText('La contraseña no cumple con los requisitos.')
        ).toBeInTheDocument()
        expect(onLogin).not.toHaveBeenCalled()
    })

    it('inicia sesión con datos válidos y limpia el email', () => {
        const onLogin = vi.fn()
        render(<LoginCliente onLogin={onLogin} />)

        fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
            target: { value: '  cliente@ejemplo.com  ' }
        })
        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'ClaveSegura1!' }
        })
        fireEvent.click(
            screen.getByRole('button', { name: /iniciar sesión/i })
        )

        expect(onLogin).toHaveBeenCalledWith({
            tipo: 'cliente',
            email: 'cliente@ejemplo.com'
        })
        expect(window.location.hash).toBe('#/')
    })

    it('actualiza las reglas de contraseña al escribir', () => {
        render(<LoginCliente onLogin={vi.fn()} />)

        fireEvent.change(screen.getByLabelText(/contraseña/i), {
            target: { value: 'ClaveSegura1!' }
        })

        expect(screen.getByText(/8 caracteres/i)).toBeInTheDocument()
        expect(screen.getByText(/mayúscula/i)).toBeInTheDocument()
        expect(screen.getByText(/minúscula/i)).toBeInTheDocument()
        expect(screen.getByText(/número/i)).toBeInTheDocument()
        expect(screen.getByText(/carácter especial/i)).toBeInTheDocument()
    })
})
