'use client'; // 클라이언트 컴포넌트로 설정

import React, { useState } from 'react';

export default function HSplitter({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // left component
  const leftSlot = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.slot === 'left'
  );

  // right component
  const rightSlot = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.props.slot === 'right'
  );

  //// splitter
  // background color
  const defaultBackgroundColor = 'bg-stone-300';
  const mouseEnterBackgroundColor = 'bg-stone-200';
  const [splitterColor, setSplitterColor] = useState(defaultBackgroundColor);
  const onMouseEnter = () => {
    setSplitterColor(mouseEnterBackgroundColor);
  };
  const onMouseLeave = () => {
    setSplitterColor(defaultBackgroundColor);
  };
  //// end of splitter

  return (
    <div className="flex flex-row h-screen">
      <div className="grow flex justify-center items-center bg-orange-700">
        {leftSlot}
      </div>
      <div
        className={`${splitterColor} w-2`}
        style={{ cursor: 'col-resize' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      ></div>
      <div className="bg-stone-500 min-w-80">{rightSlot}</div>
    </div>
  );
}
