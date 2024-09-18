'use client';

import TextBox from './TextBox';
import NumberBox from './NumberBox';
import ColorBox from './ColorBox';
import RadioGroup from './RadioGroup';
import PointerBox from './PointerBox';

const formItems = {
  textBox: TextBox,
  numberBox: NumberBox,
  colorBox: ColorBox,
  radioGroup: RadioGroup,
  pointerBox: PointerBox,
};

type FormItemProps<T> = {
  type: keyof typeof formItems;
  label: string;
  labelPosition: string;
  value: T;
  onValueChange: (value: T) => void;
  width?: string;
  editorProps?: any;
};

export default function FormItem<T>({
  type,
  label,
  labelPosition,
  value,
  onValueChange,
  width,
  editorProps,
}: FormItemProps<T>) {
  const Editor = formItems[type] as React.ComponentType<any>;
  const wrapperClass = `flex ${labelPosition == 'top' ? 'flex-col' : 'flex-row'}`;
  const labelClass = 'font-semibold text-base';

  return (
    <div className={wrapperClass} style={{ gap: '20px', width }}>
      <label className={labelClass}>{label}</label>
      <Editor
        value={value}
        onValueChange={onValueChange}
        editorProps={editorProps}
      />
    </div>
  );
}
