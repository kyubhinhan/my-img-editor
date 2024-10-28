'use client';

import { Marker } from '../common/MarkerUtil';
import { ButtonProps } from '@/src/common/SimplePopup';

import { Dispatch, SetStateAction } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import { ScrollShadow } from '@nextui-org/react';

import MarkerItem from '../imageMark/markerItem';

type PropsType = {
  markersState: [
    markers: Marker[],
    setMarkers: Dispatch<SetStateAction<Marker[]>>,
  ];
  activeMarkerState: [
    activeMarker: Marker | null,
    setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  ];
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

export default function ImageEditRight({
  markersState,
  activeMarkerState,
  hasChanges,
  showSimplePopup,
  setStage,
  prevStage,
  nextStage,
}: PropsType) {
  const [markers] = markersState;
  const [activeMarker, setActiveMarker] = activeMarkerState;

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

  return (
    <CommonRightComponent
      stage="edit"
      setStage={setStage}
      prevStage={prevStage}
      nextStage={nextStage}
      disablePrevButton={false}
      disableNextButton={hasChanges}
    >
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
            deleteMarker={null}
          />
        ))}
      </ScrollShadow>
    </CommonRightComponent>
  );
}
