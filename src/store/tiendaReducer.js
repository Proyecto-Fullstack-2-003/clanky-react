import { convertirProducto, validarProducto } from "../utils/validaciones.js";

export function crearEstado(productos, carrito = []) {
    return { productos, carrito, aviso: null }
}

export function detalleCarrito(estado) {
    return estado.carrito
        .map((item) => {
            const producto = estado.productos.find((p) => p.id === item.id)

            return producto ? { ...producto, cantidad: item.cantidad } : null
        })
        .filter(Boolean)
}

export function resumenCarrito(estado) {
    const detalle = detalleCarrito(estado)

    const subtotal = detalle.reduce(
        (total, producto) => total + producto.precio * producto.cantidad, 0
    )

    const unidades = detalle.reduce(
        (total, producto) => total + producto.cantidad, 0
    )

    return { subtotal, unidades }
}


function conAviso(estado, texto, tipo = 'success') {
    return { ...estado, aviso: { texto, tipo } }
}



export function tiendaReducer(estado, accion) {
    switch (accion.type) {
        case 'AGREGAR': {
            const producto = estado.productos.find((p) => p.id === accion.id)
            const item = estado.carrito.find((i) => i.id === accion.id)
            const cantidadActual = item ? item.cantidad : 0

            if (!producto || cantidadActual >= producto.stock) {
                return conAviso(
                    estado, 'No hay más stock disponible de ese producto.', 'warning'
                )
            }
            const carrito = item
                ? estado.carrito.map((i) =>
                    i.id === accion.id ? { ...i, cantidad: i.cantidad + 1 } : i)
                : [...estado.carrito, { id: accion.id, cantidad: 1 }]

            return conAviso(
                { ...estado, carrito },
                `${producto.nombre} agregado al carrito.`
            )

        }
        case 'CANTIDAD': {
            const producto = estado.productos.find((p) => p.id === accion.id)

            if (!producto ||
                !Number.isInteger(accion.cantidad) ||
                accion.cantidad < 0 ||
                accion.cantidad > producto.stock) {
                return conAviso(
                    estado,
                    'La cantidad debe ser un entero y no superar el stock.', 'warning'
                )
            }
            const carrito = estado.carrito
                .map((i) =>
                    i.id === accion.id ? { ...i, cantidad: accion.cantidad } : i
                )
                .filter((i) => i.cantidad > 0)
            return { ...estado, carrito, aviso: null }
        }
        case 'VACIAR':
            return conAviso(
                { ...estado, carrito: [] },
                'El carrito quedó vacio.',
                'info'
            )

        case 'QUITAR':
            return conAviso(
                {
                    ...estado,
                    carrito: estado.carrito.filter((i) => i.id !== accion.id)
                }, 'Producto retirado del carrito', 'info'
            )

        case 'COMPRAR': {
            if (estado.carrito.length === 0) {
                return conAviso(estado, 'El carrito esta vacio.', 'warning')
            }
            const hayStockParaTodo = estado.carrito.every((item) => {
                const producto = estado.productos.find((p) => p.id === item.id)
                return (
                    producto &&
                    Number.isInteger(item.cantidad) &&
                    item.cantidad > 0 &&
                    item.cantidad <= producto.stock
                )
            })
            if (!hayStockParaTodo) {
                return conAviso(
                    estado, 'El stock cambio. Revisa las cantidades antes de comprar.', 'danger'
                )
            }
            const productos = estado.productos.map((producto) => {
                const item = estado.carrito.find((i) => i.id === producto.id)
                return { ...producto, stock: producto.stock - (item ? item.cantidad : 0) }
            })
            return conAviso(
                { ...estado, productos, carrito: [] },
                'Compra completada. Stock actualizado'
            )
        }
        case 'GUARDAR_PRODUCTO': {
            const errores = validarProducto(accion.datos, estado.productos, accion.id)

            if (Object.keys(errores).length > 0) {
                return conAviso(estado, 'Revisa los datos del producto.', 'danger')
            }
            if (
                accion.id !== null &&
                !estado.productos.some((p) => p.id === accion.id)
            ) {
                return conAviso(estado, 'El producto ya no existe.', 'warning')
            }
            const datos = convertirProducto(accion.datos)
            const nuevoId = estado.productos.length
                ? Math.max(...estado.productos.map((p) => p.id)) + 1 : 1

            const productos =
                accion.id === null
                    ? [...estado.productos, { ...datos, id: nuevoId }]
                    : estado.productos.map((p) => p.id === accion.id ? { ...p, ...datos } : p)

            return conAviso(
                { ...estado, productos },
                accion.id == null ? 'Producto creado.' : 'Producto actualizado'
            )
        }

        case 'ELIMINAR_PRODUCTO': {
            const idAEliminar = accion.id; // o action.id según tu código

            return {
                ...estado,
                // 1. Lo quitamos del catálogo
                productos: estado.productos.filter((p) => p.id !== idAEliminar),
                // 2. IMPORTANTE: También lo quitamos del carrito
                carrito: estado.carrito.filter((item) => item.id !== idAEliminar)
            };
        }

        case 'CERRAR_AVISO':
            return { ...estado, aviso: null }

        default:
            return estado
    }
}