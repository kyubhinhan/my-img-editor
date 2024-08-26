'use client';

import { Button } from '@nextui-org/button';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ReadOnlyTextBox from '@/src/common/ReadOnlyTextBox';

export default function ImageUploadRight({
  imageFile,
  setStage,
  nextStage,
}: {
  imageFile: File | null;
  setStage: Dispatch<SetStateAction<string>>;
  nextStage: string;
}) {
  //// 컴포넌트 순서 조작 버튼 관련
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const nextButtonClicked = () => {
    setStage(nextStage);
  };
  useEffect(() => {
    if (imageFile == null) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [imageFile]);

  //// end of 컴포넌트 순서 조작 버튼 관련

  //// ReadOnlyTextBox 관련
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
      setFileName(imageFile.name);
      setFileType(getFileType(imageFile));
      setFileSize(getFileSize(imageFile));
      setFileLMD(getFileLMD(imageFile));
    }
  }, [imageFile]);
  //// end of ReadOnlyTextBox 관련

  return (
    <section className="h-full flex flex-col">
      <h2
        style={{
          fontWeight: 800,
          fontSize: '1.5rem',
          lineHeight: '2rem',
          marginBottom: '3rem',
        }}
      >
        이미지 정보
      </h2>
      <div className="grow flex flex-col" style={{ gap: '34px' }}>
        <ReadOnlyTextBox label="이름" value={fileName} />
        <ReadOnlyTextBox label="타입" value={fileType} />
        <ReadOnlyTextBox label="사이즈" value={fileSize} />
        <ReadOnlyTextBox label="최종 수정 날짜" value={fileLMD} />
      </div>
      <div className="flex flex-row" style={{ gap: '16px' }}>
        <Button isDisabled className="grow" size={'sm'}>
          이전
        </Button>
        <Button
          className="grow"
          onClick={nextButtonClicked}
          size={'sm'}
          isDisabled={buttonDisabled}
        >
          다음
        </Button>
      </div>
    </section>
  );
}

function getFileType(imageFile: File) {
  const type = imageFile.type;
  return type.split('/')[1];
}

function getFileSize(imageFile: File) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const bytes = imageFile.size;
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function getFileLMD(imageFile: File) {
  const lastModifiedDate = new Date(imageFile.lastModified);
  return lastModifiedDate.toLocaleString('ko-KR', { timeZone: 'UTC' });
}
