'use client';

import { useState, useEffect, useRef } from 'react';
import ImageManager from '../common/ImageManager';
import Marker from '../common/Marker';
import MarkerEditor from './markerEditor';
import { Pointer } from '../common/Marker';

export default function ImageMarkLeft({
  imageManager,
}: {
  imageManager: ImageManager;
}) {
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

  //// 마우스 커서 관련
  const [cursor, setCursor] = useState<'default' | 'grab' | 'grabbing'>(
    'default'
  );
  //// end of 마우스 커서 관련

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  useEffect(() => {
    const updateActiveMarker = (activeMarker: Marker | null) => {
      if (activeMarker == null && canvasRef.current != null) {
        imageManager.drawMarker(canvasRef.current);
      }
      setActiveMarker(activeMarker);
    };
    // 초기 설정
    updateActiveMarker(imageManager.getActiveMarker());
    // activeMarker에 이벤트 리스너 등록
    imageManager.on('activeMarkerChange', updateActiveMarker);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager.off('activeMarkerChange', updateActiveMarker);
    };
  }, [imageManager]);

  const saveMarker = () => {
    imageManager.emitChangeMarker();
  };

  const drawPointers = (
    canvas: HTMLCanvasElement,
    pointers: Pointer[],
    color: string,
    activePointer: Pointer | null
  ) => {
    imageManager.drawImage(canvas);
    // activeMarker의 pointer들을 그려줌
    imageManager.drawPointers(canvas, pointers, activePointer, color);

    // activeMarker를 제외한 다른 마커들의 pointer들을 그려줌
    // 이때 다른 마커들의 포인터의 색은 회색으로 통일
    imageManager.getMarkers().forEach((marker) => {
      if (marker.id == activeMarker?.id) {
        // do nothing
      } else {
        imageManager.drawPointers(canvas, marker.pointers, null, 'grey');
      }
    });
  };

  return (
    <section className="h-full flex flex-col items-center">
      <section style={{ height: '250px', width: '800px' }}>
        <section style={activeMarker ? showMarkerEditor : hideMarkerEditor}>
          {activeMarker && canvasRef.current && (
            <MarkerEditor
              canvas={canvasRef.current}
              marker={activeMarker}
              saveMarker={saveMarker}
              drawPointers={drawPointers}
              setCursor={setCursor}
            />
          )}
        </section>
      </section>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ cursor }}
      ></canvas>
    </section>
  );
}
