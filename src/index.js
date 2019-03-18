import {
  paper,
  Tool,
  Path,
  Color,
  project,
} from 'paper';
import './index.css';
import '../node_modules/@simonwep/pickr/dist/pickr.min.css';
import Pickr from '@simonwep/pickr';

function updateWidth(newWidth) {
  document.getElementById('width').innerHTML = newWidth;
}

function addClickHandler(id, handler) {
  document.getElementById(id).addEventListener('click', handler);
}

function activateErase() {
  const draw = document.getElementById('drawButton');
  const erase = document.getElementById('eraseButton');

  draw.classList.remove('active');
  erase.classList.add('active');
}

function activateDraw() {
  const draw = document.getElementById('drawButton');
  const erase = document.getElementById('eraseButton');

  erase.classList.remove('active');
  draw.classList.add('active');
}

function setup() {
  // Configure the canvas
  paper.setup('canvas');

  // Create the drawing tool and relevant variables
  const draw = new Tool();
  let drawing = true;
  let path;
  let width = 5;
  let color = [0, 0, 0, 1];

  let removeList = [];

  // Create a new path when receiving drawing input
  draw.onMouseDown = (event) => {
    path = new Path();
    path.strokeColor = new Color(...color);
    path.strokeWidth = width;
    path.strokeJoin = 'round';
    path.strokeCap = 'round';
    path.add(event.point);
  };

  draw.onMouseDrag = event => path.add(event.point);

  // Lines only render if they have 2+ segments.
  // Doing the following allows "dots" to be rendered, as expected
  draw.onMouseUp = (event) => {
    if (path.segments.length < 2) {
      path.add(event.point);
    }
  };

  // Create the eraser tool
  const erase = new Tool();

  // Get all of the intersections with the erase tool, remove any path that the
  // eraser path intersects with.
  erase.onMouseDown = (event) => {
    path = new Path();
    path.strokeColor = new Color(0, 0, 0, 0.5);
    path.strokeWidth = 5;
    path.add(event.point);
  };

  erase.onMouseDrag = (event) => {
    path.add(event.point);

    // Tests if we've collided with a stroke with our eraser
    const hitObj = project.hitTest(event.point, { stroke: true });
    if (hitObj) {
      removeList.push(hitObj.item);
    }
  };

  erase.onMouseUp = () => {
    const items = project.activeLayer.getItems();
    const intersections = items.filter(item => path.intersects(item));
    intersections.forEach(item => item.remove());
    removeList.forEach(item => item.remove());
    removeList = [];
    path.remove();
  };

  // Set up all of the button click handlers
  addClickHandler('exportButton', () => {
    const textArea = document.getElementById('importExportText');
    textArea.value = project.exportJSON();
  });

  addClickHandler('importButton', () => {
    const textArea = document.getElementById('importExportText');
    project.clear();
    project.importJSON(textArea.value);
  });

  addClickHandler('importSVGButton', () => {
    const textArea = document.getElementById('importExportText');
    project.clear();
    project.importSVG(textArea.value);
  });

  addClickHandler('clearButton', () => {
    project.clear();
  });

  addClickHandler('widthPlus', () => {
    width += 1;
    updateWidth(width);
  });

  addClickHandler('widthMinus', () => {
    width -= 1;
    updateWidth(width);
  });

  addClickHandler('drawButton', () => {
    if (!drawing) {
      draw.activate();
      activateDraw();
      drawing = true;
    }
  });

  addClickHandler('eraseButton', () => {
    if (drawing) {
      erase.activate();
      activateErase();
      drawing = false;
    }
  });

  // Set up the color picker using Pickr
  // https://simonwep.github.io/pickr/
  const colorPicker = Pickr.create({
    el: '#pickr',
    default: '000',

    components: {
      preview: true,
      opacity: true,
      hue: true,

      interaction: {
        hex: true,
        rgba: true,
        input: true,
        clear: true,
        save: false, // Removes "save" button, since clicking it was easy to forget
      },
    },
  });

  colorPicker.on('change', (newColor) => {
    if (newColor === null) {
      return;
    }

    const rgba = newColor.toRGBA();
    rgba[0] /= 255;
    rgba[1] /= 255;
    rgba[2] /= 255;
    color = rgba;
    colorPicker.applyColor(); // Make sure change shows up in the "box"
  });
}

paper.install(window);
document.addEventListener('DOMContentLoaded', () => setup());
