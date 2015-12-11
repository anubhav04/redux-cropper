// TODO as it returns correct size of image as well
// it's deps could be refactored
export const onLoadUrlPromise = ({url, crossOrigin})=> 
  new Promise((resolve, reject)=> {
    const image = new Image();

    image.onload = function () {
      resolve({
        src: this.src, 
        size: {
          width: this.width, 
          height: this.height
        }, 
        image
      });
    };
    if(crossOrigin) {
      image.crossOrigin = "Anonymous";
    }

    image.src = url;
  })

export const getBlobFromImageAndSize = ({image, size}) => {
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    return canvas.toDataURL("image/png");
}

export const getBlobFromUrl = (url)=>
  new Promise((resolve)=>{
    if(!url) {
      return resolve(url)
    }

    onLoadUrlPromise({url, crossOrigin: true})
    .then(({src, image, size})=>{
      if(src.startsWith('data:')) {
        return resolve({src, size});
      } 

      const blob = getBlobFromImageAndSize({image, size});
      return resolve({src: blob, size});
    })
  })

export const getBlobFromFilePromise = (file)=>
  new Promise((resolve, reject)=> {
    const reader = new FileReader();

    reader.onload = (e)=> {
      resolve(e.target.result);
    };

    reader.readAsDataURL(file);
  })

// TODO could be simplified src => url
export const getBlobAndSizeFromFilePromise = (file)=>
  getBlobFromFilePromise(file)
  .then((blob)=>onLoadUrlPromise({url:blob})
    .then(({width, height})=>({blob, width, height}))
  )