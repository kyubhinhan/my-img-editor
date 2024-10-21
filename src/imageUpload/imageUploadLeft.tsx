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
};

export default function ImageUploadLeft({ imageFileState }: PropsType) {
  const [imageFile, setImageFile] = imageFileState;

  //// 이미지 파일을 보여주는 것 관련
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (imageFile == null || canvasRef.current == null) {
      // do nothing
    } else {
      ImageUtil.showImage(canvasRef.current, imageFile);
    }
  }, [imageFile, canvasRef]);
  //// end of 이미지 파일을 보여주는 것 관련

  //// 이미지 파일 삭제 관련
  const onDeleteButtonClicked = () => {
    setImageFile(null);
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
