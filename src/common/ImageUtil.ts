import ErrUtil from './ErrUtil';
import { Marker, Pointer } from './MarkerUtil';
import { Dispatch, SetStateAction } from 'react';

const ImageUtil = {
  // Image와 관련된 정보를 제공하는 함수
  createImageInfo: (imageFile: File) => {
    const name = imageFile.name;

    // type 구함
    const type = (() => {
      const result = imageFile.type;
      return result.split('/')[1];
    })();

    // size 구함
    const size = (() => {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const bytes = imageFile.size;
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    })();

    // 최근 수정 일자 구함
    const lastModifiedDate = (() => {
      const lastModifiedDate = new Date(imageFile.lastModified);
      return lastModifiedDate.toLocaleString('ko-KR', { timeZone: 'UTC' });
    })();

    return {
      name,
      type,
      size,
      lastModifiedDate,
    };
  },

  loadImage: (
    imageFile: File,
    setImage: Dispatch<SetStateAction<HTMLImageElement | null>>
  ) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    img.src = url;
    img.onload = () => {
      setImage(img);
      // 메모리 해제
      URL.revokeObjectURL(url);
    };
  },

  drawImage: (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    needBlur?: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      ErrUtil.assert(false, 'canvas의 context가 없습니다.');
      return;
    }

    // 그리기 전에 먼저 canvas를 초기화해준다.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // needBlur가 true일 때, 이미지를 약간 흐리게 표시함
    if (needBlur) {
      ctx.filter = 'opacity(50%)';
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    } else {
      // 이미지 그리기
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  },

  // canvas에 마커들을 그려주는 함수
  drawMarkers: (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    markers: Marker[],
    activeMarker: Marker | null,
    activePointer: Pointer | null
  ) => {
    // 마커들을 그리기 전에 먼저, 이미지를 약간 흐리게 그려줌
    ImageUtil.drawImage(canvas, image, true);

    // 마커들을 그려줌
    if (activeMarker) {
      // activeMarker가 있을 경우
      // marker들 중 activeMarker는 activeMarker의 정보로 그리고,
      // 나머지는 저장된 정보로 그리며, 이때 색은 모두 회색으로 그려준다.
      markers.forEach((marker) => {
        if (marker.id == activeMarker.id) {
          drawPointersInMark(
            canvas,
            activeMarker.pointers,
            activePointer,
            activeMarker.color
          );
        } else {
          drawPointersInMark(canvas, marker.pointers, null, 'grey');
        }
      });
    } else {
      // activeMarker가 없을 경우,
      // marker들에 저장되어 있는 포인터들을 그려줌
      markers.forEach((marker) => {
        drawPointersInMark(canvas, marker.pointers, null, marker.color);
      });
    }
  },

  // edit 단계에서 마커들을 이미지에 그려주는 함수
  drawMarkersInEdit: (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    markers: Marker[],
    activeMarker: Marker | null
  ) => {
    // 마커들을 그리기 전에 먼저, 이미지를 약간 흐리게 그려줌
    ImageUtil.drawImage(canvas, image, true);

    markers.forEach((marker) => {
      if (marker.id == activeMarker?.id) {
        drawPointersInEdit(canvas, marker.pointers, marker.color);
      } else {
        drawPointersInEdit(canvas, marker.pointers, 'grey');
      }
    });
  },

  // 점이 polyGon 내에 있는지 판단해주는 함수
  isPositionInPolyGon: (
    position: { x: number; y: number },
    pointers: Pointer[]
  ) => {
    // 점이 3개보다 작으면 다각형을 만들지 못하기 때문에 false를 return함
    if (pointers.length < 3) return false;

    const vertices = getVerticesForMark(pointers);
    const x = position.x,
      y = position.y;
    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      // 첫번째 점의 경우, 마지막 점과
      // 그 다음 점의 경우, 바로 이전의 점을 기준으로 봄
      // 모든 변에 대해서 교차하는지 판단해줌
      const xi = vertices[i].x,
        yi = vertices[i].y;
      const xj = vertices[j].x,
        yj = vertices[j].y;

      // position에서 오른쪽으로 직선을 그었을 때, 두 점으로 만든 변과 만나는 조건은 아래와 같다.
      // position의 y 좌표가 두 점의 사이에 있어야 하고
      // position의 x 좌표가 두 점으로 만든 변과 직선이 만나는 점보다 왼쪽에 있어야 함
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      // 홀수변 교차하면 내부에 있는 것이고, 짝수번이면 외부에 있는 것이다.
      if (intersect) inside = !inside;
    }

    return inside;
  },

  createMarkerArea: (pointers: Pointer[]) => {
    type Position = { x: number; y: number };
    const markerArea: Position[] = [];

    // 점이 3개 보다 작을 때 빠른 return을 함
    if (pointers.length < 3) return markerArea;

    // 점들이 포함된 사각형의 좌표를 구해줌
    const rect = (() => {
      let minX = 0;
      let maxX = 0;
      let minY = 0;
      let maxY = 0;
      pointers.forEach((pointer, index) => {
        if (index == 0) {
          minX = pointer.x;
          maxX = pointer.x;
          minY = pointer.y;
          maxY = pointer.y;
        } else {
          if (pointer.x < minX) {
            minX = pointer.x;
          }
          if (pointer.x > maxX) {
            maxX = pointer.x;
          }
          if (pointer.y < minY) {
            minY = pointer.y;
          }
          if (pointer.y > maxY) {
            maxY = pointer.y;
          }
        }
      });
      return { minX, maxX, minY, maxY };
    })();

    // 사각형을 돌면서 사각형 내의 좌표들 중 Marker에 속한 좌표를 구해줌
    for (let x: number = rect.minX; x <= rect.maxX; x++) {
      for (let y: number = rect.minY; y <= rect.maxY; y++) {
        if (ImageUtil.isPositionInPolyGon({ x, y }, pointers)) {
          markerArea.push({ x, y });
        }
      }
    }

    return markerArea;
  },
};

Object.freeze(ImageUtil);
export default ImageUtil;

function drawPointersInMark(
  canvas: HTMLCanvasElement,
  pointers: Pointer[],
  activePointer: Pointer | null,
  color: string
) {
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    ErrUtil.assert(false);
    return;
  }

  // activePointer가 있을 경우, 이를 강조해줌(일단 외부에 원을 추가하는 식으로 강조)
  if (activePointer) {
    ctx.beginPath();
    ctx.arc(activePointer.x, activePointer.y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // 해당 위치에 점을 먼저 찍어줌
  const verticesForMark = getVerticesForMark(pointers);
  verticesForMark.forEach((vertex) => {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  });

  // 해당 점들을 이어줌
  ctx.beginPath();
  verticesForMark.forEach((vertex, index) => {
    if (index == 0) {
      ctx.moveTo(vertex.x, vertex.y);
    } else {
      ctx.lineTo(vertex.x, vertex.y);
    }
  });
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();

  // 점들을 이은 부분을 채워줌
  ctx.beginPath();
  verticesForMark.forEach((vertex, index) => {
    if (index == 0) {
      ctx.moveTo(vertex.x, vertex.y);
    } else {
      ctx.lineTo(vertex.x, vertex.y);
    }
  });
  ctx.closePath();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPointersInEdit(
  canvas: HTMLCanvasElement,
  pointers: Pointer[],
  color: string
) {
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    ErrUtil.assert(false);
    return;
  }

  const verticesForMark = getVerticesForMark(pointers);
  ctx.beginPath();
  verticesForMark.forEach((vertex, index) => {
    if (index == 0) {
      ctx.moveTo(vertex.x, vertex.y);
    } else {
      ctx.lineTo(vertex.x, vertex.y);
    }
  });
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
}

function getVerticesForMark(pointers: Pointer[]) {
  const vertices = [...pointers];
  // y 좌표를 기준으로 오른쪽 아래에 있는 것이 가장 먼저 오도록 정렬
  vertices.sort((a, b) => (a.y == b.y ? b.x - a.x : b.y - a.y));
  // 첫번째 점을 시작점으로 설정
  const startPointer = vertices[0];
  // 시작점을 기준으로 반시계방향으로 정렬
  vertices.sort((a, b) => {
    const angleA = Math.atan2(a.y - startPointer.y, a.x - startPointer.x);
    const angleB = Math.atan2(b.y - startPointer.y, b.x - startPointer.x);
    return angleA - angleB;
  });
  return vertices;
}
