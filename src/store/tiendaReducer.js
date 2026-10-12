import { convertirProducto, validarProductos } from "../utils/validaciones";

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

export function resumenCarrito(estado){
    const detalle = detalleCarrito(estado)

    const subtotal=detalle.reduce(
        (total,producto)=> total + producto.precio * producto.cantidad,0
    )

    const unidades= detalle.reduce(
        (total,producto)=>total+producto.cantidad,0
    )

    return {subtotal, unidades}
}


function conAviso(estado,texto,tipo ='success'){
    return {...estado,aviso: {texto,tipo}}
}



export function tiendaReducer(estado, accion) {
    switch (accion.type){
        case 'AGREGAR': {
            const producto = estado.productos.find((p)=>p.id===useActionState.id)
            const item = estado.carrito.find((i)=>item.id===accion.id)
            const cantidadActual = item?item.cantidad:0

            if (!producto || cantidadActual >= producto.stock){
                return conAviso(
                    estado,'No hay más stock disponible de ese producto.', 'warning'
                )
            }
            const carrito= item
            ? estado.carrito.map((i)=>
                i.id ===accion.id ? {...i,cantidad: i.cantidad+1}:i)
            : [...estado.carrito,{id: accion.id,cantidad:1}]

            return conAviso(
                { ...estado,carrito},
                `${producto.nombre} agregado al carrito.`
            )

        }
    }
}