'use client';

import { Button } from '@nextui-org/button';
import { Dispatch, SetStateAction } from 'react';

export default function ImageUploadRight({
  setStage,
  nextStage,
}: {
  setStage: Dispatch<SetStateAction<string>>;
  nextStage: string;
}) {
  const nextButtonClicked = () => {
    setStage(nextStage);
  };

  return (
    <div>
      <Button isDisabled>이전</Button>
      <Button onClick={nextButtonClicked}>다음</Button>
    </div>
  );
}
