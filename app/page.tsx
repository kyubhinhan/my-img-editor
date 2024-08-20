'use client';

import { useState, useEffect, ReactElement } from 'react';
import HSplitter from '@/app/HSplitter';
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
  const [imageFile, setImageFile] = useState(null);
  // end of 전역 데이터 설정

  // 화면 관련 컴포넌트 설정
  const [stage, setStage] = useState('upload');

  const imageUploadLeft = ImageUploadLeft();
  const imageUploadRight = ImageUploadRight({ setStage, nextStage: 'mark' });
  const imageMarkLeft = ImageMarkLeft();
  const imageMarkRight = ImageMarkRight({
    setStage,
    prevStage: 'upload',
    nextStage: 'edit',
  });
  const imageEditLeft = ImageEditLeft();
  const imageEditRight = ImageEditRight({
    setStage,
    prevStage: 'mark',
    nextStage: 'download',
  });
  const imageDownloadLeft = ImageDownloadLeft();
  const imageDownloadRight = ImageDownloadRight({
    setStage,
    prevStage: 'edit',
  });
  const [leftSlot, setLeftSlot] = useState(imageUploadLeft);
  const [rightSlot, setRightSlot] = useState(imageUploadRight);

  useEffect(() => {
    if (stage == 'upload') {
      setLeftSlot(imageUploadLeft);
      setRightSlot(imageUploadRight);
    } else if (stage == 'mark') {
      setLeftSlot(imageMarkLeft);
      setRightSlot(imageMarkRight);
    } else if (stage == 'edit') {
      setLeftSlot(imageEditLeft);
      setRightSlot(imageEditRight);
    } else if (stage == 'download') {
      setLeftSlot(imageDownloadLeft);
      setRightSlot(imageDownloadRight);
    } else {
      // do nothiing 이곳으로 들어오면 안됨
    }
  }, [stage]);

  // end of 화면 관련 컴포넌트 설정

  return (
    <main>
      <HSplitter left={leftSlot} right={rightSlot} />
    </main>
  );
}
