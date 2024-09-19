'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import ImageManager from '../common/ImageManager';
import MarkerItem from './markerItem';
import Marker from '../common/Marker';
import { Button, ScrollShadow } from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';
import SimplePopup from '../common/SimplePopup';

export default function ImageMarkRight({
  imageManager,
  setStage,
  prevStage,
  nextStage,
}: {
  imageManager: ImageManager;
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
  nextStage: string;
}) {
  //// Markers 조작
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMarkerId, setDeleteMarkerId] = useState<string | null>(null);

  const addMarker = () => {
    const newMarkerId = imageManager.addMarker();
    imageManager.setActiveMarker(newMarkerId);
  };

  const openDeleteMarkerModal = (id: string) => {
    setDeleteMarkerId(id);
    setIsOpen(true);
  };

  const deletePopupButtons = [
    {
      id: 'delete',
      text: '삭제',
      color: 'danger' as 'danger',
      onClick: () => {
        if (deleteMarkerId) {
          imageManager.deleteMarker(deleteMarkerId);
        } else {
          ErrUtil.assert(false);
        }
      },
    },
    {
      id: 'close',
      text: '닫기',
    },
  ];

  useEffect(() => {
    const updateMarkers = () => {
      setMarkers(imageManager.getMarkers());
    };
    // 초기 설정
    updateMarkers();
    imageManager.on('markersChange', updateMarkers);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager.off('markersChange', updateMarkers);
    };
  }, [imageManager]);
  //// end of Markers 조작

  //// ActiveMarker 조작
  const [ActiveMarker, setActiveMarker] = useState<Marker | null>(null);
  useEffect(() => {
    const updateActiveMarker = () => {
      setActiveMarker(imageManager.getActiveMarker());
    };
    // 초기 설정
    updateActiveMarker();
    // imageManager가 존재하면 이벤트 리스너 등록
    imageManager.on('activeMarkerChange', updateActiveMarker);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager.off('activeMarkerChange', updateActiveMarker);
    };
  }, [imageManager]);
  const doSetActiveMarker = (marker: Marker | null) => {
    if (marker) {
      imageManager.setActiveMarker(marker.id);
    } else {
      imageManager.setActiveMarker(null);
    }
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
              deleteMarker={openDeleteMarkerModal}
            />
          ))}
        </ScrollShadow>
      </div>

      <SimplePopup
        visible={isOpen}
        updateVisible={setIsOpen}
        title="알림"
        message="정말 삭제하시겠습니까?"
        buttons={deletePopupButtons}
      />
    </CommonRightComponent>
  );
}
