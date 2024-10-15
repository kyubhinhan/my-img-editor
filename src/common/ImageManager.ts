import { EventEmitter } from 'events';
import ErrUtil from './ErrUtil';
import Marker, { Pointer } from './Marker';
import Lodash from 'lodash';

const colors = [
  '#FF0000',
  '#0000FF',
  '#00FF00',
  '#FFFF00',
  '#FFA500',
  '#800080',
  '#00FFFF',
  '#FF00FF',
  '#BFFF00',
  '#A52A2A',
];

class ImageManager extends EventEmitter {
  private imageFile: File;
  private markers: Marker[];
  private activeMarker: Marker | null;
  private markInfo: Object;
  private categories: string[];
  private imageElement: HTMLImageElement;

  constructor(imageFile: File) {
    super();
    this.imageFile = imageFile;
    this.categories = ['ceiling', 'wall', 'floor'];
    this.markers = [
      new Marker(Lodash.uniqueId(), '천장', colors[0], this.categories[0]),
      new Marker(Lodash.uniqueId(), '벽', colors[1], this.categories[1]),
      new Marker(Lodash.uniqueId(), '바닥', colors[2], this.categories[2]),
    ];
    this.imageElement = new Image();
    // 활성 마커
    this.activeMarker = this.markers[0];

    // 이미지에 표시된 마킹 정보
    this.markInfo = {};
  }

  // 이미지 정보를 반환하는 메소드
  getImageInfo(): {
    name: string;
    type: string;
    size: string;
    lastModifiedDate: string;
  } {
    return {
      name: this.imageFile.name,
      type: getFileType(this.imageFile),
      size: getFileSize(this.imageFile),
      lastModifiedDate: getFileLMD(this.imageFile),
    };
  }

  getCategories() {
    return this.categories;
  }

  // 캔버스에 이미지를 표시하는 메소드
  showImage(canvas: HTMLCanvasElement, inMark: boolean): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found!');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(this.imageFile);

    img.onload = () => {
      if (inMark) {
        // Mark에서 처음에 약간 투명하게 표시함
        ctx.filter = 'opacity(50%)';
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 다시 filter를 초기화해줌
        ctx.filter = 'none';
      } else {
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // 메모리 해제
      URL.revokeObjectURL(url);
    };

    img.src = url;
    this.imageElement = img;
  }

  drawImage(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      ErrUtil.assert(false);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = 'opacity(50%)';
    ctx.drawImage(this.imageElement, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
  }

  // 캔버스에 마커들을 그려주는 메소드
  drawMarker(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      ErrUtil.assert(false);
      return;
    }

    this.drawImage(canvas);
    this.markers.forEach((marker) => {
      this.drawPointers(canvas, marker.pointers, null, marker.color);
    });
  }

  drawPointers(
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

  getActiveMarker() {
    return this.activeMarker;
  }

  setActiveMarker(markerId: string | null) {
    if (markerId) {
      const targetMarker = this.markers.find((marker) => marker.id == markerId);
      if (targetMarker) {
        this.activeMarker = targetMarker;
        this.emit('activeMarkerChange', this.activeMarker); // 이벤트 발생
      } else {
        ErrUtil.assert(false);
      }
    } else {
      this.activeMarker = null;
      this.emit('activeMarkerChange', this.activeMarker);
    }
  }

  getMarkers() {
    return this.markers;
  }

  // marker를 추가하는 메소드
  addMarker() {
    const newMarkerId = Lodash.uniqueId();
    this.markers = [
      ...this.markers,
      new Marker(
        newMarkerId,
        `마커 번호 ${this.markers.length}`,
        colors[this.markers.length % 10],
        this.categories[0]
      ),
    ];
    this.emit('markersChange', this.markers); // 이벤트 발생
    return newMarkerId;
  }

  // marker를 제거하는 메소드
  deleteMarker(id: string) {
    ErrUtil.assert(
      this.markers.some((marker) => marker.id == id),
      '잘못된 id입니다.'
    );
    this.markers = this.markers.filter((marker) => marker.id != id);
    this.emit('markersChange', this.markers); // 이벤트 발생
    if (this.activeMarker?.id == id) {
      // 제거되는 marker가 activeMarker였을 경우, activeMarker로 비워줌
      this.setActiveMarker(null);
    }
  }

  // marker 수정 이벤트를 올림
  emitChangeMarker() {
    if (this.activeMarker != null) {
      // activeMarker가 존재해야 함
      // reat의 reactive system을 사용하기 위해서 새롭게 할당해줌(더 좋은 방법을 찾으면 변경할 것)
      this.activeMarker = new Marker(
        this.activeMarker.id,
        this.activeMarker.name,
        this.activeMarker.color,
        this.activeMarker.category,
        this.activeMarker.pointers
      );
      this.emit('activeMarkerChange', this.activeMarker);

      // 전체 마커들 업데이트
      this.markers = this.markers.map((marker) => {
        if (marker.id != this.activeMarker?.id) return marker;
        else return this.activeMarker;
      });
      this.emit('markersChange', this.markers);
    } else {
      ErrUtil.assert(false);
    }
  }
}

export default ImageManager;

function getFileType(imageFile: File) {
  const type = imageFile.type;
  return type.split('/')[1];
}

function getFileSize(imageFile: File) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const bytes = imageFile.size;
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function getFileLMD(imageFile: File) {
  const lastModifiedDate = new Date(imageFile.lastModified);
  return lastModifiedDate.toLocaleString('ko-KR', { timeZone: 'UTC' });
}

function getVerticesForMark(pointers: Pointer[]) {
  const vertices = [...pointers];
  // y 좌표를 기준으로 왼쪽 아래에 있는 것이 가장 먼저 오도록 정렬
  vertices.sort((a, b) => (a.y == b.y ? a.x - b.x : b.y - a.y));
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

function isPositionInPolyGon(
  position: { x: number; y: number },
  pointers: Pointer[]
) {
  // 점이 3개보다 작으면 다각형을 만들지 못하기 때문에 false를 return함
  if (pointers.length < 3) return false;

  const vertices = getVerticesForMark(pointers);
  let x = position.x,
    y = position.y;
  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    // 첫번째 점의 경우, 마지막 점과
    // 그 다음 점의 경우, 바로 이전의 점을 기준으로 봄
    // 모든 변에 대해서 교차하는지 판단해줌
    let xi = vertices[i].x,
      yi = vertices[i].y;
    let xj = vertices[j].x,
      yj = vertices[j].y;

    // position에서 오른쪽으로 직선을 그었을 때, 두 점으로 만든 변과 만나는 조건은 아래와 같다.
    // position의 y 좌표가 두 점의 사이에 있어야 하고
    // position의 x 좌표가 두 점으로 만든 변과 직선이 만나는 점보다 왼쪽에 있어야 함
    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    // 홀수변 교차하면 내부에 있는 것이고, 짝수번이면 외부에 있는 것이다.
    if (intersect) inside = !inside;
  }

  return inside;
}
