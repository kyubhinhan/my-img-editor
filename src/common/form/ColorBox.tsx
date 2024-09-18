'use client';

import { Input } from '@nextui-org/react';

export default function ColorBox({
  value,
  onValueChange,
  editorProps,
}: {
  value: string;
  onValueChange: (value: string) => void;
  editorProps: any;
}) {
  return (
    <Input size="sm" type="color" value={value} onValueChange={onValueChange} />
  );
}
