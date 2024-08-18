'use client';

import { useRef } from 'react';

export default function ImageUploadLeft() {
  // 이미지 파일 업로드 관련
  const inputFileRef = useRef<HTMLInputElement>(null);

  const onMouseDown = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };
  // end of 이미지 파일 업로드 관련

  return (
    <div className="flex flex-col h-full" style={{ gap: '20px' }}>
      <div className="text-center"> 이미지 업로드</div>
      <div
        className="grow bg-stone-500 cursor-pointer"
        onMouseDown={onMouseDown}
      >
        이미지 업로드하거나 보여주는 부분
        <input ref={inputFileRef} type="file" className="invisible"></input>
      </div>
      <div className="text-center invisible">이미지 삭제하는 버튼</div>
    </div>
  );
}
