'use client';

import { useState, useEffect, useRef } from 'react';
import ImageManager from '../common/ImageManager';
import Marker from '../common/Marker';

export default function ImageMarkLeft({
  imageManager,
}: {
  imageManager: ImageManager | null;
}) {
  //// activeMarker 관련
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
  useEffect(() => {
    const updateActiveMarker = () => {
      setActiveMarker(imageManager?.getActiveMarker() ?? null);
    };
    // 초기 설정
    updateActiveMarker();
    // imageManager가 존재하면 이벤트 리스너 등록
    imageManager?.on('activeMarkerChange', updateActiveMarker);
    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      imageManager?.off('activeMarkerChange', updateActiveMarker);
    };
  }, [imageManager]);

  //// end of activeMarker 관련

  //// 이미지를 canvas 위에 보여주는 것과 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (imageManager == null) {
      // do nothing
      // 이 컴포넌트가 화면에 보일 때, imageManager는 존재함
    } else {
      if (canvasRef.current) {
        imageManager.showImage(canvasRef.current);
      }
    }
  }, [imageManager]);
  //// end of 이미지를 canvas 위에 보여주는 것과 관련

  return (
    <section className="h-full flex flex-col items-center">
      <div style={{ height: '180px' }}>
        {activeMarker && <p>{activeMarker.name}</p>}
      </div>
      <canvas width={800} height={500} ref={canvasRef}></canvas>
    </section>
  );
}
