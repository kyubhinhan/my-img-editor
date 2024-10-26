'use client';

import { Marker, Pointer } from '../common/MarkerUtil';

import ImageUtil from '../common/ImageUtil';
import MarkerUtil from '../common/MarkerUtil';
import ErrUtil from '../common/ErrUtil';

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from 'react';
import MarkerEditor from './markerEditor';

type PropsType = {
  image: HTMLImageElement;
  markersState: [
    markers: Marker[],
    setMarkers: Dispatch<SetStateAction<Marker[]>>,
  ];
  activeMarkerState: [
    activeMarker: Marker | null,
    setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  ];
  setActiveMarkerHasChanges: Dispatch<SetStateAction<boolean>>;
  markerPositionState: [
    markerPosition: { [key: string]: string },
    setMarkerPosition: Dispatch<SetStateAction<{ [key: string]: string }>>,
  ];
};

export default function ImageMarkLeft({
  image,
  markersState,
  activeMarkerState,
  setActiveMarkerHasChanges,
  markerPositionState,
}: PropsType) {
  //// marker들 관련
  const [markers, setMarkers] = markersState;
  const [activeMarker, setActiveMarker] = activeMarkerState;
  const [markerPosition, setMarkerPosition] = markerPositionState;
  const [currentActiveMarker, setCurrentActiveMarker] = useState<Marker | null>(
    null
  );
  const [activePointer, setActivePointer] = useState<Pointer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // activeMarker가 갱신되었는지 여부를 판단해줌
  const activeMarkerHasChanges = useMemo(() => {
    if (activeMarker == null || currentActiveMarker == null) return false;
    else {
      const isDifferentPointers = (() => {
        if (activeMarker.pointers.length != currentActiveMarker.pointers.length)
          return true;
        else
          return activeMarker.pointers.some((pointer) => {
            const currentPointer = currentActiveMarker.pointers.find(
              (cPointer) => cPointer.id == pointer.id
            );
            if (currentPointer == null) return true;
            else
              return (
                pointer.x != currentPointer.x || pointer.y != currentPointer.y
              );
          });
      })();
      return (
        activeMarker.name != currentActiveMarker.name ||
        activeMarker.color != currentActiveMarker.color ||
        activeMarker.category != currentActiveMarker.category ||
        isDifferentPointers
      );
    }
  }, [activeMarker, currentActiveMarker]);

  useEffect(() => {
    setActiveMarkerHasChanges(activeMarkerHasChanges);
  }, [activeMarkerHasChanges]);

  // activeMarker가 변할 때마다, tempActiveMarker도 갱신해줌
  useEffect(() => {
    setCurrentActiveMarker(activeMarker);
    setActivePointerWithActiveMarker(activeMarker, setActivePointer);
  }, [activeMarker]);

  // 관련된 인자가 변할 때마다, 마커들을 다시 그려줌
  useEffect(() => {
    if (canvasRef.current == null) {
      // do nothing
    } else {
      ImageUtil.drawMarkers(
        canvasRef.current,
        image,
        markers,
        currentActiveMarker,
        activePointer
      );
    }
  }, [canvasRef, markers, currentActiveMarker, activePointer]);

  const onSaveButtonClicked = () => {
    if (currentActiveMarker == null) {
      ErrUtil.assert(false);
    } else {
      const markerArea = ImageUtil.createMarkerArea(
        currentActiveMarker.pointers
      );

      // activeMarker 갱신
      setActiveMarker(currentActiveMarker);
      // markers 갱신
      setMarkers(
        markers.map((marker) => {
          if (marker.id == currentActiveMarker?.id) {
            return currentActiveMarker;
          } else {
            return marker;
          }
        })
      );
    }
  };
  const onRevertButtonClicked = () => {
    // currentActiveMarker을 원래대로 되돌려 줌
    setCurrentActiveMarker(activeMarker);
    setActivePointerWithActiveMarker(activeMarker, setActivePointer);
  };
  //// end of marker들 관련

  //// canvas 관련
  const [cursor, setCursor] = useState<'default' | 'grab' | 'grabbing'>(
    'default'
  );
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const onMouseDown = (event: MouseEvent) => {
    if (canvasRef.current == null || currentActiveMarker == null) return;

    const canvas = canvasRef.current;
    const pointers = currentActiveMarker.pointers;

    // mouse cursor 모양을 변경해줌
    setCursorWithMouseEvent(canvas, event, pointers, setCursor);

    const { x, y } = findPosition(canvas, event);

    // activePointer 관련 처리를 해줌
    const pointer = findPointer(x, y, pointers);
    if (pointer != null) {
      setActivePointer(pointer);
    } else {
      // 기존 포인터가 없었을 경우,
      // 다각형의 내부에 있는지 판단해줌
      const isInPolyGon = ImageUtil.isPositionInPolyGon({ x, y }, pointers);
      if (isInPolyGon) {
        // 다각형의 내부에 있을 때,
        setStartPosition({ x, y });
      } else {
        // 다각형의 외부에 있을 때, 새로운 포인터를 만들고, 이 포인터를 activePointer로 설정
        const newPointer = MarkerUtil.createPointer({ x, y });
        setCurrentActiveMarker({
          ...currentActiveMarker,
          pointers: [...currentActiveMarker.pointers, newPointer],
        });
        setActivePointer(newPointer);
      }
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    if (canvasRef.current == null || currentActiveMarker == null) return;

    setCursorWithMouseEvent(
      canvasRef.current,
      event,
      currentActiveMarker.pointers,
      setCursor
    );
  };

  const onMouseMove = (event: MouseEvent) => {
    if (canvasRef.current == null || currentActiveMarker == null) return;

    const canvas = canvasRef.current;
    const pointers = currentActiveMarker.pointers;

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
      editPointer(
        newPointer,
        currentActiveMarker,
        setCurrentActiveMarker,
        setActivePointer
      );
    }

    // 내부 영역을 그랩하고 움직일 경우에 대한 처리를 해줌
    const isInPolyGon = ImageUtil.isPositionInPolyGon({ x, y }, pointers);
    // 내부에 있고, pointer가 아니며, 왼쪽 버튼을 누르고 이동 중일 때,
    if (isInPolyGon && pointer == null && event.buttons === 1) {
      const distanceX = x - startPosition.x;
      const distanceY = y - startPosition.y;

      // 이동하였을 때, 모든 포인터들이 canvas 내부에 있는지 판단해줌
      const isInCanvas = (() => {
        // canvas의 width와 height를 구해줌
        const { width, height } = canvas.getBoundingClientRect();

        // 최소 x,y 최대 x,y 값을 구해줌
        let minX = pointers[0].x,
          maxX = pointers[0].x,
          minY = pointers[0].y,
          maxY = pointers[0].y;
        pointers.forEach((pointer) => {
          if (minX > pointer.x) {
            minX = pointer.x;
          }
          if (maxX < pointer.x) {
            maxX = pointer.x;
          }
          if (minY > pointer.y) {
            minY = pointer.y;
          }
          if (maxY < pointer.y) {
            maxY = pointer.y;
          }
        });

        return (
          minX + distanceX >= 0 &&
          maxX + distanceX <= width &&
          minY + distanceY >= 0 &&
          maxY + distanceY <= height
        );
      })();

      if (isInCanvas) {
        const newPointers = pointers.map((pointer) => ({
          id: pointer.id,
          x: pointer.x + distanceX,
          y: pointer.y + distanceY,
        }));
        setCurrentActiveMarker({
          ...currentActiveMarker,
          pointers: newPointers,
        });
        setActivePointer(
          newPointers.find((pointer) => pointer.id == activePointer?.id) ?? null
        );
      } else {
        // do nothing
      }

      setStartPosition({ x, y });
    }
  };

  //// end of canvas 관련

  return (
    <section className="h-full flex flex-col items-center">
      <MarkerEditor
        currentMarkerState={[currentActiveMarker, setCurrentActiveMarker]}
        activePointerState={[activePointer, setActivePointer]}
        activeMarkerHasChanges={activeMarkerHasChanges}
        onSaveButtonClicked={onSaveButtonClicked}
        onRevertButtonClicked={onRevertButtonClicked}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ cursor }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      ></canvas>
    </section>
  );
}

function setCursorWithMouseEvent(
  canvas: HTMLCanvasElement,
  mouseEvent: MouseEvent,
  pointers: Pointer[],
  setCursor: Dispatch<SetStateAction<'default' | 'grab' | 'grabbing'>>
) {
  const { x, y } = findPosition(canvas, mouseEvent);
  const pointer = findPointer(x, y, pointers);
  const isInPolyGon = ImageUtil.isPositionInPolyGon({ x, y }, pointers);
  const needResetCursor = pointer == null && !isInPolyGon;

  if (mouseEvent.type === 'mouseup') {
    if (needResetCursor) {
      setCursor('default');
    } else {
      setCursor('grab');
    }
  } else if (mouseEvent.type === 'mousemove') {
    if (needResetCursor) {
      setCursor('default');
    } else if (mouseEvent.buttons === 1) {
      // 끌면서 움직일 때,
      setCursor('grabbing');
    } else {
      setCursor('grab');
    }
  } else if (mouseEvent.type === 'mousedown') {
    if (needResetCursor) {
      // do nothing
    } else {
      setCursor('grabbing');
    }
  } else {
    ErrUtil.assert(false);
  }
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

function editPointer(
  newPointer: Pointer,
  activeMarker: Marker,
  setActiveMarker: Dispatch<SetStateAction<Marker | null>>,
  setActivePointer: Dispatch<SetStateAction<Pointer | null>>
) {
  setActiveMarker({
    ...activeMarker,
    pointers: activeMarker.pointers.map((pointer) => {
      if (pointer.id == newPointer.id) return newPointer;
      else return pointer;
    }),
  });
  setActivePointer(newPointer);
}

function setActivePointerWithActiveMarker(
  activeMarker: Marker | null,
  setActivePointer: Dispatch<SetStateAction<Pointer | null>>
) {
  if (activeMarker == null || activeMarker.pointers.length == 0) {
    setActivePointer(null);
  } else {
    setActivePointer(activeMarker.pointers[activeMarker.pointers.length - 1]);
  }
}
