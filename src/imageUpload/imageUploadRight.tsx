'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ReadOnlyTextBox from '@/src/common/ReadOnlyTextBox';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import ImageManager from '../common/ImageManager';

export default function ImageUploadRight({
  imageManager,
  setStage,
  nextStage,
}: {
  imageManager: ImageManager | null;
  setStage: Dispatch<SetStateAction<string>>;
  nextStage: string;
}) {
  //// 컴포넌트 순서 조작 버튼 관련
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (imageManager == null) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [imageManager]);

  //// end of 컴포넌트 순서 조작 버튼 관련

  //// ReadOnlyTextBox 관련
  const [fileName, setFileName] = useState('-');
  const [fileType, setFileType] = useState('-');
  const [fileSize, setFileSize] = useState('-');
  const [fileLMD, setFileLMD] = useState('-');
  useEffect(() => {
    if (imageManager == null) {
      setFileName('-');
      setFileType('-');
      setFileSize('-');
      setFileLMD('-');
    } else {
      const { name, type, size, lastModifiedDate } =
        imageManager.getImageInfo();
      setFileName(name);
      setFileType(type);
      setFileSize(size);
      setFileLMD(lastModifiedDate);
    }
  }, [imageManager]);
  //// end of ReadOnlyTextBox 관련

  return (
    <CommonRightComponent
      stage="upload"
      setStage={setStage}
      prevStage={null}
      nextStage={nextStage}
      disablePrevButton={true}
      disableNextButton={buttonDisabled}
    >
      <ReadOnlyTextBox label="이름" value={fileName} />
      <ReadOnlyTextBox label="타입" value={fileType} />
      <ReadOnlyTextBox label="사이즈" value={fileSize} />
      <ReadOnlyTextBox label="최종 수정 날짜" value={fileLMD} />
    </CommonRightComponent>
  );
}
