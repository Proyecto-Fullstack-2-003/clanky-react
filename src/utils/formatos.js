export function formatearPrecio(valor) {
    return `$${Number(valor).toLocaleString('es-CL')}`;
}


export function normalizar(texto){
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

export function estadoStock(stock) {
    if (stock<=0){
        return{texto: 'Sin stock', variante: 'danger'}
    }

    if (stock <= 3) {
        return{texto: 'Ultimas ${stock} unidades', variante: 'warning'}
    }

    return{texto: 'Disponible', variante:'success'}
}