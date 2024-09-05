'use client';

import { useState, useEffect, ReactElement } from 'react';
import HSplitter from '@/app/HSplitter';
import ImageManager from '@/src/common/ImageManager';
import ImageUploadLeft from '@/src/imageUpload/imageUploadLeft';
import ImageUploadRight from '@/src/imageUpload/imageUploadRight';
import ImageMarkLeft from '@/src/imageMark/imageMarkLeft';
import ImageMarkRight from '@/src/imageMark/imageMarkRight';
import ImageEditLeft from '@/src/imageEdit/imageEditLeft';
import ImageEditRight from '@/src/imageEdit/imageEditRight';
import ImageDownloadLeft from '@/src/imageDownload/imageDownloadLeft';
import ImageDownloadRight from '@/src/imageDownload/imageDownloadRight';

export default function Home() {
  // 전역 데이터 설정
  const [imageManager, setImageManager] = useState<ImageManager | null>(null);
  const [stage, setStage] = useState('upload');
  // end of 전역 데이터 설정

  // 화면 관련 컴포넌트 설정
  const renderLeftSlot = () => {
    switch (stage) {
      case 'upload':
        return (
          <ImageUploadLeft
            imageManager={imageManager}
            setImageManager={setImageManager}
          />
        );
      case 'mark':
        return <ImageMarkLeft imageManager={imageManager} />;
      case 'edit':
        return <ImageEditLeft />;
      case 'download':
        return <ImageDownloadLeft />;
      default:
        return null;
    }
  };

  const renderRightSlot = () => {
    switch (stage) {
      case 'upload':
        return (
          <ImageUploadRight
            imageManager={imageManager}
            setStage={setStage}
            nextStage="mark"
          />
        );
      case 'mark':
        return (
          <ImageMarkRight
            imageManager={imageManager}
            setStage={setStage}
            prevStage="upload"
            nextStage="edit"
          />
        );
      case 'edit':
        return (
          <ImageEditRight
            setStage={setStage}
            prevStage="mark"
            nextStage="download"
          />
        );
      case 'download':
        return <ImageDownloadRight setStage={setStage} prevStage="edit" />;
      default:
        return null;
    }
  };

  // end of 화면 관련 컴포넌트 설정

  return (
    <main>
      <HSplitter left={renderLeftSlot()} right={renderRightSlot()} />
    </main>
  );
}
