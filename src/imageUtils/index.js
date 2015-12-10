export const onLoadUrlPromise = (url)=> 
  new Promise((resolve, reject)=> {
    let image = new Image();

    image.onload = function () {
      resolve({
        src: this.src, 
        width: this.width, 
        height: this.height
      });
    };

    image.src = url;
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
  .then((blob)=>onLoadUrlPromise(blob)
    .then(({width, height})=>({blob, width, height}))
  )