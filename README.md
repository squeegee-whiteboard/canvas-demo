# Canvas Demo

## Part One

Incomplete part 1: https://codepen.io/aarowill/pen/jJxzRz?editors=1010#0

Complete part 1: https://codepen.io/aarowill/pen/NJMYjp?editors=1010#0

Instructions:

1. Add canvas to the HTML

   ```html
   <canvas id="demoCanvas" width="500" height="500"></canvas>
   ```

2. Add canvas and ctx to the javascript, uncomment the rendering code

   ```javascript
   const canvas = document.getElementById('demoCanvas');
   const ctx = canvas.getContext('2d');
   ```

3. Rectangle example

   ```javascript
   ctx.fillStyle = 'rgb(200, 0, 0)';
   ctx.fillRect(10, 10, 200, 200);

   ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
   ctx.fillRect(100, 100, 200, 200);
   ```

4. Comment out rectangle example and then do live drawing example.

   Javascript:

   ```javascript
   // Mouse drag function for drawing
   function mouseDrag(event) {
     ctx.lineTo(event.x - offsetX, event.y - offsetY);
     ctx.stroke();
   }

   // Start a path on mouse down and add the drag listener
   canvas.addEventListener('mousedown', event => {
     ctx.lineWidth = 10;
     ctx.lineCap = 'round';
     ctx.lineJoin = 'round';
     ctx.beginPath();
     ctx.moveTo(event.x - offsetX, event.y - offsetY);
     canvas.addEventListener('mousemove', mouseDrag);
   });

   // Remove the drag listener on mouse up
   canvas.addEventListener('mouseup', () => {
     canvas.removeEventListener('mousemove', mouseDrag);
   });
   ```

   HTML:

   ```html
   <h2>Draw on the canvas!</h2>
   ```

## Part Two

Code pen for part two: https://codepen.io/aarowill/full/WmJJez

Show drawing, erasing, import/export, and import the mona lisa SVG.
