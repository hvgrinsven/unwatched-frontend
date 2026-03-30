export async function compressImage(file: File | Blob, maxBytes = 1024 * 1024): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const maxDim = 1920;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      let quality = 0.85;
      const probeer = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error("Canvas toBlob mislukt")); return; }
            if (blob.size <= maxBytes || quality <= 0.3) {
              resolve(blob);
            } else {
              quality = Math.round((quality - 0.1) * 10) / 10;
              probeer();
            }
          },
          "image/jpeg",
          quality
        );
      };
      probeer();
    };

    img.onerror = () => reject(new Error("Afbeelding laden mislukt"));
    img.src = objectUrl;
  });
}
