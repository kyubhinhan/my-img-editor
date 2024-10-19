import ErrUtil from './ErrUtil';

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

  // canvas에 이미지를 그려주는 함수
  showImage: (
    canvas: HTMLCanvasElement,
    imageFile: File,
    needBlur?: Boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      ErrUtil.assert(false, 'canvas의 context가 없습니다.');
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(imageFile);
    img.src = url;

    img.onload = () => {
      // needBlur가 true일 때, 이미지를 약간 흐리게 표시함
      if (needBlur) {
        ctx.filter = 'opacity(50%)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
      } else {
        // 이미지 그리기
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // 메모리 해제
      URL.revokeObjectURL(url);
    };
  },
};

Object.freeze(ImageUtil);
export default ImageUtil;
