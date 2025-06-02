import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageCard from '../../components/PackageCard';
import API_BASE_URL from '../../config/api';

export default function HomePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 8;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchPackages = async (query = '', offsetValue = 0) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/packages/?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offsetValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      if (!res.ok) throw new Error('Ошибка при загрузке пакетов');

      const data = await res.json();
      setPackages(data.results || []);
      setCount(data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(search, offset);
  }, [search, offset]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setOffset(0);
  };

  const handlePrev = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  const handleNext = () => {
    if (offset + limit < count) {
      setOffset(offset + limit);
    }
  };

  return (
    <div className="d-flex flex-column container mt-4" style={{ height: '85vh' }}>
      <h1 className="mb-4">Пакеты</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Поиск по названию..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex-grow-1 height-auto">
        {loading ? (
          <div className="text-center">Загрузка...</div>
        ) : packages.length > 0 ? (
          <div className="d-flex flex-column gap-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center w-100">Ничего не найдено.</div>
        )}
      </div>

      {packages.length > 10 ? (
        <div className="mt-auto pt-4 border-top d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={offset === 0}
          >
            Назад
          </button>
          <span>
            Страница {Math.floor(offset / limit) + 1} из{' '}
            {Math.ceil(count / limit)}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
            disabled={offset + limit >= count}
          >
            Вперёд
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
