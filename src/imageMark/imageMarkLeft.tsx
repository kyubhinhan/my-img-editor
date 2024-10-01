'use client';

import { useState, useEffect, useRef, MouseEventHandler } from 'react';
import ImageManager from '../common/ImageManager';
import Marker from '../common/Marker';
import MarkerEditor from './markerEditor';
import ErrUtil from '../common/ErrUtil';

export default function ImageMarkLeft({
  imageManager,
}: {
  imageManager: ImageManager;
}) {
  //// activeMarker 관련
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  const saveMarker = () => {
    imageManager.emitChangeMarker();
  };
  useEffect(() => {
    const updateActiveMarker = () => {
      setActiveMarker(imageManager.getActiveMarker() ?? null);
    };
    // 초기 설정
    updateActiveMarker();
    // imageManager가 존재하면 이벤트 리스너 등록
    imageManager.on('activeMarkerChange', updateActiveMarker);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager.off('activeMarkerChange', updateActiveMarker);
    };
  }, [imageManager]);

  // marker holder 스타일 관련
  const commonStyle = {
    backgroundColor: '#525252',
    borderRadius: '0 0 20px 20px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: 'height 0.5s ease, padding 0.5s ease',
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
  // end of marker holder 스타일 관련
  //// end of activeMarker 관련

  //// 이미지를 canvas 위에 보여주는 것과 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      imageManager.showImage(canvasRef.current, true);
    }
  }, [imageManager]);
  //// end of 이미지를 canvas 위에 보여주는 것과 관련

  //// canvas 위에 포인터를 추가하는 것 관련
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !activeMarker) {
      ErrUtil.assert(false);
    } else {
      // target 요소 내에서의 상대적인 마우스 좌표 계산
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 해당 위치에 기존의 포인터가 있는지 파악
      const pointer = activeMarker.findPointer(x, y);
      if (pointer != null) {
        activeMarker.setActivePointer(pointer);
      } else {
        // 기존 포인터가 없었을 경우, 새로운 포인터를 만들고, 이 포인터를 activePointer로 설정
        // 그 후에 canvas에 marker들을 다시 그려줌
        const newPointer = activeMarker.addPointer(x, y);
        activeMarker.setActivePointer(newPointer);
        imageManager.drawMarker(canvasRef.current);
      }
    }
  };
  //// end of canvas 위에 마킹하는 것 관련

  return (
    <section className="h-full flex flex-col items-center">
      <section style={{ height: '250px', width: '800px' }}>
        <section style={activeMarker ? showMarker : hideMarker}>
          {activeMarker && (
            <MarkerEditor marker={activeMarker} saveMarker={saveMarker} />
          )}
        </section>
      </section>
      <canvas
        onMouseDown={onMouseDown}
        width={800}
        height={500}
        ref={canvasRef}
      ></canvas>
    </section>
  );
}
