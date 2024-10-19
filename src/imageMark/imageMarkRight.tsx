'use client';

import { Marker } from '../common/MarkerUtil';

import MarkerUtil from '../common/MarkerUtil';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import MarkerItem from './markerItem';
import { Button, ScrollShadow } from '@nextui-org/react';
import { ButtonProps } from '@/src/common/SimplePopup';

type PropsType = {
  markers: Marker[];
  setMarkers: Dispatch<SetStateAction<Marker[]>>;
  activeMarker: Marker | null;
  setActiveMarker: Dispatch<SetStateAction<Marker | null>>;
  hasChanges: boolean;
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
  markers,
  setMarkers,
  activeMarker,
  setActiveMarker,
  hasChanges,
  showSimplePopup,
  setStage,
  prevStage,
  nextStage,
}: PropsType) {
  const onAddButtonClick = () => {
    const addMarker = () => {
      const newMarker = MarkerUtil.createNewMarker(markers.length);
      setMarkers([...markers, newMarker]);
      setActiveMarker(newMarker);
    };

    if (hasChanges) {
      showSimplePopup(
        '알림',
        '변경된 사항이 있습니다. 저장하지 않고 진행하시겠습니까?',
        ['ok', 'cancel']
      ).then((id) => {
        if (id == 'ok') {
          addMarker();
        }
      });
    } else {
      addMarker();
    }
  };

  const openDeleteMarkerModal = (markerId: string) => {
    showSimplePopup('알림', '정말로 삭제하시겠습니까?', ['ok', 'cancel']).then(
      (id) => {
        if (id == 'ok') {
          if (activeMarker?.id == markerId) {
            setActiveMarker(null);
          }
          setMarkers(markers.filter((marker) => marker.id != markerId));
        }
      }
    );
  };

  const onSetActiveMarker = (marker: Marker | null) => {
    if (hasChanges) {
      showSimplePopup(
        '알림',
        '변경된 사항이 있습니다. 저장하지 않고 진행하시겠습니까?',
        ['ok', 'cancel']
      ).then((id) => {
        if (id == 'ok') {
          setActiveMarker(marker);
        }
      });
    } else {
      setActiveMarker(marker);
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
              isActive={activeMarker?.id == marker.id}
              setActiveMarker={onSetActiveMarker}
              deleteMarker={openDeleteMarkerModal}
            />
          ))}
        </ScrollShadow>
      </div>
    </CommonRightComponent>
  );
}
