'use client';

// type import
import { Marker } from '@/src/common/MarkerUtil';

// util import
import MarkerUtil from '@/src/common/MarkerUtil';

import { useState } from 'react';
import HSplitter from '@/app/HSplitter';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stage, setStage] = useState('upload');

  const defaultMarkers = MarkerUtil.createDefaultMarkers();
  const [markers, setMarkers] = useState<Marker[]>(defaultMarkers);
  const [activeMarker, setActiveMarker] = useState<Marker | null>(
    defaultMarkers[0]
  );
  const [activeMarkerHasChanges, setActiveMarkerHasChanges] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{
    [key: string]: string;
  }>({});
  // end of 전역 데이터 설정

  // simplePopup 관련 설정
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<ButtonProps[]>([]);
  const [onButtonClick, setOnButtonClick] = useState<
    (buttonId: string) => void
  >(() => {});
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
      setOnButtonClick(() => (buttonId: string) => {
        resolve(buttonId);
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
            imageFileState={[imageFile, setImageFile]}
            imageState={[image, setImage]}
          />
        );
      case 'mark':
        return (
          image && (
            <ImageMarkLeft
              image={image}
              markersState={[markers, setMarkers]}
              activeMarkerState={[activeMarker, setActiveMarker]}
              setActiveMarkerHasChanges={setActiveMarkerHasChanges}
              markerPositionState={[markerPosition, setMarkerPosition]}
              showSimplePopup={showSimplePopup}
            />
          )
        );
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
            imageFile={imageFile}
            setStage={setStage}
            nextStage="mark"
          />
        );
      case 'mark':
        return (
          image && (
            <ImageMarkRight
              markersState={[markers, setMarkers]}
              activeMarkerState={[activeMarker, setActiveMarker]}
              hasChanges={activeMarkerHasChanges}
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
