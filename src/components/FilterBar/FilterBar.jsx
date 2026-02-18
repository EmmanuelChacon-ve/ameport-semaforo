import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { useTasks } from '../../context/TaskContext';
import { STATUS, STATUS_CONFIG } from '../../utils/semaforoUtils';
import './FilterBar.css';

export default function FilterBar() {
    const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, clearFilters } = useTasks();
    const hasFilters = activeFilter || searchQuery.trim();

    return (
        <div className="filter-bar">
            <div className="filter-bar__search">
                <FiSearch className="filter-bar__search-icon" />
                <input
                    type="text"
                    className="filter-bar__input"
                    placeholder="Buscar por actividad o responsable..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="filter-bar__clear-input"
                        onClick={() => setSearchQuery('')}
                        aria-label="Limpiar búsqueda"
                    >
                        <FiX />
                    </button>
                )}
            </div>

            <div className="filter-bar__filters">
                <FiFilter className="filter-bar__filter-icon" />
                <div className="filter-bar__buttons">
                    {Object.values(STATUS).map((status) => {
                        const config = STATUS_CONFIG[status];
                        return (
                            <button
                                key={status}
                                className={`filter-bar__btn ${activeFilter === status ? 'filter-bar__btn--active' : ''}`}
                                onClick={() => setActiveFilter(activeFilter === status ? null : status)}
                                style={{
                                    '--btn-color': config.color,
                                    '--btn-bg': config.bgLight,
                                }}
                            >
                                <span className="filter-bar__btn-dot" />
                                <span>{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {hasFilters && (
                <button className="filter-bar__clear-all" onClick={clearFilters}>
                    <FiX />
                    <span>Limpiar filtros</span>
                </button>
            )}
        </div>
    );
}
