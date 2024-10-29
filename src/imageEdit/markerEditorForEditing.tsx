'use client';

import { Marker } from '../common/MarkerUtil';

import { Dispatch, SetStateAction } from 'react';
import { Button } from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';

type PropsType = {
  currentMarkerState: [
    activeMarker: Marker | null,
    setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  ];
  activeMarkerHasChanges: boolean;
  onSaveButtonClicked: () => void;
  onRevertButtonClicked: () => void;
};

export default function MarkerEditorForEditing({
  currentMarkerState,
  activeMarkerHasChanges,
  onSaveButtonClicked,
  onRevertButtonClicked,
}: PropsType) {
  const [activeMarker, setActiveMarker] = currentMarkerState;

  //// activeMarker value 변경 관련
  const onEditColorChange = (editColor: null | string) => {
    if (activeMarker == null) {
      ErrUtil.assert(false, 'activeMarker가 없습니다.');
    } else {
      setActiveMarker({ ...activeMarker, editColor });
    }
  };
  //// end of activeMarker value 변경 관련

  //// 스타일 관련
  const commonStyle = {
    backgroundColor: '#525252',
    borderRadius: '0 0 20px 20px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: 'height 0.5s ease, padding 0.5s ease',
  };
  const showMarkerEditor = {
    ...commonStyle,
    height: '200px',
    padding: '12px',
  };
  const hideMarkerEditor = {
    ...commonStyle,
    height: '0px',
    padding: '0px',
  };
  //// end of 스타일 관련

  return (
    <section style={{ height: '250px', width: '800px' }}>
      <section style={activeMarker ? showMarkerEditor : hideMarkerEditor}>
        {activeMarker && (
          <section className="flex flex-col gap-6">
            <h3
              style={{
                fontWeight: 600,
                fontSize: '1.2rem',
                lineHeight: '1.5rem',
              }}
            >
              마커 에디터
            </h3>
            <section className="flex flex-row gap-5">
              <div>이름: {activeMarker.name} </div>
              <div>종류: {activeMarker.category} </div>
            </section>
            <div className="flex flex-row justify-end" style={{ gap: '10px' }}>
              <Button
                size={'sm'}
                style={{ width: '100px' }}
                isDisabled={!activeMarkerHasChanges}
                onClick={onRevertButtonClicked}
              >
                되돌리기
              </Button>
              <Button
                size={'sm'}
                style={{ width: '100px' }}
                isDisabled={!activeMarkerHasChanges}
                onClick={onSaveButtonClicked}
              >
                저장
              </Button>
            </div>
          </section>
        )}
      </section>
    </section>
  );
}
