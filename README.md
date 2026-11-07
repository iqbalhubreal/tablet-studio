# Tablet Studio (split project)

The original single-file HTML has been separated into smaller, organized files:

- `index.html` contains the page structure and loads the external libraries and local scripts.
- `css/styles.css` contains all styling.
- `js/01-scene-and-screen-layers.js` sets up the scene and screen layers.
- `js/02-audio-pages-camera-modes.js` handles audio, pages, camera streams, and screen modes.
- `js/03-camera-layout-and-modal.js` handles camera movement, layout, and the media modal.
- `js/04-recording.js` handles video recording.
- `js/05-animation-loop.js` contains the animation/render loop.
- `js/06-input-controls-and-startup.js` handles pointer/keyboard input, controls, and startup.

## Run

Keep the folder structure intact. Open `index.html` in a modern browser, or deploy the entire folder to a static host. Three.js and PDF.js are loaded from CDN, so an internet connection is required for those libraries.

The JavaScript files are loaded as ordered classic scripts so the original shared global scope and execution order are preserved.
