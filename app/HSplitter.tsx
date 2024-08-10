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
  const [initialRightWidth, setInitialRightWidth] = useState(400);
  const [currentRightWidth, setCurrentRightWidth] = useState(400);
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
      const rightWidth = (() => {
        const dragOffsetX = startXPosition - e.clientX;
        const rightWidth = initialRightWidth + dragOffsetX;
        if (minRightWidth > rightWidth) return minRightWidth;
        else if (maxRightWidth < rightWidth) return maxRightWidth;
        else return rightWidth;
      })();
      setCurrentRightWidth(rightWidth);
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
  const displayStyle = {
    width: `${currentRightWidth}px`,
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: mouseDragging ? undefined : 'width 0.5s ease',
  };
  const hiddenStyle = {
    width: `0px`,
    overflow: 'hidden',
    whiteSpace: 'noWrap',
    transition: 'width 0.5s ease',
  };
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
        style={splitterOpen ? displayStyle : hiddenStyle}
      >
        {right}
      </div>
    </div>
  );
}
