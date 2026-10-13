import { productosIniciales } from '../data/productosIniciales.js'
import { crearEstado } from '../store/tiendaReducer.js'
import { FORMATOS } from '../utils/validaciones.js'


export const CLAVES = {
    tienda: 'clanky-react-tienda-v1',
    carritoAntiguo: 'CARRITO_DISQUERIA'
}

export function leerJSON(clave, alternativa) {
    try {
        const valor = localStorage.getItem(clave)

        return valor === null ? alternativa : JSON.parse(valor)
    } catch {
        return alternativa

    }
}

function productoValido(producto) {
    return (
        producto &&
        Number.isInteger(producto.id) &&
        producto.id > 0 &&
        typeof producto.nombre === 'string' &&
        FORMATOS.includes(producto.formato) &&
        typeof producto.imagen === 'string' &&
        Number.isFinite(producto.precio) &&
        producto.precio > 0 &&
        Number.isInteger(producto.stock) &&
        producto.stock >= 0
    )
}


export function cargarTienda() {
    const guardado = leerJSON(CLAVES.tienda, null)
    const candidatos = guardado?.productos ?? productosIniciales

    const catalogoValido =
        Array.isArray(candidatos) &&
        candidatos.every(productoValido) &&
        new Set(candidatos.map((p) => p.id)).size === candidatos.length
    const productos = (catalogoValido ? candidatos : productosIniciales).map(
        (producto) => ({ ...producto })
    )

    const candidatosCarrito =
        guardado?.carrito ?? leerJSON(CLAVES.carritoAntiguo, [])

    const ids= new Set()

    const carrito= (Array.isArray(candidatosCarrito)?candidatosCarrito: [])
        .filter((item)=>{
            const valido =
                item &&
                Number.isInteger(item.id)&&
                !ids.has(item.id)&&
                Number.isInteger(item.cantidad)&&
                item.cantidad>0 &&
                productos.some((producto)=>producto.id===item.id)

            if (valido){
                ids.add(item.id)

            }
            return valido
        })
        .map((item)=>({id: item.id, cantidad:item.cantidad}))

    return crearEstado(productos,carrito)



}
export function guardarTienda(estado){
    try{
        localStorage.setItem(
            CLAVES.tienda,
            JSON.stringify({productos:estado.productos,carrito:estado.carrito})
        )
        return true
    } catch {
    return false
    }
}