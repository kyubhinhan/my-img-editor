'use client';

import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { BiImageAdd } from 'react-icons/bi';

export default function ImageUploadLeft({
  imageFile,
  setImageFile,
}: {
  imageFile: File | null;
  setImageFile: Dispatch<SetStateAction<File | null>>;
}) {
  //// 이미지 파일 업로드 관련
  const [imageWarningMessage, setImageWarningMessage] = useState('');

  // 내부를 클릭해서 업로드
  const inputFileRef = useRef<HTMLInputElement>(null);
  const onMouseDown = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  const onFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageWarningMessage('');
    }
  };

  // drag & drop으로 업로드
  const getImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) return imageFiles[0];
    else return null;
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
      setImageFile(imageFile);
      setImageWarningMessage('');
    } else {
      setImageWarningMessage('이미지 파일만 업로드 할 수 있습니다.');
    }
  };
  //// end of 이미지 파일 업로드 관련

  //// 이미지 파일을 보여주기
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (imageFile == null) {
      setImageSrc(undefined);
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
    }
  }, [imageFile]);
  //// end of 이미지 파일을 보여주기

  //// 이미지 파일 삭제 관련
  const onDeleteButtonClicked = () => {
    setImageFile(null);
  };
  //// end of 이미지 파일 삭제 관련

  //// 이미지 높이 관련
  // 전체 height - 제목(50px) - 아래 버튼(40px) - gap 2개(40px)
  const imageHeight = 'calc(100% - 50px - 40px - 40px)';
  //// end of 이미지 높이 관련

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
    <div className="h-full flex flex-col" style={{ gap: '20px' }}>
      <div className="text-center" style={{ height: '50px' }}>
        이미지 업로드
      </div>
      {imageFile == null ? (
        <div
          className="bg-stone-500 cursor-pointer flex flex-col justify-center items-center"
          style={{
            height: imageHeight,
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
        </div>
      ) : (
        <Image
          alt="uploaded image"
          style={{ width: '100%', height: imageHeight, objectFit: 'cover' }}
          removeWrapper
          src={imageSrc}
        ></Image>
      )}
      <Button
        color="danger"
        variant="solid"
        isDisabled={imageFile == null}
        style={{ height: '40px' }}
        onClick={onDeleteButtonClicked}
      >
        이미지 삭제
      </Button>
    </div>
  );
}
