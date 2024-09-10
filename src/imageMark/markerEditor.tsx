'use client';

import { useState, useEffect, useRef } from 'react';
import Marker from '../common/Marker';
import { Input } from '@nextui-org/react';

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
  useEffect(() => {
    if (marker) {
      setName(marker.name);
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
      <div style={{ width: '200px' }}>
        <Input
          isRequired
          size="sm"
          label={'이름'}
          isInvalid={nameInvalid}
          errorMessage="이름을 입력해주세요"
          value={name}
          onValueChange={onNameChange}
        />
      </div>
    </section>
  );
}
