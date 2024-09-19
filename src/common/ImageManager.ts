import { EventEmitter } from 'events';
import ErrUtil from './ErrUtil';
import Marker from './Marker';
import Lodash from 'lodash';

const colors = [
  '#A1D6B2',
  '#CEDF9F',
  '#F1F3C2',
  '#E8B86D',
  '#C96868',
  '#FADFA1',
  '#FFF4EA',
  '#7EACB5',
  '#7695FF',
  '#9DBDFF',
];

class ImageManager extends EventEmitter {
  private imageFile: File;
  private markers: Marker[];
  private activeMarker: Marker | null;
  private markInfo: Object;
  private categories: string[];

  constructor(imageFile: File) {
    super();
    this.imageFile = imageFile;
    this.categories = ['ceiling', 'wall', 'floor'];
    this.markers = [
      new Marker(Lodash.uniqueId(), '천장', colors[0], this.categories[0]),
      new Marker(Lodash.uniqueId(), '벽', colors[1], this.categories[1]),
      new Marker(Lodash.uniqueId(), '바닥', colors[2], this.categories[2]),
    ];
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
  showImage(canvas: HTMLCanvasElement, inMark?: boolean): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found!');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(this.imageFile);

    img.onload = () => {
      // mark 단계에서는 이미지를 약간 불투명하게 그림
      if (inMark) {
        ctx.globalAlpha = 0.4;
      }
      // 이미지 그리기
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 메모리 해제
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  // 캔버스에 마커로 표시하는 메소드
  markCanvas(
    canvas: HTMLCanvasElement,
    event: React.MouseEvent<HTMLCanvasElement>
  ): void {
    if (this.activeMarker == null) {
      ErrUtil.assert(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      ErrUtil.assert(false);
      return;
    }

    // 원 그리기
    ctx.beginPath(); // 새로운 경로 시작

    // target 요소의 위치와 크기를 가져옴
    const rect = canvas.getBoundingClientRect();
    // target 요소 내에서의 상대적인 마우스 좌표 계산
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.fillRect(x, y, 10, 10); // x좌표 100, y좌표 100, 반지름 2, 0부터 2*PI 라디안까지 원 그리기
    ctx.fillStyle = this.activeMarker.color; // 채우기 색상을 빨간색으로 설정
    ctx.fill(); // 경로를 채우기
    ctx.closePath(); // 경로 닫기
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
    // 마커 업데이트
    this.markers = [...this.markers];
    this.emit('markersChange', this.markers);

    // activeMarker 업데이트 (화면이 갱신되도록 일단 새걸로 넣었는데, 이거 갱신을 이런 식으로 하면 안 될 것 같음..)
    if (this.activeMarker) {
      this.activeMarker = new Marker(
        this.activeMarker.id,
        this.activeMarker.name,
        this.activeMarker.color,
        this.activeMarker.category
      );
      this.emit('activeMarkerChange', this.activeMarker);
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
