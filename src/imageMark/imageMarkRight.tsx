'use client';

import { Button, ButtonGroup } from '@nextui-org/button';
import { Dispatch, SetStateAction } from 'react';

export default function ImageMarkRight({
  setStage,
  prevStage,
  nextStage,
}: {
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
  nextStage: string;
}) {
  const prevButtonClicked = () => {
    setStage(prevStage);
  };
  const nextButtonClicked = () => {
    setStage(nextStage);
  };

  return (
    <div>
      <Button onClick={prevButtonClicked}>이전</Button>
      <Button onClick={nextButtonClicked}>다음</Button>
    </div>
  );
}
