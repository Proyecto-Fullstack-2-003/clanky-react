
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Contacto from './Contacto.jsx'

describe('Formulario de contacto', () => {
  it('muestra los campos originales del formulario', () => {
    render(<Contacto />)

    expect(
      screen.getByLabelText('Correo electrónico')
    ).toBeInTheDocument()

    expect(screen.getByLabelText('Asunto')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /enviar mensaje/i })
    ).toBeInTheDocument()
  })

  it('muestra los errores al enviar el formulario vacío', () => {
    render(<Contacto />)

    fireEvent.click(
      screen.getByRole('button', { name: /enviar mensaje/i })
    )

    expect(
      screen.getByText('Ingresa un correo electrónico válido.')
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'El asunto debe tener entre 5 y 100 caracteres válidos.'
      )
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        'El mensaje debe tener entre 10 y 500 caracteres válidos.'
      )
    ).toBeInTheDocument()
  })

  it('valida el correo mientras se escribe', () => {
    render(<Contacto />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'correo-invalido' }
    })

    expect(
      screen.getByText('Ingresa un correo electrónico válido.')
    ).toBeInTheDocument()
  })

  it('muestra el éxito y limpia los campos cuando los datos son válidos', () => {
    render(<Contacto />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'alumno@duoc.cl' }
    })

    fireEvent.change(screen.getByLabelText('Asunto'), {
      target: { value: 'Consulta por un vinilo' }
    })

    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: {
        value: 'Quisiera saber si tienen este disco disponible.'
      }
    })

    fireEvent.click(
      screen.getByRole('button', { name: /enviar mensaje/i })
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.'
    )

    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('')
    expect(screen.getByLabelText('Asunto')).toHaveValue('')
    expect(screen.getByLabelText('Mensaje')).toHaveValue('')
  })

  it('permite cerrar el aviso de éxito', () => {
    render(<Contacto />)

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'alumno@duoc.cl' }
    })

    fireEvent.change(screen.getByLabelText('Asunto'), {
      target: { value: 'Consulta por un vinilo' }
    })

    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: {
        value: 'Quisiera saber si tienen este disco disponible.'
      }
    })

    fireEvent.click(
      screen.getByRole('button', { name: /enviar mensaje/i })
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
