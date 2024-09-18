'use client';

import { Input } from '@nextui-org/react';

export default function TextBox({
  value,
  onValueChange,
  editorProps,
}: {
  value: string;
  onValueChange: (value: string) => void;
  editorProps: any;
}) {
  return <Input size="sm" value={value} onValueChange={onValueChange} />;
}
