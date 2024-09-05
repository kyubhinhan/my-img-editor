'use client';

import { useState, useEffect, useRef } from 'react';
import ImageManager from '../common/ImageManager';

export default function ImageMarkLeft({
  imageManager,
}: {
  imageManager: ImageManager | null;
}) {
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
    <section className="h-full">
      <canvas width={720} height={460} ref={canvasRef}></canvas>
    </section>
  );
}
