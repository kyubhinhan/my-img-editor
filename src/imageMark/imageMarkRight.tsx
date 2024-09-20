'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import ImageManager from '../common/ImageManager';
import MarkerItem from './markerItem';
import Marker from '../common/Marker';
import { Button, ScrollShadow } from '@nextui-org/react';
import { ButtonProps } from '@/src/common/SimplePopup';

type PropsType = {
  imageManager: ImageManager;
  showSimplePopup: (
    title: string,
    message: string,
    buttons: ButtonProps[]
  ) => Promise<unknown>;
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
  nextStage: string;
};

export default function ImageMarkRight({
  imageManager,
  showSimplePopup,
  setStage,
  prevStage,
  nextStage,
}: PropsType) {
  //// Markers 조작
  const [markers, setMarkers] = useState<Marker[]>([]);

  const onAddButtonClick = () => {
    const addMarker = () => {
      const newMarkerId = imageManager.addMarker();
      imageManager.setActiveMarker(newMarkerId);
    };

    const activeMarker = imageManager.getActiveMarker();
    if (activeMarker == null || activeMarker.hasChanges == false) {
      addMarker();
    } else {
      showSimplePopup(
        '알림',
        '변경된 사항이 있습니다. 저장하지 않고 진행하시겠습니까?',
        ['ok', 'cancel']
      ).then((id) => {
        if (id == 'ok') {
          addMarker();
        }
      });
    }
  };

  const openDeleteMarkerModal = (markerId: string) => {
    showSimplePopup('알림', '정말로 삭제하시겠습니까?', ['ok', 'cancel']).then(
      (id) => {
        if (id == 'ok') {
          imageManager.deleteMarker(markerId);
        }
      }
    );
  };

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

  const onSetActiveMarker = (marker: Marker | null) => {
    const doSetActiveMarker = (marker: Marker | null) => {
      if (marker) {
        imageManager.setActiveMarker(marker.id);
      } else {
        imageManager.setActiveMarker(null);
      }
    };

    const activeMarker = imageManager.getActiveMarker();
    if (activeMarker == null || activeMarker.hasChanges == false) {
      doSetActiveMarker(marker);
    } else {
      showSimplePopup(
        '알림',
        '변경된 사항이 있습니다. 저장하지 않고 진행하시겠습니까?',
        ['ok', 'cancel']
      ).then((id) => {
        if (id == 'ok') {
          doSetActiveMarker(marker);
        }
      });
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
        <Button
          size={'sm'}
          style={{ width: '100px' }}
          onClick={onAddButtonClick}
        >
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
              setActiveMarker={onSetActiveMarker}
              deleteMarker={openDeleteMarkerModal}
            />
          ))}
        </ScrollShadow>
      </div>
    </CommonRightComponent>
  );
}
