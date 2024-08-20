'use client';

import { Button, ButtonGroup } from '@nextui-org/button';
import { Dispatch, SetStateAction } from 'react';

export default function ImageDownloadRight({
  setStage,
  prevStage,
}: {
  setStage: Dispatch<SetStateAction<string>>;
  prevStage: string;
}) {
  const prevButtonClicked = () => {
    setStage(prevStage);
  };

  return (
    <div>
      <Button onClick={prevButtonClicked}>이전</Button>
      <Button isDisabled>다음</Button>
    </div>
  );
}
