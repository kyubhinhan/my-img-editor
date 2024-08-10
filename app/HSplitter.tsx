'use client'; // 클라이언트 컴포넌트로 설정

import React, { MouseEventHandler, useState, useEffect, Children } from 'react';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';

export default function HSplitter({
  left,
  right,
}: Readonly<{
  left: React.ReactNode;
  right: React.ReactNode;
}>) {
  // right width 설정
  // currentRightWidth는 페이지별로 같아야 하기 때문에 contextAPI로 관리함
  const [currentRightWidth, setCurrentRightWidth] = useState(300);
  const [initialRightWidth, setInitialRightWidth] = useState(300);
  const [startXPosition, setStartXPosition] = useState(0);
  const [mouseDragging, setMouseDragging] = useState(false);
  const maxRightWidth = 600;
  const minRightWidth = 200;
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMouseDragging(true);
    setStartXPosition(e.clientX);
    setInitialRightWidth(currentRightWidth);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDragging) {
      setMouseDragging(false);
    }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (mouseDragging) {
      const dragOffsetX = startXPosition - e.clientX;
      const rightWidth = initialRightWidth + dragOffsetX;
      if (minRightWidth > rightWidth) {
        setCurrentRightWidth(minRightWidth);
      } else if (maxRightWidth < rightWidth) {
        setCurrentRightWidth(maxRightWidth);
      } else {
        setCurrentRightWidth(rightWidth);
      }
    }
  };
  // end of right width 설정

  // splitter color 설정
  const defaultBackgroundColor = 'bg-stone-300';
  const mouseEnterBackgroundColor = 'bg-stone-200';
  const [splitterColor, setSplitterColor] = useState(defaultBackgroundColor);
  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (splitterOpen) {
      setSplitterColor(mouseEnterBackgroundColor);
    }
  };
  const onMouseLeave = () => {
    if (splitterOpen) {
      setSplitterColor(defaultBackgroundColor);
    }
  };
  // end of splitter color 설정

  // 접기 및 펼치기 설정
  const [splitterOpen, setSplitterOpen] = useState(true);
  const onSplitterButtonClicked = () => {
    setSplitterOpen(!splitterOpen);
  };
  // end of 접기 및 펼치기 설정

  return (
    <div
      className="flex flex-row h-screen"
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    >
      <div className="grow flex justify-center items-center bg-stone-700">
        {left}
      </div>
      <div className="relative w-2">
        <div
          className={`${splitterColor} h-full w-full`}
          style={{ cursor: splitterOpen ? 'col-resize' : 'default' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
        />
        <div
          className={`w-4 h-8 absolute bg-stone-300 flex justify-center items-center`}
          style={{ cursor: 'pointer', top: '50%', left: '-15px' }}
          onMouseDown={onSplitterButtonClicked}
        >
          {splitterOpen && <MdKeyboardDoubleArrowRight color="black" />}
          {!splitterOpen && <MdKeyboardDoubleArrowLeft color="black" />}
        </div>
      </div>
      <div
        className="bg-stone-500"
        style={{
          width: `${currentRightWidth}px`,
          display: splitterOpen ? 'block' : 'none',
        }}
      >
        {right}
      </div>
    </div>
  );
}
