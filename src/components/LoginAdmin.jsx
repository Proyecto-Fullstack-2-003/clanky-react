import {useState} from 'react'

const ADMIN_USUARIO='admin'
const ADMIN_PASSWORD='1234'


function LoginAdmin({onLogin}){
    const[usuario, setUsuario]= useState('')
    const[password, setPassword]= useState('')
    const[mensaje,setMensaje]=useState(null)

    function manejarEnvio(evento){
        evento.preventDefault()

        if(usuario.trim()=== ADMIN_USUARIO&&password===ADMIN_PASSWORD){
            setMensaje({tipo: 'success', texto: 'Inicio de sesion exitoso'})

            setTimeout(()=>{
                onLogin({tipo: 'admin', usuario: usuario.trim()})
                window.location.hash='#/admin'
            }, 1000)
        }else{
            setMensaje({tipo:'danger',texto:'Usuario o contraseña incorrectos'})    
        }

    }



return (
    <form onSubmit={manejarEnvio} noValidate>
        <div className="alert alert-warning small py-2">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Acesso restringido solo para personal autorizado de clanky
        </div>

        <div className="mb-3">
            <label htmlFor="admin-usuario" className="form-label fw-semibold">Usuario</label>
            <input
                id="admin-usuario"
                type="text"
                className="form-control"
                value={usuario}
                onChange={(evento)=> setUsuario(evento.target.value)}
            />
        </div>

        <div className="mb-3">
            <label htmlFor="admin-password" className="form-label fw-semibold">Contraseña</label>
            <input
                id="admin-password"
                type="password"
                className="form-control"
                value={password}
                onChange={(evento)=> setPassword(evento.target.value)}/>
        </div>

        {mensaje &&(
            <div className={`alert alert-${mensaje.tipo} py-2 small`}>
                {mensaje.texto}
            </div>    
        )}

        <button type="submit" className="btn btn-dark w-100 fw-bold py-2">
            <i className= "bi bi-shield-lock-fill me-1"></i>
            Iniciar sesión como Admin
        </button>
        </form>
    )
}

export default LoginAdmin
