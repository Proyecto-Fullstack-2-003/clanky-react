
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Admin from './Admin.jsx'
import { useTienda } from '../context/TiendaContext.jsx'

vi.mock('../context/TiendaContext.jsx', () => ({
  useTienda: vi.fn()
}))

const productosIniciales = [
  {
    id: 1,
    nombre: 'Abbey Road',
    formato: 'Vinilo',
    precio: 25000,
    stock: 5,
    imagen: 'https://example.com/abbey-road.jpg'
  },
  {
    id: 2,
    nombre: 'Thriller',
    formato: 'CD',
    precio: 12000,
    stock: 3,
    imagen: 'https://example.com/thriller.jpg'
  }
]

let dispatch

function prepararAdmin(productos = productosIniciales) {
  dispatch = vi.fn()

  useTienda.mockReturnValue({
    estado: {
      productos,
      carrito: [],
      aviso: null
    },
    dispatch
  })

  render(
    <Admin sesion={{ tipo: 'admin', usuario: 'admin' }} />
  )
}

function completarFormulario({
  nombre = 'Dark Side of the Moon',
  formato = 'Vinilo',
  precio = '30000',
  stock = '4',
  imagen = 'https://example.com/dark-side.jpg'
} = {}) {
  fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
    target: { value: nombre }
  })

  fireEvent.change(screen.getByLabelText(/formato/i), {
    target: { value: formato }
  })

  fireEvent.change(screen.getByLabelText(/precio/i), {
    target: { value: precio }
  })

  fireEvent.change(screen.getByLabelText(/stock disponible/i), {
    target: { value: stock }
  })

  fireEvent.change(screen.getByLabelText(/url de la imagen/i), {
    target: { value: imagen }
  })
}

describe('Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn()
  })

  it('muestra el panel y el nombre del administrador', () => {
    prepararAdmin()

    expect(
      screen.getByRole('heading', { name: /panel de administración/i })
    ).toBeInTheDocument()

    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('muestra los productos del inventario', () => {
    prepararAdmin()

    expect(screen.getByText('Abbey Road')).toBeInTheDocument()
    expect(screen.getByText('Thriller')).toBeInTheDocument()
    expect(screen.getByText('2 productos')).toBeInTheDocument()
  })

  it('envía la acción para agregar un producto válido', () => {
    prepararAdmin()

    completarFormulario()

    fireEvent.click(
      screen.getByRole('button', { name: /agregar producto/i })
    )

    expect(dispatch).toHaveBeenCalledWith({
      type: 'GUARDAR_PRODUCTO',
      id: null,
      datos: {
        nombre: 'Dark Side of the Moon',
        formato: 'Vinilo',
        precio: '30000',
        stock: '4',
        imagen: 'https://example.com/dark-side.jpg'
      }
    })
  })

  it('no envía la acción si el producto tiene datos inválidos', () => {
    prepararAdmin()

    completarFormulario({ nombre: 'AB', precio: '-5', stock: '-1' })

    fireEvent.click(
      screen.getByRole('button', { name: /agregar producto/i })
    )

    expect(dispatch).not.toHaveBeenCalled()
    expect(
      screen.getByText('Ingresa al menos 3 caracteres.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('El precio debe ser mayor que cero')
    ).toBeInTheDocument()
    expect(
      screen.getByText('El stock debe ser un entero mayor o igual a cero')
    ).toBeInTheDocument()
  })

  it('carga los datos al editar un producto', () => {
    prepararAdmin()

    const fila = screen.getByRole('row', { name: /abbey road/i })

    fireEvent.click(
      within(fila).getByRole('button', { name: /editar abbey road/i })
    )

    expect(screen.getByLabelText(/nombre del producto/i)).toHaveValue(
      'Abbey Road'
    )
    expect(screen.getByLabelText(/stock disponible/i)).toHaveValue(5)

    expect(
      screen.getByRole('button', { name: /guardar cambios/i })
    ).toBeInTheDocument()
  })

  it('envía los cambios al editar un producto', () => {
    prepararAdmin()

    const fila = screen.getByRole('row', { name: /abbey road/i })

    fireEvent.click(
      within(fila).getByRole('button', { name: /editar abbey road/i })
    )

    fireEvent.change(screen.getByLabelText(/nombre del producto/i), {
      target: { value: 'Abbey Road Remasterizado' }
    })

    fireEvent.change(screen.getByLabelText(/stock disponible/i), {
      target: { value: '10' }
    })

    fireEvent.click(
      screen.getByRole('button', { name: /guardar cambios/i })
    )

    expect(dispatch).toHaveBeenCalledWith({
      type: 'GUARDAR_PRODUCTO',
      id: 1,
      datos: {
        nombre: 'Abbey Road Remasterizado',
        formato: 'Vinilo',
        precio: '25000',
        stock: '10',
        imagen: 'https://example.com/abbey-road.jpg'
      }
    })
  })

  it('elimina un producto cuando se confirma', () => {
    prepararAdmin()
    window.confirm.mockReturnValue(true)

    const fila = screen.getByRole('row', { name: /abbey road/i })

    fireEvent.click(
      within(fila).getByRole('button', { name: /eliminar abbey road/i })
    )

    expect(window.confirm).toHaveBeenCalledWith(
      '¿Seguro que quieres eliminar "Abbey Road"?'
    )

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ELIMINAR_PRODUCTO',
      id: 1
    })
  })

  it('no elimina el producto si se cancela la confirmación', () => {
    prepararAdmin()
    window.confirm.mockReturnValue(false)

    const fila = screen.getByRole('row', { name: /abbey road/i })

    fireEvent.click(
      within(fila).getByRole('button', { name: /eliminar abbey road/i })
    )

    expect(dispatch).not.toHaveBeenCalled()
  })
})
