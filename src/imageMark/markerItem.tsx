'use client';

import { useState, useEffect, useRef } from 'react';
import Marker from '../common/Marker';
import { Button } from '@nextui-org/button';

export default function MarkerItem({
  marker,
  isActive,
  setActiveMarker,
}: {
  marker: Marker;
  isActive: boolean;
  setActiveMarker: (marker: Marker | null) => void;
}) {
  const onButtonClick = () => {
    if (isActive) {
      setActiveMarker(null);
    } else {
      setActiveMarker(marker);
    }
  };

  return (
    <div className="flex flex-row">
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
