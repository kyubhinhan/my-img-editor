'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ReadOnlyTextBox from '@/src/common/ReadOnlyTextBox';
import CommonRightComponent from '@/src/common/CommonRightComponent';
import ImageUtil from '../common/ImageUtil';

export default function ImageUploadRight({
  imageFile,
  setStage,
  nextStage,
}: {
  imageFile: File | null;
  setStage: Dispatch<SetStateAction<string>>;
  nextStage: string;
}) {
  //// 진행 버튼 관련
  const [buttonDisabled, setButtonDisabled] = useState(true);
  useEffect(() => {
    if (imageFile == null) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [imageFile]);
  //// end of 진행 버튼 관련

  //// ImageFile 정보 관련
  const [fileName, setFileName] = useState('-');
  const [fileType, setFileType] = useState('-');
  const [fileSize, setFileSize] = useState('-');
  const [fileLMD, setFileLMD] = useState('-');
  useEffect(() => {
    if (imageFile == null) {
      setFileName('-');
      setFileType('-');
      setFileSize('-');
      setFileLMD('-');
    } else {
      const { name, type, size, lastModifiedDate } =
        ImageUtil.createImageInfo(imageFile);
      setFileName(name);
      setFileType(type);
      setFileSize(size);
      setFileLMD(lastModifiedDate);
    }
  }, [imageFile]);
  //// ImageFile 정보 관련

  return (
    <CommonRightComponent
      stage="upload"
      setStage={setStage}
      prevStage={null}
      nextStage={nextStage}
      disablePrevButton={true}
      disableNextButton={buttonDisabled}
    >
      <div className="h-full flex flex-col" style={{ gap: '34px' }}>
        <ReadOnlyTextBox label="이름" value={fileName} />
        <ReadOnlyTextBox label="타입" value={fileType} />
        <ReadOnlyTextBox label="사이즈" value={fileSize} />
        <ReadOnlyTextBox label="최종 수정 날짜" value={fileLMD} />
      </div>
    </CommonRightComponent>
  );
}
