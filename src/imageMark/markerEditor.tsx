'use client';

import { useState, useEffect, useRef } from 'react';
import Marker from '../common/Marker';
import { Input, RadioGroup, Radio } from '@nextui-org/react';

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
  };
  const showMarker = {
    ...commonStyle,
    height: '150px',
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
  const [size, setSize] = useState('small');
  useEffect(() => {
    if (marker) {
      setName(marker.name);
      setColor(marker.color);
      setSize(marker.size);
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

  const onSizeChange = (size: string) => {
    if (marker) {
      marker.setSize(size);
      setSize(size);
      emitMarkerChange();
    }
  };
  //// end of marker value 변경 관련

  return (
    <section style={marker ? showMarker : hideMarker}>
      <h3
        style={{
          fontWeight: 600,
          fontSize: '1.2rem',
          lineHeight: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        마커 에디터
      </h3>
      <section className="flex flex-row" style={{ gap: '30px' }}>
        <div style={{ width: '200px' }}>
          <label className="text-sm">이름</label>
          <Input
            size="sm"
            isInvalid={nameInvalid}
            errorMessage="이름을 입력해주세요"
            value={name}
            onValueChange={onNameChange}
          />
        </div>
        <div style={{ width: '100px' }}>
          <label className="text-sm">색상</label>
          <Input
            size="sm"
            type="color"
            value={color}
            onValueChange={onColorChange}
          />
        </div>
        <div className="flex flex-col " style={{ width: '300px' }}>
          <label className="text-sm">굵기</label>
          <RadioGroup
            value={size}
            onValueChange={onSizeChange}
            orientation="horizontal"
            classNames={{
              base: 'grow',
              wrapper: 'justify-items-center grow',
            }}
          >
            <Radio value="small" classNames={{ label: 'text-slate-100' }}>
              Small
            </Radio>
            <Radio value="medium" classNames={{ label: 'text-slate-100' }}>
              Medium
            </Radio>
            <Radio value="large" classNames={{ label: 'text-slate-100' }}>
              Large
            </Radio>
          </RadioGroup>
        </div>
      </section>
    </section>
  );
}
