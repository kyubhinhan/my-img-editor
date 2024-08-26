'use client';

import { Button, ButtonGroup } from '@nextui-org/button';
import { Dispatch, SetStateAction, ReactNode } from 'react';

export default function CommonRightComponent({
  stage,
  prevStage,
  nextStage,
  setStage,
  disablePrevButton,
  disableNextButton,
  children,
}: {
  stage: string;
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string | null;
  nextStage: string | null;
  disablePrevButton: boolean;
  disableNextButton: boolean;
  children: ReactNode;
}) {
  const prevButtonClicked = () => {
    if (prevStage != null) {
      setStage(prevStage);
    }
  };
  const nextButtonClicked = () => {
    if (nextStage != null) {
      setStage(nextStage);
    }
  };
  const getLabel = (stage: string) => {
    if (stage == 'upload') return '이미지 업로드';
    else if (stage == 'mark') return '이미지 마킹';
    else if (stage == 'edit') return '이미지 에디팅';
    else if (stage == 'download') return '이미지 다운로드';
    else {
      // error 내야 함
    }
  };

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
        {getLabel(stage)}
      </h2>
      <div className="grow flex flex-col" style={{ gap: '34px' }}>
        {children}
      </div>
      <div className="flex flex-row" style={{ gap: '16px' }}>
        <Button
          className="grow"
          isDisabled={disablePrevButton}
          onClick={prevButtonClicked}
          size={'sm'}
        >
          이전
        </Button>
        <Button
          className="grow"
          isDisabled={disableNextButton}
          onClick={nextButtonClicked}
          size={'sm'}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
