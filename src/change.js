// export default  (shiftKey, originalEvent) => {
//       const {coords, shiftKey, originalEvent, limited}
//       const {endX, endX2, startX, startX2, startY, startY2, endY, endY2} = coords;

//       const options = this.options;
//       let aspectRatio = options.aspectRatio;
//       let action = this.action;
//       const container = this.container;
//       const canvas = this.canvas;
//       const cropBox = this.cropBox;
//       let width = cropBox.width;
//       let height = cropBox.height;
//       let left = cropBox.left;
//       let top = cropBox.top;
//       const right = left + width;
//       const bottom = top + height;
//       let minLeft = 0;
//       let minTop = 0;
//       let maxWidth = container.width;
//       let maxHeight = container.height;
//       let renderable = true;
//       let offset;
//       let range;

//       // Locking aspect ratio in "free mode" by holding shift key (#259)
//       if (!aspectRatio && shiftKey) {
//         aspectRatio = width && height ? width / height : 1;
//       }

//       if (limited) {
//         minLeft = cropBox.minLeft;
//         minTop = cropBox.minTop;
//         maxWidth = minLeft + Math.min(container.width, canvas.width);
//         maxHeight = minTop + Math.min(container.height, canvas.height);
//       }

//       range = {
//         x: endX - startX,
//         y: endY - startY
//       };

//       if (aspectRatio) {
//         range.X = range.y * aspectRatio;
//         range.Y = range.x / aspectRatio;
//       }

//       switch (action) {
//         // Move crop box


//       }

//       // if (renderable) {
//       //   cropBox.width = width;
//       //   cropBox.height = height;
//       //   cropBox.left = left;
//       //   cropBox.top = top;
//       //   this.action = action;

//       //   this.renderCropBox();
//       // }

//       // Override
//       // startX = endX;
//       // startY = endY;
//     }
//   });
