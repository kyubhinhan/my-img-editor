'use client';

import { Input } from '@nextui-org/react';

export default function NumberBox({
  value,
  onValueChange,
  editorProps,
}: {
  value: Number;
  onValueChange: (value: Number) => void;
  editorProps: any;
}) {
  const onNumberValueChange = (value: string) => {
    onValueChange(Number(value));
  };

  return (
    <Input
      size="sm"
      type="number"
      value={value.toString()}
      onValueChange={onNumberValueChange}
    />
  );
}
