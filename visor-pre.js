// Se carga justo después de battledata.js y antes de graphics.js: las animaciones
// precargan sus imágenes (fx/) con la ruta que haya en ese momento.
Dex.fxPrefix = location.href.replace(/[^/?#]*([?#].*)?$/, '') + 'ps/fx/';
