import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found page-enter">
            <div className="not-found__card">
                <div className="not-found__icon-wrap">
                    <FiAlertTriangle />
                </div>
                <h1 className="not-found__code">404</h1>
                <h2 className="not-found__title">Página no encontrada</h2>
                <p className="not-found__text">
                    La página que buscas no existe o fue movida.
                </p>
                <Link to="/" className="not-found__btn">
                    <FiHome />
                    <span>Volver al Dashboard</span>
                </Link>
            </div>
        </div>
    );
}
