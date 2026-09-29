export function createLandscapeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const width = 1600;
        const height = 900;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Impossible de créer le contexte Canvas."));
          return;
        }

        // =========================
        // ARRIÈRE-PLAN FLOU
        // =========================

        context.save();

        context.filter = "blur(30px)";

        const backgroundScale = Math.max(
          width / image.width,
          height / image.height,
        );

        const backgroundWidth = image.width * backgroundScale;

        const backgroundHeight = image.height * backgroundScale;

        const backgroundX = (width - backgroundWidth) / 2;

        const backgroundY = (height - backgroundHeight) / 2;

        context.drawImage(
          image,
          backgroundX,
          backgroundY,
          backgroundWidth,
          backgroundHeight,
        );

        context.restore();

        // =========================
        // IMAGE ORIGINALE AU CENTRE
        // =========================

        const foregroundScale = height / image.height;

        const foregroundWidth = image.width * foregroundScale;

        const foregroundHeight = height;

        const foregroundX = (width - foregroundWidth) / 2;

        const foregroundY = 0;

        context.drawImage(
          image,
          foregroundX,
          foregroundY,
          foregroundWidth,
          foregroundHeight,
        );

        // =========================
        // EXPORT
        // =========================

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Impossible de générer l'image."));
              return;
            }

            const newFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, ".webp"),
              {
                type: "image/webp",
              },
            );

            resolve(newFile);
          },
          "image/webp",
          0.9,
        );
      };

      image.onerror = () => {
        reject(new Error("Impossible de charger l'image."));
      };

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error("Impossible de lire le fichier."));
    };

    reader.readAsDataURL(file);
  });
}
