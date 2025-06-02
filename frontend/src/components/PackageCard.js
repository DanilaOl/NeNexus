import { useState } from 'react';
import PackageModal from './PackageModal';

export default function PackageCard({ pkg }) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className="border rounded p-2 shadow-sm bg-light package-tile"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
          <h5 className="mb-1">{pkg.name}</h5>
          <p>Скачиваний:  {pkg.downloads_count}</p>
        </div>
        <p className="mb-0 text-muted">{pkg.description}</p>
      </div>

      {showModal && (
        <PackageModal
          show={showModal}
          onClose={() => setShowModal(false)}
          packageId={pkg.id}
        />
      )}
    </>
  );
}
