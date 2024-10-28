'use client';

import { Marker } from '../common/MarkerUtil';

import { Button } from '@nextui-org/button';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function MarkerItem({
  marker,
  isActive,
  setActiveMarker,
  deleteMarker,
}: {
  marker: Marker;
  isActive: boolean;
  setActiveMarker: (marker: Marker | null) => void;
  deleteMarker: null | ((id: string) => void);
}) {
  const onButtonClick = () => {
    if (isActive) {
      setActiveMarker(null);
    } else {
      setActiveMarker(marker);
    }
  };

  const deleteButtonClick = () => {
    if (deleteMarker != null) {
      deleteMarker(marker.id);
    }
  };

  return (
    <div className="flex flex-row" style={{ gap: '25px' }}>
      {deleteMarker && (
        <Button isIconOnly color={'danger'} onClick={deleteButtonClick}>
          <RiDeleteBin6Line />
        </Button>
      )}

      <Button
        variant={isActive ? 'solid' : 'flat'}
        fullWidth
        onClick={onButtonClick}
      >
        {marker.name}
      </Button>
    </div>
  );
}
