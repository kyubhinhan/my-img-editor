import { EventEmitter } from 'events';
import ErrUtil from './ErrUtil';
import Marker, { Pointer } from './Marker';
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
      this.drawPointers(canvas, marker.pointers, marker.color);
    });
  }

  drawPointers(canvas: HTMLCanvasElement, pointers: Pointer[], color: string) {
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      ErrUtil.assert(false);
      return;
    }

    // 해당 위치에 점을 먼저 찍어줌
    pointers.forEach((pointer) => {
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // 해당 점들을 이어줌
    ctx.beginPath();
    pointers.forEach((pointer, index) => {
      if (index == 0) {
        ctx.moveTo(pointer.x, pointer.y);
      } else {
        ctx.lineTo(pointer.x, pointer.y);
      }
    });
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();

    // 점들을 이은 부분을 채워줌
    ctx.beginPath();
    pointers.forEach((pointer, index) => {
      if (index == 0) {
        ctx.moveTo(pointer.x, pointer.y);
      } else {
        ctx.lineTo(pointer.x, pointer.y);
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
