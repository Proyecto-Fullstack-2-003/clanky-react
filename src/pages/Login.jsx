import {useState} from "react";
import LoginCliente from "../components/LoginCliente";

function Login({onLogin}) {
  const[pestaña, setPestaña]= useState('cliente')

  return (
    <section className="container">
      <div
        className="card shadow mx-auto text-dark"
        style={{maxWidth: '480px'}}
      >
        <div className="card-body p-4">
          <div className="tex-center mb-4">
            <i
              className="bi bi-person-circle fs-1"
              style={{color: 'var(--clanky-rojo)'}}
            ></i>
            <h2 className= "h3 mt-2 mb-2">Bienvenido a Clanky</h2>
        </div>
          
          <div className="nav nav-pills nav-fill-login-tabs mb-4">
            <button
              type="button"
              className={'nav-link '+pestaña ==='cliente'?'active':''} 
              onClick={() => setPestaña('cliente')}> 

            <i className="bi bi-person-fill me-1"></i> Cliente    
            </button>

            <button
              type="button"
              className={'nav-link '+pestaña ==='admin'?'active':''} 
              onClick={() => setPestaña('admin')}>
              <i className="bi bi-shield-lock-fill me-1"></i> Administrador 
            
            
            </button>
          </div>
          {pestaña=== 'cliente'&& <LoginCliente onLogin={onLogin}/>}
          {pestaña=== 'admin'&& <p>Aqui ira el login de administrador</p>}
        </div>
      </div>
    </section>


  )


}
export default Login

