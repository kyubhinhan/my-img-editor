const ImageUtil = {};

ImageUtil.resizeImage = (file, _targetWidth, _targetHeight) => {
  const targetWidth = _targetWidth ?? 720;
  const targetHeight = _targetHeight ?? 460;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Create a canvas element to draw the resized image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set the canvas to the new dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the resized image onto the canvas
        context.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert the canvas to a data URL (base64 string)
        canvas.toBlob((blob) => {
          resolve(blob);
        }, file.type);
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

Object.freeze(ImageUtil);
export default ImageUtil;
