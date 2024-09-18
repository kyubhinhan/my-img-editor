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

export default function FormItem({
  type,
  label,
  labelPosition,
  value,
  onValueChange,
  width,
  editorPorps,
}: {
  type: keyof typeof formItems;
  label: string;
  labelPosition: string;
  value: any;
  onValueChange: (value: any) => void;
  width?: string;
  editorPorps?: any;
}) {
  const Editor = formItems[type];
  const wrapperClass = `flex ${labelPosition == 'top' ? 'flex-col' : 'flex-row'}`;
  const labelClass = 'font-semibold text-base';

  return (
    <div className={wrapperClass} style={{ gap: '20px', width }}>
      <label className={labelClass}>{label}</label>
      <Editor
        value={value}
        onValueChange={onValueChange}
        editorProps={editorPorps}
      />
    </div>
  );
}
