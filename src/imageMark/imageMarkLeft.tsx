'use client';

import { useState, useEffect, useRef, MouseEventHandler } from 'react';
import ImageManager from '../common/ImageManager';
import Marker from '../common/Marker';
import MarkerEditor from './markerEditor';

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
  //// end of activeMarker 관련

  //// 이미지를 canvas 위에 보여주는 것과 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      imageManager.showImage(canvasRef.current);
    }
  }, [imageManager]);
  //// end of 이미지를 canvas 위에 보여주는 것과 관련

  //// canvas 위에 마킹하는 것 관련
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // activeMarker가 있고, canvas를 클릭한 경우 해당 위치에 포인터를 추가해주고,
    // 이를 캔버스 위에 그려줌
    if (canvasRef.current && activeMarker) {
      // target 요소의 위치와 크기를 가져옴
      const rect = canvasRef.current.getBoundingClientRect();
      // target 요소 내에서의 상대적인 마우스 좌표 계산
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      activeMarker.addPointer(x, y);
      imageManager.drawMarker(canvasRef.current);
    }
  };
  //// end of canvas 위에 마킹하는 것 관련

  return (
    <section className="h-full flex flex-col items-center">
      <section style={{ height: '250px', width: '800px' }}>
        <MarkerEditor marker={activeMarker} saveMarker={saveMarker} />
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
