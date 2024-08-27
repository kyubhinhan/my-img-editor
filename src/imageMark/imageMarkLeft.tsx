'use client';

import { useState, useEffect, useRef } from 'react';

export default function ImageMarkLeft({
  imageFile,
}: {
  imageFile: File | null;
}) {
  // 이미지를 canvas 위에 올리는 것 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (imageFile == null) {
      // canvas를 비워줌
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      context?.clearRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);
    } else {
      // canvas 위에 이미지를 올려줌
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const context = canvasRef.current?.getContext('2d');
          context?.drawImage(img, 0, 0);
        };
      };
    }
  }, [imageFile]);
  // end of 이미지를 canvas 위에 올리는 것 관련

  return (
    <section className="h-full">
      <canvas width={720} height={500} ref={canvasRef}></canvas>
    </section>
  );
}
