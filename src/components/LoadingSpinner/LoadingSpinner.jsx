import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', message = 'Cargando...' }) {
    return (
        <div className={`loading-spinner loading-spinner--${size}`}>
            <div className="loading-spinner__circles">
                <span className="loading-spinner__dot loading-spinner__dot--red" />
                <span className="loading-spinner__dot loading-spinner__dot--yellow" />
                <span className="loading-spinner__dot loading-spinner__dot--green" />
            </div>
            {message && <p className="loading-spinner__text">{message}</p>}
        </div>
    );
}
