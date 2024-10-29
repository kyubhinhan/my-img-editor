'use client';

import { Marker } from '../common/MarkerUtil';

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react';

import MarkerEditorForEditing from './markerEditorForEditing';
import ErrUtil from '../common/ErrUtil';
import ImageUtil from '../common/ImageUtil';

type PropsType = {
  image: HTMLImageElement;
  markersState: [
    markers: Marker[],
    setMarkers: Dispatch<SetStateAction<Marker[]>>,
  ];
  activeMarkerState: [
    activeMarker: Marker | null,
    setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  ];
  setActiveMarkerHasChanges: Dispatch<SetStateAction<boolean>>;
};

export default function ImageEditLeft({
  image,
  markersState,
  activeMarkerState,
  setActiveMarkerHasChanges,
}: PropsType) {
  const [markers, setMarkers] = markersState;
  const [activeMarker, setActiveMarker] = activeMarkerState;
  const [currentActiveMarker, setCurrentActiveMarker] = useState<Marker | null>(
    activeMarker
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setCurrentActiveMarker(activeMarker);
  }, [activeMarker]);

  // activeMarker가 갱신되었는지 여부를 판단해줌
  const activeMarkerHasChanges = useMemo(() => {
    if (activeMarker == null || currentActiveMarker == null) return false;
    else {
      return activeMarker.editColor != currentActiveMarker.editColor;
    }
  }, [activeMarker, currentActiveMarker]);

  useEffect(() => {
    setActiveMarkerHasChanges(activeMarkerHasChanges);
  }, [activeMarkerHasChanges]);

  // image를 그려줌
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    else {
      ImageUtil.drawMarkersInEdit(canvas, image, markers, activeMarker);
    }
  }, [canvasRef, markers, activeMarker, currentActiveMarker]);

  const onSaveButtonClicked = () => {
    if (currentActiveMarker == null) {
      ErrUtil.assert(false);
    } else {
      setActiveMarker(currentActiveMarker);
      setMarkers(
        markers.map((marker) => {
          if (marker.id == currentActiveMarker.id) return currentActiveMarker;
          else return marker;
        })
      );
    }
  };
  const onRevertButtonClicked = () => {
    setCurrentActiveMarker(activeMarker);
  };

  return (
    <section className="h-full flex flex-col items-center">
      <MarkerEditorForEditing
        currentMarkerState={[currentActiveMarker, setCurrentActiveMarker]}
        activeMarkerHasChanges={activeMarkerHasChanges}
        onSaveButtonClicked={onSaveButtonClicked}
        onRevertButtonClicked={onRevertButtonClicked}
      />
      <canvas ref={canvasRef} width={800} height={500}></canvas>
    </section>
  );
}
