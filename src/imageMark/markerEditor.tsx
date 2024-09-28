'use client';

import { useState, useEffect, useMemo } from 'react';
import Marker from '../common/Marker';
import { Button } from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';
import FormItem from '../common/form/FormItem';
import { Pointer } from '../common/form/PointerBox';

export default function MarkerEditor({
  marker,
  saveMarker,
}: {
  marker: Marker | null;
  saveMarker: () => void;
}) {
  //// marker style 관련
  const commonStyle = {
    backgroundColor: '#525252',
    borderRadius: '0 0 20px 20px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: 'height 0.5s ease, padding 0.5s ease',
    gap: '20px',
  };
  const showMarker = {
    ...commonStyle,
    height: '200px',
    padding: '12px',
  };
  const hideMarker = {
    ...commonStyle,
    height: '0px',
    padding: '0px',
  };
  //// end of marker style 관련

  //// marker value 변경 관련
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [category, setCategory] = useState('ceiling');
  const [pointer, setPointer] = useState<Pointer>(null);
  const hasChanges = useMemo(() => {
    if (marker == null) return false;
    else
      return (
        marker.name != name ||
        marker.color != color ||
        marker.category != category
      );
  }, [name, color, category, marker]);

  useEffect(() => {
    if (marker) {
      marker.setHasChanges(hasChanges);
    }
  }, [hasChanges]);

  useEffect(() => {
    if (marker) {
      const updateActivePointer = () => {
        setPointer(marker.getActivePointer() ?? null);
      };
      // 초기 설정
      updateActivePointer();
      setInitialState(marker);
      // marker가 존재하면 이벤트 리스너 등록
      marker.on('activePointerChange', updateActivePointer);
      // 컴포넌트 언마운트 시 이벤트 리스너 해제
      return () => {
        marker.off('activePointerChange', updateActivePointer);
      };
    }
  }, [marker]);

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onColorChange = (color: string) => {
    setColor(color);
  };

  const onCategoryChange = (category: string) => {
    setCategory(category);
  };

  const onPointerChange = (pointer: Pointer) => {
    setPointer(pointer);
  };

  const onRevertButtonClick = () => {
    if (marker) {
      setInitialState(marker);
    } else {
      ErrUtil.assert(false);
    }
  };

  const onSaveButtonClick = () => {
    if (marker) {
      marker.setName(name);
      marker.setColor(color);
      marker.setCategory(category);
      saveMarker();
    } else {
      ErrUtil.assert(false);
    }
  };

  const setInitialState = (marker: Marker) => {
    setName(marker.name);
    setColor(marker.color);
    setCategory(marker.category);
    setPointer(null);
  };
  //// end of marker value 변경 관련

  return (
    <section className="flex flex-col" style={marker ? showMarker : hideMarker}>
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
          value={name}
          onValueChange={onNameChange}
        />
        <FormItem
          width="60px"
          label="색상"
          labelPosition="top"
          type="colorBox"
          value={color}
          onValueChange={onColorChange}
        />
        <FormItem
          width="180px"
          label="종류"
          labelPosition="top"
          type="radioGroup"
          value={category}
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
          value={pointer}
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
          isDisabled={!hasChanges}
          onClick={onRevertButtonClick}
        >
          되돌리기
        </Button>
        <Button
          size={'sm'}
          style={{ width: '100px' }}
          isDisabled={!hasChanges}
          onClick={onSaveButtonClick}
        >
          저장
        </Button>
      </div>
    </section>
  );
}
