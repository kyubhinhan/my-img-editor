'use client';

import { Marker, Pointer } from '../common/MarkerUtil';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import FormItem from '../common/form/FormItem';
import ErrUtil from '../common/ErrUtil';

type PropsType = {
  currentMarkerState: [
    activeMarker: Marker | null,
    setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  ];
  activePointerState: [
    activePointer: Pointer | null,
    setActivePointer: Dispatch<SetStateAction<Pointer | null>>,
  ];
  activeMarkerHasChanges: boolean;
  onSaveButtonClicked: () => void;
  onRevertButtonClicked: () => void;
};

export default function MarkerEditor({
  currentMarkerState,
  activePointerState,
  activeMarkerHasChanges,
  onSaveButtonClicked,
  onRevertButtonClicked,
}: PropsType) {
  const [activeMarker, setActiveMarker] = currentMarkerState;
  const [activePointer, setActivePointer] = activePointerState;

  //// activeMarker value 변경 관련
  const onNameChange = (name: string) => {
    if (activeMarker == null) {
      ErrUtil.assert(false, 'activeMarker가 없습니다.');
    } else {
      setActiveMarker({ ...activeMarker, name });
    }
  };

  const onColorChange = (color: string) => {
    if (activeMarker == null) {
      ErrUtil.assert(false, 'activeMarker가 없습니다.');
    } else {
      setActiveMarker({ ...activeMarker, color: color.toUpperCase() });
    }
  };

  const onCategoryChange = (category: string) => {
    if (activeMarker == null) {
      ErrUtil.assert(false, 'activeMarker가 없습니다.');
    } else {
      setActiveMarker({ ...activeMarker, category });
    }
  };

  const onPointerChange = (editedPointer: Pointer | null) => {
    if (activeMarker && activePointer) {
      if (editedPointer == null) {
        // 포인터를 삭제한 경우, 바로 이전에 추가된 포인터를 activePointer로 설정해줌
        const newPointers = activeMarker.pointers.filter(
          (pointer) => pointer.id != activePointer.id
        );
        setActiveMarker({ ...activeMarker, pointers: newPointers });
        setActivePointer(
          newPointers.length > 0 ? newPointers[newPointers.length - 1] : null
        );
      } else {
        const newPointers = activeMarker.pointers.map((pointer) => {
          if (pointer.id == editedPointer.id) return editedPointer;
          else return pointer;
        });
        setActiveMarker({ ...activeMarker, pointers: newPointers });
        setActivePointer(editedPointer);
      }
    } else {
      // 포인터가 있어야 함
      ErrUtil.assert(false);
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
              <FormItem
                width="200px"
                label="이름"
                labelPosition="top"
                type="textBox"
                value={activeMarker.name}
                onValueChange={onNameChange}
              />
              <FormItem
                width="60px"
                label="색상"
                labelPosition="top"
                type="colorBox"
                value={activeMarker.color}
                onValueChange={onColorChange}
              />
              <FormItem
                width="180px"
                label="종류"
                labelPosition="top"
                type="radioGroup"
                value={activeMarker.category}
                onValueChange={onCategoryChange}
                editorProps={{
                  items: [
                    { value: 'ceiling', text: '천장' },
                    { value: 'wall', text: '벽' },
                    { value: 'floor', text: '바닥' },
                  ],
                }}
              />
              <FormItem
                type="pointerBox"
                label="포인터"
                labelPosition="top"
                value={activePointer}
                onValueChange={onPointerChange}
                editorProps={{
                  xMax: 400,
                  yMax: 400,
                }}
              />
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
