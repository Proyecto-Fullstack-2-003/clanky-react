
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import LoginAdmin from './LoginAdmin.jsx'

describe('LoginAdmin', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.location.hash = ''
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('muestra los campos y el botón de inicio de sesión', () => {
    render(<LoginAdmin onLogin={vi.fn()} />)

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesión como admin/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/acesso restringido/i)).toBeInTheDocument()
  })

  it('muestra un error con credenciales incorrectas', () => {
    render(<LoginAdmin onLogin={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'usuario-falso' }
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'incorrecta' }
    })
    fireEvent.click(
      screen.getByRole('button', { name: /iniciar sesión como admin/i })
    )

    expect(
      screen.getByText('Usuario o contraseña incorrectos')
    ).toBeInTheDocument()
  })

  it('inicia sesión con las credenciales correctas', async () => {
    const onLogin = vi.fn()
    render(<LoginAdmin onLogin={onLogin} />)

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'admin' }
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '1234' }
    })
    fireEvent.click(
      screen.getByRole('button', { name: /iniciar sesión como admin/i })
    )

    expect(
      screen.getByText('Inicio de sesion exitoso')
    ).toBeInTheDocument()

    expect(onLogin).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(onLogin).toHaveBeenCalledWith({
      tipo: 'admin',
      usuario: 'admin'
    })
    expect(window.location.hash).toBe('#/admin')
  })

  it('acepta espacios alrededor del nombre de usuario', async () => {
    const onLogin = vi.fn()
    render(<LoginAdmin onLogin={onLogin} />)

    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: '  admin  ' }
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '1234' }
    })
    fireEvent.click(
      screen.getByRole('button', { name: /iniciar sesión como admin/i })
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(onLogin).toHaveBeenCalledWith({
      tipo: 'admin',
      usuario: 'admin'
    })
  })
})
