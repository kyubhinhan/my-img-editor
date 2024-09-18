'use client';

import { useState, useEffect, useRef } from 'react';
import Marker from '../common/Marker';
import { Input, RadioGroup, Radio } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import ErrUtil from '../common/ErrUtil';
import FormItem from '../common/form/FormItem';

import { Pointer } from '../common/form/PointerBox';

export default function MarkerEditor({
  marker,
  emitMarkerChange,
}: {
  marker: Marker | null;
  emitMarkerChange: () => void;
}) {
  //// marker style 관련
  const commonStyle = {
    backgroundColor: '#525252',
    borderRadius: '0 0 20px 20px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: 'height 0.5s ease, padding 0.5s ease',
    gap: '25px',
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
  const [nameInvalid, setNameInvalid] = useState(false);
  const [color, setColor] = useState('#000000');
  const [category, setCategory] = useState('ceiling');
  const [pointer, setPointer] = useState<Pointer>({
    x: 100,
    y: 200,
  });

  useEffect(() => {
    if (marker) {
      setName(marker.name);
      setColor(marker.color);
      setCategory(marker.category);
    }
  }, [marker]);

  const onNameChange = (name: string) => {
    if (marker) {
      marker.setName(name);
      setName(name);
      emitMarkerChange();
      setNameInvalid(name == '');
    }
  };

  const onColorChange = (color: string) => {
    if (marker) {
      marker.setColor(color);
      setColor(color);
      emitMarkerChange();
    }
  };

  const onCategoryChange = (category: string) => {
    if (marker) {
      marker.setCategory(category);
      setCategory(category);
      emitMarkerChange();
    }
  };

  const onPointerChange = (pointer: Pointer) => {
    setPointer(pointer);
  };

  const onChangeSection = (type: string) => {
    if (type == 'create') {
    } else if (type == 'delete') {
    } else {
      ErrUtil.assert(false);
    }
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
      <section className="flex flex-row" style={{ gap: '20px' }}>
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
        <Button size={'sm'} style={{ width: '100px' }}>
          되돌리기
        </Button>
        <Button size={'sm'} style={{ width: '100px' }}>
          저장
        </Button>
      </div>
    </section>
  );
}
