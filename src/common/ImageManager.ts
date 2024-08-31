class ImageManager {
  private imageFile: File;

  constructor(imageFile: File) {
    this.imageFile = imageFile;
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
