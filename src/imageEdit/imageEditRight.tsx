'use client';

import { Dispatch, SetStateAction } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';

export default function ImageEditRight({
  setStage,
  prevStage,
  nextStage,
}: {
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
  nextStage: string;
}) {
  return (
    <CommonRightComponent
      stage="edit"
      setStage={setStage}
      prevStage={prevStage}
      nextStage={nextStage}
      disablePrevButton={false}
      disableNextButton={false}
    >
      <div>edit 관련 필요한거</div>
    </CommonRightComponent>
  );
}
