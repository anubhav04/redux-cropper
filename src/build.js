import Template from 'template';

$.extend(prototype, {
	build: function () {
		const options = this.options;
		const $this = this.$element;
		const $clone = this.$clone;
		let $cropper;
		let $cropBox;

		if (!this.isLoaded) {
			return;
		}

		// Create cropper elements
		this.$container = $this.parent();
		this.$cropper = $cropper = $(Cropper.TEMPLATE);

		// Hide the original image
		$this.addClass(CLASS_HIDDEN).after($cropper);

		// Show the clone image if is hidden
		if (!this.isImg) {
			$clone.removeClass(CLASS_HIDE);
		}

		this.initPreview();
		this.bind();


		if (options.autoCrop) {
			this.isCropped = true;
		} else {
			$cropBox.addClass(CLASS_HIDDEN);
		}

		if (options.background) {
			$cropper.addClass(CLASS_BG);
		}

		this.setDragMode(options.dragMode);
		this.render();
		this.setData(options.data);

	},

	unbuild: function () {
		this.initialImage = null;

		// Clear `initialCanvas` is necessary when replace
		this.initialCanvas = null;
		this.initialCropBox = null;
		this.container = null;
		this.canvas = null;

		// Clear `cropBox` is necessary when replace
		this.cropBox = null;
		this.unbind();

		this.resetPreview();
		this.$preview = null;
		this.$container = null;

		this.$cropper.remove();
		this.$cropper = null;
	}
});
