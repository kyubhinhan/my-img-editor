'use client';

import ErrUtil from '../ErrUtil';
import NumberBox from './NumberBox';
import { Button } from '@nextui-org/react';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Pointer = {
  x: number;
  y: number;
} | null;

type EditorProps = {
  xMax: number;
  yMax: number;
};

export type { Pointer };

export default function PointerBox({
  value,
  onValueChange,
  editorProps,
}: {
  value: Pointer;
  onValueChange: (value: Pointer) => void;
  editorProps: EditorProps;
}) {
  const onXValueChange = (xPosition: number) => {
    if (value) {
      onValueChange({
        x: xPosition,
        y: value.y,
      });
    } else {
      ErrUtil.assert(false);
    }
  };

  const onYValueChange = (yPosition: number) => {
    if (value) {
      onValueChange({
        x: value.x,
        y: yPosition,
      });
    } else {
      ErrUtil.assert(false);
    }
  };

  const onDeleteButtonClick = () => {
    onValueChange(null);
  };

  return (
    <div className="flex flex-row" style={{ gap: '14px' }}>
      <NumberBox
        value={value?.x ?? 0}
        onValueChange={onXValueChange}
        editorProps={{
          label: 'X',
          min: 0,
          max: editorProps.xMax,
          disabled: value == null,
        }}
      />
      <NumberBox
        value={value?.y ?? 0}
        onValueChange={onYValueChange}
        editorProps={{
          label: 'Y',
          min: 0,
          max: editorProps.yMax,
          disabled: value == null,
        }}
      />
      <Button
        isIconOnly
        size="sm"
        color="danger"
        isDisabled={value == null}
        onClick={onDeleteButtonClick}
      >
        <RiDeleteBin6Line />
      </Button>
    </div>
  );
}
