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
