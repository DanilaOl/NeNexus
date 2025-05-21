import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import API_BASE_URL from '../config/api';

export default function PackageModal({ show, onClose, pkg }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!show) return;

    const fetchVersions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/packages/${pkg.id}/versions/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Ошибка загрузки версий');

        const data = await res.json();
        console.log('Versions:', data);
        setVersions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [pkg.id, show]);

  const handleDownload = async (versionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/versions/${versionId}/download/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Ошибка при скачивании');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const disposition = res.headers.get('Content-Disposition');
      const match = disposition && disposition.match(/filename="(.+)"/);
      a.download = match ? match[1] : `version_${versionId}.zip`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка при скачивании версии:', err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{pkg.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{pkg.description}</p>
        <h5>Версии:</h5>
        {loading ? (
          <div>Загрузка...</div>
        ) : versions.length === 0 ? (
          <p>Нет доступных версий.</p>
        ) : (
          <ul className="list-group">
            {versions.map((version) => (
              <li key={version.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{version.name || `Версия ${version.version}`}</span>
                <span>{version.description}</span>
                <Button variant="success" onClick={() => handleDownload(version.id)}>
                  Скачать
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
