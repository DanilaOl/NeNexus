import { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import API_BASE_URL from '../config/api';
import { DependencyTree } from './DependencyTree';

export default function PackageModal({ show, onClose, packageId: initialPackageId }) {
  const [packageId, setPackageId] = useState(initialPackageId);
  const [pkg, setPkg] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loadingPkg, setLoadingPkg] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    if (initialPackageId !== packageId) {
      setPackageId(initialPackageId);
    }
  }, [initialPackageId]);

  useEffect(() => {
    if (!show || !packageId) return;

    const fetchPackage = async () => {
      setLoadingPkg(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/packages/${packageId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Ошибка загрузки пакета');
        const data = await res.json();
        setPkg(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPkg(false);
      }
    };

    const fetchVersions = async () => {
      setLoadingVersions(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/packages/${packageId}/versions/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Ошибка загрузки версий');
        const data = await res.json();
        setVersions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingVersions(false);
      }
    };

    fetchPackage();
    fetchVersions();
  }, [show, packageId]);

  const handleDownload = async (versionId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/packages/${packageId}/versions/${versionId}/download/`, {
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
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      {loadingPkg ? (
        <div className="d-flex justify-content-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Modal.Header closeButton>
            <div>
              <Modal.Title>{pkg?.name || 'Пакет'}</Modal.Title>
              {pkg?.author && (
                <p className="text-muted m-0">{pkg.author}</p>
              )}
            </div>
          </Modal.Header>
          <Modal.Body>
            <p>{pkg?.description}</p>

            <h5>Версии</h5>
            {loadingVersions ? (
              <Spinner animation="border" />
            ) : versions.length === 0 ? (
              <p>Нет доступных версий.</p>
            ) : (
              <ul className="list-group">
                {versions.map((version) => (
                  <li
                    key={version.id}
                    className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {version.name || `Версия ${version.version}`}
                    </span>
                    <Button
                      variant="success"
                      onClick={() => handleDownload(version.id)}>
                      Скачать
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <h5 className="mt-4">Зависимости</h5>
            {loadingPkg ? (
              <Spinner animation="border" />
            ) : pkg?.dependencies && pkg.dependencies.length > 0 ? (
              <DependencyTree deps={pkg.dependencies} onSelectPackage={setPackageId} />
            ) : (
              <p>Нет зависимостей.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
              Закрыть
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}