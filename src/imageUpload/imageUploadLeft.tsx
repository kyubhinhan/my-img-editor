'use client';

import { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@nextui-org/button';
import { BiImageAdd } from 'react-icons/bi';
import ImageManager from '../common/ImageManager';

export default function ImageUploadLeft({
  imageManager,
  setImageManager,
}: {
  imageManager: ImageManager | null;
  setImageManager: Dispatch<SetStateAction<ImageManager | null>>;
}) {
  //// 이미지 파일 업로드 관련
  const [imageWarningMessage, setImageWarningMessage] = useState('');
  const setNewImageManager = (imageFile: File | undefined) => {
    if (imageFile != undefined) {
      setImageManager(new ImageManager(imageFile));
      setImageWarningMessage('');
    }
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
    setNewImageManager(orgfile);
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
      setNewImageManager(imageFile);
    } else {
      setImageWarningMessage('이미지 파일만 업로드 할 수 있습니다.');
    }
  };
  //// end of 이미지 파일 업로드 관련

  //// 이미지 파일을 보여주는 것 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (imageManager == null) {
      // do nothing
      // 여기서는 어차피 캔버스가 랜더링되지 않음
    } else {
      if (canvasRef.current) {
        // imageManager가 canvas 위에 이미지를 띄워줌
        imageManager.showImage(canvasRef.current);
      }
    }
  }, [imageManager]);
  //// end of 이미지 파일을 보여주는 것 관련

  //// 이미지 파일 삭제 관련
  const onDeleteButtonClicked = () => {
    setImageManager(null);
  };
  //// end of 이미지 파일 삭제 관련

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
    <section className="h-full flex flex-col items-center">
      <div style={{ height: '120px' }}></div>
      <div
        className="flex flex-col"
        style={{ gap: '20px', width: '800px', height: '600px' }}
      >
        {imageManager == null ? (
          <div
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
          </div>
        ) : (
          <canvas width={720} height={460} ref={canvasRef}></canvas>
        )}
        <Button
          color="danger"
          variant="solid"
          isDisabled={imageManager == null}
          style={{ height: '40px' }}
          onClick={onDeleteButtonClicked}
        >
          이미지 삭제
        </Button>
      </div>
    </section>
  );
}
