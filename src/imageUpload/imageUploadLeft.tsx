'use client';

import { useRef, useEffect, Dispatch, SetStateAction } from 'react';
import { Button } from '@nextui-org/button';
import ImageUploader from './imageUploader';
import ImageUtil from '../common/ImageUtil';

type PropsType = {
  imageFileState: [
    imageFile: File | null,
    setImageFile: Dispatch<SetStateAction<File | null>>,
  ];
  imageState: [
    image: HTMLImageElement | null,
    setImage: Dispatch<SetStateAction<HTMLImageElement | null>>,
  ];
};

export default function ImageUploadLeft({
  imageFileState,
  imageState,
}: PropsType) {
  const [imageFile, setImageFile] = imageFileState;
  const [image, setImage] = imageState;

  //// 이미지 파일을 보여주는 것 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 이미지 올려줌
  useEffect(() => {
    if (imageFile == null) {
      // do nothing
    } else {
      ImageUtil.loadImage(imageFile, setImage);
    }
  }, [imageFile]);

  // 이미지 그려줌
  useEffect(() => {
    if (image == null || canvasRef.current == null) {
      // do nothing
    } else {
      ImageUtil.drawImage(canvasRef.current, image);
    }
  }, [image, canvasRef]);
  //// end of 이미지 파일을 보여주는 것 관련

  //// 이미지 파일 삭제 관련
  const onDeleteButtonClicked = () => {
    setImageFile(null);
    setImage(null);
  };
  //// end of 이미지 파일 삭제 관련

  return (
    <section className="h-full flex flex-col items-center">
      <div style={{ height: '120px' }}></div>
      <div
        className="flex flex-col"
        style={{ gap: '20px', width: '800px', height: '600px' }}
      >
        {imageFile == null ? (
          <ImageUploader setImageFile={setImageFile} />
        ) : (
          <canvas width={720} height={460} ref={canvasRef}></canvas>
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
    </section>
  );
}
