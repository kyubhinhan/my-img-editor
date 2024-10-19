'use client';

import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@nextui-org/button';
import { BiImageAdd } from 'react-icons/bi';
import ImageManager from '../common/ImageManager';

export default function ImageUploader({
  setImageFile,
}: {
  setImageFile: Dispatch<SetStateAction<File | null>>;
}) {
  // image가 제대로 업로드 되지 않았을 때, 경고 메시지를 띄움
  const [imageWarningMessage, setImageWarningMessage] = useState('');
  const setNewImageFile = (imageFile: File) => {
    setImageFile(imageFile);
    setImageWarningMessage('');
  };

  // 내부를 클릭해서 업로드
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onMouseDown = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  const onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    const orgfile = event.target.files?.[0];
    if (orgfile != null) {
      setNewImageFile(orgfile);
    } else {
      setImageWarningMessage('imageFile을 인식할 수 없습니다.');
    }
  };

  // drag & drop으로 업로드
  const getImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) return imageFiles[0];
    else return undefined;
  };
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const imageFile = getImageFile(event);
    if (imageFile != null) {
      setNewImageFile(imageFile);
    } else {
      setImageWarningMessage('이미지 파일만 업로드 할 수 있습니다.');
    }
  };

  //// image upload field의 컬러 관련
  // slate 300이 default
  const slate300 = '#d1d5db';
  const slate200 = '#e2e8f0';
  const [iconColor, setIconColor] = useState(slate300);
  const onMouseEnter = () => {
    // hover시 slate 200으로
    setIconColor(slate200);
  };
  const onMouseLeave = () => {
    // leave시 다시 300으로
    setIconColor(slate300);
  };
  //// end of image upload field의 컬러 관련

  return (
    <section
      className="bg-stone-500 cursor-pointer flex flex-col justify-center items-center"
      style={{
        height: '460px',
        borderRadius: '15px',
        borderWidth: '3px',
        borderStyle: 'dotted',
        borderColor: iconColor,
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <BiImageAdd size={'30%'} style={{ color: iconColor }} />
      {imageWarningMessage != '' && (
        <div style={{ color: '#ef4444' }}>{imageWarningMessage}</div>
      )}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        className="invisible"
        onChange={onFileUploaded}
      />
    </section>
  );
}
