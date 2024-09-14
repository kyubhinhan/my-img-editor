'use client';

import { useState, useEffect, useRef } from 'react';
import ImageManager from '../common/ImageManager';
import Marker from '../common/Marker';
import MarkerEditor from './markerEditor';
import { HiMiniPaintBrush } from 'react-icons/hi2';
import ReactDOMServer from 'react-dom/server';
import ErrUtil from '../common/ErrUtil';

export default function ImageMarkLeft({
  imageManager,
}: {
  imageManager: ImageManager;
}) {
  //// activeMarker 관련
  const [activeMarker, setActiveMarker] = useState<Marker | null>(null);
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

  //// marker edit 관련
  const emitMarkerChange = () => {
    imageManager.emitChangeMarker();
  };
  //// end of marker edit 관련

  //// 이미지를 canvas 위에 보여주는 것과 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      imageManager.showImage(canvasRef.current);
    }
  }, [imageManager]);
  //// end of 이미지를 canvas 위에 보여주는 것과 관련

  //// cursor 관련
  const [cursor, setCursor] = useState('auto');
  const onMouseEnter = () => {
    if (activeMarker) {
      const size = (() => {
        switch (activeMarker.size) {
          case 'small':
            return 24;
          case 'medium':
            return 28;
          case 'large':
            return 32;
          default: {
            ErrUtil.assert(false);
          }
        }
      })();
      const markerCursor = (() => {
        const iconString = ReactDOMServer.renderToString(
          <HiMiniPaintBrush size={size} color={activeMarker.color} />
        );
        return `data:image/svg+xml;base64,${btoa(iconString)}`;
      })();
      setCursor(`url(${markerCursor}) 16 16, auto`);
    } else {
      setCursor('auto');
    }
  };
  const onMouseLeave = () => {
    setCursor('auto');
  };
  //// end of cursor 관련

  return (
    <section className="h-full flex flex-col items-center">
      <section style={{ height: '180px', width: '800px' }}>
        <MarkerEditor
          marker={activeMarker}
          emitMarkerChange={emitMarkerChange}
        />
      </section>
      <canvas
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ cursor }}
        width={800}
        height={500}
        ref={canvasRef}
      ></canvas>
    </section>
  );
}
