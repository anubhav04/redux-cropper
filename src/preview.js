export default class Preview extends PureComponent {
	render() {
		return <img crossOrigin={this.props.crossOrigin}
								src={this.props.url}
								style={{
                  display:'block',
                  width:'100%',
                  height:'auto',
                  minWidth:0,
                  minHeight:0,
                  maxWidth:'none',
                  maxHeight:'none',
                  imageOrientation:'0deg'
                }}
		/>
	}
}

$.extend(prototype, {
	initPreview: function () {
		const crossOrigin = getCrossOrigin(this.crossOrigin);
		const url = this.url;

		this.$preview = $(this.options.preview);
		this.$preview.each(function () {
			const $this = $(this);

			// Save the original size for recover
			$this.data(DATA_PREVIEW, {
				width: $this.width(),
				height: $this.height(),
				html: $this.html()
			});

			/**
			 * Override img element styles
			 * Add `display:block` to avoid margin top issue
			 * (Occur only when margin-top <= -height)
			 */
			$this.html(
				'<img' + crossOrigin + ' src="' + url + '" style="' +
				'display:block;width:100%;height:auto;' +
				'min-width:0!important;min-height:0!important;' +
				'max-width:none!important;max-height:none!important;' +
				'image-orientation:0deg!important;">'
			);
		});
	},

	resetPreview: function () {
		this.$preview.each(function () {
			const $this = $(this);
			const data = $this.data(DATA_PREVIEW);

			$this.css({
				width: data.width,
				height: data.height
			}).html(data.html).removeData(DATA_PREVIEW);
		});
	},

	preview: function () {
		const image = this.image;
		const canvas = this.canvas;
		const cropBox = this.cropBox;
		const cropBoxWidth = cropBox.width;
		const cropBoxHeight = cropBox.height;
		const width = image.width;
		const height = image.height;
		const left = cropBox.left - canvas.left - image.left;
		const top = cropBox.top - canvas.top - image.top;

		if (!this.isCropped || this.isDisabled) {
			return;
		}

		this.$preview.each(function () {
			const $this = $(this);
			const data = $this.data(DATA_PREVIEW);
			const originalWidth = data.width;
			const originalHeight = data.height;
			let newWidth = originalWidth;
			let newHeight = originalHeight;
			let ratio = 1;

			if (cropBoxWidth) {
				ratio = originalWidth / cropBoxWidth;
				newHeight = cropBoxHeight * ratio;
			}

			if (cropBoxHeight && newHeight > originalHeight) {
				ratio = originalHeight / cropBoxHeight;
				newWidth = cropBoxWidth * ratio;
				newHeight = originalHeight;
			}

			$this.css({
					width: newWidth,
					height: newHeight
				})
				.find('img')
				.css({
					width: width * ratio,
					height: height * ratio,
					marginLeft: -left * ratio,
					marginTop: -top * ratio,
					transform: getTransform(image)
				});
		});
	}
});
