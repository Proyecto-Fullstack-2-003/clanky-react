export default function Admin({ sesion }) {
    return (
        <section className="container">
            <div className="card shadow text-dark">
                <div className="card-body p-4">
                    <h2 className="h3">Panel de administracion</h2>
                    <p className="mb-0">Bienvenido, <strong>{sesion.usuario}</strong></p>
                </div>
            </div>
        </section>
    )

}

