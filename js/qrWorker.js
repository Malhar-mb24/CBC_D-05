importScripts('https://unpkg.com/jsqr/dist/jsQR.min.js');

self.onmessage = async function(e) {
    const imageData = e.data;
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    self.postMessage(code?.data || null);
};
