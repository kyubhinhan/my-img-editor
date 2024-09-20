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

import SimplePopup from '@/src/common/SimplePopup';
import { ButtonProps } from '@/src/common/SimplePopup';

export default function Home() {
  // 전역 데이터 설정
  const [imageManager, setImageManager] = useState<ImageManager | null>(null);
  const [stage, setStage] = useState('upload');
  // end of 전역 데이터 설정

  // simplePopup 관련 설정
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<ButtonProps[]>([]);
  const [onButtonClick, setOnButtonClick] = useState<Function>(
    () => (id?: string) => {}
  );
  const showSimplePopup = (
    title: string,
    message: string,
    buttons: ButtonProps[]
  ) => {
    setTitle(title);
    setMessage(message);
    setButtons(buttons);
    setVisible(true);
    return new Promise((resolve) => {
      setOnButtonClick(() => (id?: string) => {
        resolve(id);
        setVisible(false);
      });
    });
  };
  // end of simplePopup 관련 설정

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
        return imageManager && <ImageMarkLeft imageManager={imageManager} />;
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
          imageManager && (
            <ImageMarkRight
              imageManager={imageManager}
              showSimplePopup={showSimplePopup}
              setStage={setStage}
              prevStage="upload"
              nextStage="edit"
            />
          )
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
      <SimplePopup
        visible={visible}
        title={title}
        message={message}
        buttons={buttons}
        onButtonClick={onButtonClick}
      />
    </main>
  );
}
