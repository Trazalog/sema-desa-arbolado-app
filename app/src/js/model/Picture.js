var Picture = /** @class */ (function () {
    function Picture() {
    }
    Picture.getBase64AndResizeImage = function (srcBase64, srcWidth, srcHeight) {
        // Max size for thumbnail
        if (typeof (srcWidth) === 'undefined')
            srcWidth = 500;
        if (typeof (srcHeight) === 'undefined')
            srcHeight = 500;
        // Create and initialize two canvas
        var newCanvasImage = document.createElement("canvas");
        var context = newCanvasImage.getContext("2d");
        var sourceImage = document.createElement("canvas");
        var copyContext = sourceImage.getContext("2d");
        // Create original image
        var img = new Image();
        img.src = srcBase64;
        // Determine new ratio based on max size
        var ratio = 1;
        if (img.width > srcWidth) {
            ratio = srcWidth / img.width;
        }
        else if (img.height > srcHeight) {
            ratio = srcHeight / img.height;
        }
        // Draw original image in second canvas
        sourceImage.width = img.width;
        sourceImage.height = img.height;
        copyContext.drawImage(img, 0, 0);
        // Copy and resize second canvas to first canvas
        newCanvasImage.width = img.width * ratio;
        newCanvasImage.height = img.height * ratio;
        context.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height, 0, 0, newCanvasImage.width, newCanvasImage.height);
        // Create Data URL
        // Return without header
        return newCanvasImage.toDataURL("image/jpeg");
        //.replace(/^data:image\/(png|jpg|jpeg|bmp|gif|svg|tiff);base64,/, "");
    };
    return Picture;
}());
export { Picture };
//# sourceMappingURL=Picture.js.map