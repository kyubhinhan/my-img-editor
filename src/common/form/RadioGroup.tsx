'use client';

import { RadioGroup, Radio } from '@nextui-org/react';

export default function MyRadioGroup({
  value,
  onValueChange,
  editorProps,
}: {
  value: string;
  onValueChange: (value: string) => void;
  editorProps: { items: { value: any; text: string }[] };
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      orientation="horizontal"
      classNames={{ wrapper: 'justify-between' }}
    >
      {editorProps.items.map((item, index) => (
        <Radio
          key={index}
          value={item.value}
          classNames={{ label: 'text-slate-200' }}
        >
          {item.text}
        </Radio>
      ))}
    </RadioGroup>
  );
}
