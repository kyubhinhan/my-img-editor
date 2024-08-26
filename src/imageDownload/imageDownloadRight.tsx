'use client';

import { Dispatch, SetStateAction } from 'react';
import CommonRightComponent from '@/src/common/CommonRightComponent';

export default function ImageDownloadRight({
  setStage,
  prevStage,
}: {
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
}) {
  return (
    <CommonRightComponent
      stage="download"
      setStage={setStage}
      prevStage={prevStage}
      nextStage={null}
      disablePrevButton={false}
      disableNextButton={true}
    >
      <div>download 관련 필요한거</div>
    </CommonRightComponent>
  );
}
