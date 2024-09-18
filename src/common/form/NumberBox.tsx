'use client';

import { Input } from '@nextui-org/react';

type EditorProps = {
  min: number;
  max: number;
  label?: string;
  disabled?: boolean;
};

export default function NumberBox({
  value,
  onValueChange,
  editorProps,
}: {
  value: number;
  onValueChange: (value: number) => void;
  editorProps?: EditorProps;
}) {
  const onNumberValueChange = (value: string) => {
    onValueChange(Number(value));
  };

  return (
    <Input
      size="sm"
      type="number"
      label={editorProps?.label}
      labelPlacement={'outside-left'}
      min={editorProps?.min}
      max={editorProps?.max}
      isDisabled={editorProps?.disabled}
      value={value.toString()}
      onValueChange={onNumberValueChange}
      classNames={{ label: 'text-slate-200' }}
    />
  );
}
