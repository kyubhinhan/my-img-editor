'use client';

import { useState, useEffect, useMemo, Dispatch, SetStateAction } from 'react';
import Marker from '../common/Marker';
import { Button } from '@nextui-org/react';
import FormItem from '../common/form/FormItem';
import ErrUtil from '../common/ErrUtil';
import { Pointer } from '../common/Marker';

export default function MarkerEditor({
  canvas,
  marker,
  saveMarker,
  drawPointers,
  setCursor,
}: {
  canvas: HTMLCanvasElement;
  marker: Marker;
  saveMarker: () => void;
  drawPointers: (
    canvas: HTMLCanvasElement,
    pointers: Pointer[],
    color: string,
    activePointer: Pointer | null
  ) => void;
  setCursor: Dispatch<SetStateAction<'default' | 'grab' | 'grabbing'>>;
}) {
  //// marker value 변경 관련
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [category, setCategory] = useState('ceiling');
  const [pointers, setPointers] = useState<Pointer[]>([]);
  const [activePointer, setActivePointer] = useState<Pointer | null>(null);

  // 초기값 설정
  useEffect(() => {
    setInitialState(marker);
  }, [marker]);

  // 포인터들의 변화에 따라서 canvas에 관련 값을 그려줌
  useEffect(() => {
    drawPointers(canvas, pointers, color, activePointer);
  }, [pointers, color, activePointer]);

  // 마커의 변화를 감지해줌
  const hasChanges = useMemo(() => {
    const isPointerChanged = (() => {
      if (marker.pointers.length != pointers.length) return true;
      else
        return pointers.some((pointer) => {
          const markerPointer = marker.pointers.find((p) => p.id == pointer.id);
          return markerPointer?.x != pointer.x || markerPointer?.y != pointer.y;
        });
    })();
    return (
      marker.name != name ||
      marker.color.toLowerCase() != color.toLowerCase() ||
      marker.category != category ||
      isPointerChanged
    );
  }, [name, color, category, pointers, marker]);
  useEffect(() => {
    marker.setHasChanges(hasChanges);
  }, [hasChanges]);

  const onNameChange = (name: string) => {
    setName(name);
  };

  const onColorChange = (color: string) => {
    setColor(color);
  };

  const onCategoryChange = (category: string) => {
    setCategory(category);
  };

  const onPointerChange = (editedPointer: Pointer | null) => {
    if (activePointer) {
      if (editedPointer == null) {
        // 포인터를 삭제한 경우, 바로 이전에 추가된 포인터를 activePointer로 설정해줌
        const newPointers = pointers.filter(
          (pointer) => pointer.id != activePointer.id
        );
        setPointers(newPointers);
        setActivePointer(
          newPointers.length > 0 ? newPointers[newPointers.length - 1] : null
        );
      } else {
        // 포인터를 수정한 경우
        editPointer(editedPointer, pointers, setPointers, setActivePointer);
      }
    } else {
      // 포인터가 있어야 함
      ErrUtil.assert(false);
    }
  };

  const onRevertButtonClick = () => {
    setInitialState(marker);
  };

  const onSaveButtonClick = () => {
    marker.saveEditData(name, color, category, pointers);
    saveMarker();
  };

  const setInitialState = (marker: Marker) => {
    setName(marker.name);
    setColor(marker.color);
    setCategory(marker.category);
    setPointers(marker.pointers);
    setActivePointer(null);
  };
  //// end of marker value 변경 관련

  //// canvas에 포인터 관련 이벤트 설정
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      // mouse cursor 모양을 변경해줌
      setCursorWithMouseEvent(canvas, event, pointers, setCursor);

      // activePointer 관련 처리를 해줌
      const { x, y } = findPosition(canvas, event);
      const pointer = findPointer(x, y, pointers);
      if (pointer != null) {
        setActivePointer(pointer);
      } else {
        // 기존 포인터가 없었을 경우, 새로운 포인터를 만들고, 이 포인터를 activePointer로 설정
        const newPointer = marker.createPointer(x, y);
        setPointers([...pointers, newPointer]);
        setActivePointer(newPointer);
      }
    };
    const onMouseUp = (event: MouseEvent) => {
      setCursorWithMouseEvent(canvas, event, pointers, setCursor);
    };
    const onMouseMove = (event: MouseEvent) => {
      setCursorWithMouseEvent(canvas, event, pointers, setCursor);

      // 포인터를 그랩하고 움직일 경우에 대한 처리를 해줌
      const { x, y } = findPosition(canvas, event);
      const pointer = findPointer(x, y, pointers);
      if (pointer == null || event.buttons !== 1) {
        // do nothing
      } else {
        // 포인터를 그랩하며 움직이는 경우
        // 해당 위치에 새로운 포인터를 만들어 준 후, 기존 포인터를 수정해줌
        const newPointer = { ...pointer, x, y };
        editPointer(newPointer, pointers, setPointers, setActivePointer);
      }
    };

    // 이벤트 리스너를 캔버스에 추가
    canvas.addEventListener('mousedown', onMouseDown as EventListener);
    canvas.addEventListener('mouseup', onMouseUp as EventListener);
    canvas.addEventListener('mousemove', onMouseMove as EventListener);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown as EventListener);
      canvas.removeEventListener('mouseup', onMouseUp as EventListener);
      canvas.removeEventListener('mousemove', onMouseMove as EventListener);
    };
  }, [pointers]);
  //// end of canvas에 포인터 관련 이벤트 설정

  return (
    <section className="flex flex-col gap-6">
      <h3
        style={{
          fontWeight: 600,
          fontSize: '1.2rem',
          lineHeight: '1.5rem',
        }}
      >
        마커 에디터
      </h3>
      <section className="flex flex-row gap-5">
        <FormItem
          width="200px"
          label="이름"
          labelPosition="top"
          type="textBox"
          value={name}
          onValueChange={onNameChange}
        />
        <FormItem
          width="60px"
          label="색상"
          labelPosition="top"
          type="colorBox"
          value={color}
          onValueChange={onColorChange}
        />
        <FormItem
          width="180px"
          label="종류"
          labelPosition="top"
          type="radioGroup"
          value={category}
          onValueChange={onCategoryChange}
          editorProps={{
            items: [
              { value: 'ceiling', text: '천장' },
              { value: 'wall', text: '벽' },
              { value: 'floor', text: '바닥' },
            ],
          }}
        />
        <FormItem
          type="pointerBox"
          label="포인터"
          labelPosition="top"
          value={activePointer}
          onValueChange={onPointerChange}
          editorProps={{
            xMax: 400,
            yMax: 400,
          }}
        />
      </section>
      <div className="flex flex-row justify-end" style={{ gap: '10px' }}>
        <Button
          size={'sm'}
          style={{ width: '100px' }}
          isDisabled={!hasChanges}
          onClick={onRevertButtonClick}
        >
          되돌리기
        </Button>
        <Button
          size={'sm'}
          style={{ width: '100px' }}
          isDisabled={!hasChanges}
          onClick={onSaveButtonClick}
        >
          저장
        </Button>
      </div>
    </section>
  );
}

function findPosition(canvas: HTMLCanvasElement, mouseEvent: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: mouseEvent.clientX - rect.left,
    y: mouseEvent.clientY - rect.top,
  };
}

function findPointer(x: number, y: number, pointers: Pointer[]) {
  return pointers.find((p) => {
    const squaredDistance = (p.x - x) ** 2 + (p.y - y) ** 2;
    return squaredDistance <= 8 ** 2;
  });
}

function setCursorWithMouseEvent(
  canvas: HTMLCanvasElement,
  mouseEvent: MouseEvent,
  pointers: Pointer[],
  setCursor: Dispatch<SetStateAction<'default' | 'grab' | 'grabbing'>>
) {
  const { x, y } = findPosition(canvas, mouseEvent);
  const pointer = findPointer(x, y, pointers);

  if (mouseEvent.type === 'mouseup') {
    if (pointer == null) {
      setCursor('default');
    } else {
      setCursor('grab');
    }
  } else if (mouseEvent.type === 'mousemove') {
    if (pointer == null) {
      setCursor('default');
    } else if (mouseEvent.buttons === 1) {
      // 끌면서 움직일 때,
      setCursor('grabbing');
    } else {
      setCursor('grab');
    }
  } else if (mouseEvent.type === 'mousedown') {
    if (pointer == null) {
      // do nothing
    } else {
      setCursor('grabbing');
    }
  } else {
    ErrUtil.assert(false);
  }
}

function editPointer(
  newPointer: Pointer,
  pointers: Pointer[],
  setPointers: Dispatch<SetStateAction<Pointer[]>>,
  setActivePointer: Dispatch<SetStateAction<Pointer | null>>
) {
  setPointers(
    pointers.map((pointer) => {
      if (pointer.id != newPointer.id) return pointer;
      else return newPointer;
    })
  );
  setActivePointer(newPointer);
}
