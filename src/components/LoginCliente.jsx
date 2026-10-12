import { useState } from "react";
import { evaluarReglasContraseña } from "../utils/validacionesLogin.js";

const listaReglas = [
    { clave: 'length', texto: "Minimo 8 caracteres" },
    { clave: 'mayuscula', texto: "Al menos una mayúscula" },
    { clave: 'minuscula', texto: "Al menos una minúscula" },
    { clave: 'numero', texto: "Al menos un número" },
    { clave: 'especial', texto: "Al menos un carácter especial" }
]
function LoginCliente() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const reglas = evaluarReglasContraseña(password)

    function manejarEnvio(evento) {
        evento.preventDefault()
        console.log('Enviado: ', email)
    }

    return (
        <form onSubmit={manejarEnvio} noValidate>
            <div className="mb-3">
                <label htmlFor="cliente-email" className="form-label fw-semibold">Correo electrónico</label>
                <input
                    id="cliente-email"
                    type="email"
                    className="form-control"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="cliente-password" className="form-label fw-semibold">Contraseña</label>
                <input
                    id="cliente-password"
                    type="password"
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                />
            </div>

            <ul className="list-unstyled small mb-3">
                {listaReglas.map((regla) => (
                    <li
                        key={regla.clave}
                        className={reglas[regla.clave] ? 'text-success' : 'text-muted'}
                    >
                        <i
                            className={`bi ${reglas[regla.clave] ? 'bi-check-circle-fill' : 'bi-circle'
                                } me-2`}
                        ></i>
                        {regla.texto}
                    </li>
                ))}
            </ul>
            <button type="submit" className="btn btn-clanky w-100 py-2">
                Iniciar sesión
            </button>

        </form>
    )
}

export default LoginCliente