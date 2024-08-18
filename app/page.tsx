'use client';

import { useState, useEffect, ReactElement } from 'react';
import HSplitter from '@/app/HSplitter';
import ImageUploadLeft from '@/src/imageUpload/imageUploadLeft';
import ImageUploadRight from '@/src/imageUpload/imageUploadRight';

export default function Home() {
  // 전역 데이터 설정
  const [imageFile, setImageFile] = useState(null);
  // end of 전역 데이터 설정

  // 화면 관련 컴포넌트 설정
  const imageUploadLeft = ImageUploadLeft();
  const imageUploadRight = ImageUploadRight();
  const [leftSlot, setLeftSlot] = useState(imageUploadLeft);
  const [rightSlot, setRightSlot] = useState(imageUploadRight);
  // end of 화면 관련 컴포넌트 설정

  return (
    <main>
      <HSplitter left={leftSlot} right={rightSlot} />
    </main>
  );
}
