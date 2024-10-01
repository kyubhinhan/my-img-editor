'use client';

import { useState, useEffect, useMemo } from 'react';
import Marker from '../common/Marker';
import { Button } from '@nextui-org/react';
import FormItem from '../common/form/FormItem';
import ErrUtil from '../common/ErrUtil';
import { Pointer } from '../common/Marker';

export default function MarkerEditor({
  marker,
  saveMarker,
  editPointer,
}: {
  marker: Marker;
  saveMarker: () => void;
  editPointer: () => void;
}) {
  //// marker value 변경 관련
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [category, setCategory] = useState('ceiling');
  const [pointer, setPointer] = useState<Pointer | null>(null);

  const hasChanges = useMemo(() => {
    return (
      marker.name != name ||
      marker.color.toLowerCase() != color.toLowerCase() ||
      marker.category != category
    );
  }, [name, color, category]);
  useEffect(() => {
    marker.setHasChanges(hasChanges);
  }, [hasChanges]);

  useEffect(() => {
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

  const onPointerChange = (editedPointer: Pointer | null) => {
    if (pointer) {
      if (editedPointer == null) {
        // 포인터를 삭제한 경우
        marker.deletePointer(pointer.id);
      }
      setPointer(editedPointer);
      editPointer();
    } else {
      // 포인터가 있어야 함
      ErrUtil.assert(false);
    }
  };

  const onRevertButtonClick = () => {
    setInitialState(marker);
  };

  const onSaveButtonClick = () => {
    marker.setName(name);
    marker.setColor(color);
    marker.setCategory(category);
    saveMarker();
  };

  const setInitialState = (marker: Marker) => {
    setName(marker.name);
    setColor(marker.color);
    setCategory(marker.category);
    setPointer(null);
  };
  //// end of marker value 변경 관련

  return (
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
