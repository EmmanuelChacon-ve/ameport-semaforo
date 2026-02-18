import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login__bg">
                <div className="login__bg-gradient" />
                <div className="login__bg-dots" />
            </div>

            <div className="login__card">
                <div className="login__header">
                    <div className="login__logo">
                        <span className="login__logo-icon">🚦</span>
                    </div>
                    <h1 className="login__title">AMEPORT</h1>
                    <p className="login__subtitle">Panel de Gestión de Actividades</p>
                </div>

                <form className="login__form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="login__error">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="login__field">
                        <label className="login__label" htmlFor="email">
                            Email
                        </label>
                        <div className="login__input-wrapper">
                            <FiMail className="login__input-icon" />
                            <input
                                id="email"
                                type="email"
                                className="login__input"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="login__field">
                        <label className="login__label" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="login__input-wrapper">
                            <FiLock className="login__input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="login__input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="login__toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login__submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="login__submit-loader" />
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>
                </form>

                <p className="login__footer">
                    Plataforma interna AMEPORT © 2026
                </p>
            </div>
        </div>
    );
}
