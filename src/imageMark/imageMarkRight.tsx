'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import ImageManager from '../common/ImageManager';
import MarkerItem from './markerItem';
import { Button } from '@nextui-org/button';
import Marker from '../common/Marker';

export default function ImageMarkRight({
  imageManager,
  setStage,
  prevStage,
  nextStage,
}: {
  imageManager: ImageManager | null;
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
  nextStage: string;
}) {
  //// Markers 조작
  const [markers, setMarkers] = useState<Marker[]>([]);

  useEffect(() => {
    const updateMarkers = () => {
      setMarkers(imageManager?.getMarkers() ?? []);
    };
    // 초기 설정
    updateMarkers();
    // imageManager가 존재하면 이벤트 리스너 등록
    imageManager?.on('markersChange', updateMarkers);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager?.off('markersChange', updateMarkers);
    };
  }, [imageManager]);

  const addMarker = () => {
    imageManager?.addMarker();
  };
  const deleteMarker = (id: string) => {
    imageManager?.deleteMarker(id);
  };
  //// end of Markers 조작

  //// ActiveMarker 조작
  const [ActiveMarker, setActiveMarker] = useState<Marker | null>(null);

  useEffect(() => {
    const updateActiveMarker = () => {
      setActiveMarker(imageManager?.getActiveMarker() ?? null);
    };
    // 초기 설정
    updateActiveMarker();
    // imageManager가 존재하면 이벤트 리스너 등록
    imageManager?.on('activeMarkerChange', updateActiveMarker);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager?.off('activeMarkerChange', updateActiveMarker);
    };
  }, [imageManager]);

  const doSetActiveMarker = (marker: Marker | null) => {
    imageManager?.setActiveMarker(marker);
  };
  //// end of ActiveMarker 조작

  return (
    <CommonRightComponent
      stage="mark"
      setStage={setStage}
      prevStage={prevStage}
      nextStage={nextStage}
      disablePrevButton={false}
      disableNextButton={false}
    >
      <div className="flex flex-col" style={{ gap: '20px' }}>
        <Button size={'sm'} style={{ width: '100px' }} onClick={addMarker}>
          마커 추가
        </Button>
        <ScrollShadow
          className="flex flex-col"
          style={{ gap: '34px', height: '550px' }}
        >
          {markers.map((marker) => (
            <MarkerItem
              key={marker.id}
              marker={marker}
              isActive={ActiveMarker?.id == marker.id}
              setActiveMarker={doSetActiveMarker}
              deleteMarker={deleteMarker}
            />
          ))}
        </ScrollShadow>
      </div>
    </CommonRightComponent>
  );
}
