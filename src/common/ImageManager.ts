import { EventEmitter } from 'events';
import ErrUtil from './ErrUtil';
import Marker from './Marker';
import Lodash from 'lodash';

class ImageManager extends EventEmitter {
  private imageFile: File;
  private markers: Marker[];
  private activeMarker: Marker | null;
  private markInfo: Object;

  constructor(imageFile: File) {
    super();
    this.imageFile = imageFile;
    this.markers = [
      new Marker(Lodash.uniqueId(), '천장'),
      new Marker(Lodash.uniqueId(), '벽'),
      new Marker(Lodash.uniqueId(), '바닥'),
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

  // 캔버스에 이미지를 표시하는 메소드
  showImage(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found!');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(this.imageFile);

    img.onload = () => {
      // 이미지 그리기
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 메모리 해제
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  getActiveMarker() {
    return this.activeMarker;
  }

  setActiveMarker(marker: Marker | null) {
    this.activeMarker = marker;
    this.emit('activeMarkerChange', marker); // 이벤트 발생
  }

  getMarkers() {
    return this.markers;
  }

  // marker를 추가하는 메소드
  addMarker() {
    this.markers = [
      ...this.markers,
      new Marker(Lodash.uniqueId(), `마커 번호 ${this.markers.length}`),
    ];
    this.emit('markersChange', this.markers); // 이벤트 발생
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
