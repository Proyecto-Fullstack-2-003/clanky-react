export default function Header() {
    return (
        <header>
            <nav className="navbar-clanky">
                <div className="navbar-contenido">

                    <a href="#/" className="navbar-logo">
                        <img
                            src="https://i.pinimg.com/736x/67/62/03/676203cc2d70b1ea218810abf0da6600.jpg"
                            alt="Logo de Clanky"
                        />
                        <span>Clanky</span>
                    </a>

                    <div className="navbar-links">
                        <a href="#/">Inicio</a>
                        <a href="#/vinilos">Vinilos</a>
                        <a href="#/cds">CDs</a>
                        <a href="#/merch">Merch</a>
                        <a href="#/catalogo">Catálogo</a>
                        <a href="#/contacto">Contacto</a>
                    </div>

                    <div className="navbar-icons">
                        <a href="#/carrito" aria-label="Carrito">
                            🛒
                            <span className="cart-count">0</span>
                        </a>

                        <a href="#/login" aria-label="Iniciar sesión">
                            👤
                        </a>
                    </div>

                </div>
            </nav>
        </header>
    );
}