export function evaluarReglasContraseña(password){
    return {
        length: password.length >= 8,
        mayuscula: /[A-Z]/.test(password),
        minuscula: /[a-z]/.test(password),
        numero: /[0-9]/.test(password),
        especial: /[^A-Za-z0-9]/.test(password)
    }
}


export function contraseñaEsValida(password){
    return Object.values(evaluarReglasContraseña(password)).every(Boolean)}


export function emailEsValido(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}