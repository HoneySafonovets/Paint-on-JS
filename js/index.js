const drawingBoard = document.getElementById('drawing-board');
const colorPickInput = document.getElementById('color-pick-input')
const lineWidthInput = document.getElementById('line-width-input');
const clearBtn = document.getElementById('clear-btn');
const saveBtn = document.getElementById('save-btn')
const colorList = document.getElementById('color-list');
const toolsList = document.getElementById('tools-list');

const ctx = drawingBoard.getContext('2d');

const BOARD_WIDTH = drawingBoard.width = 600;
const BOARD_HEIGHT = drawingBoard.height = 500;

let lineWidth = lineWidthInput.value;
let currentColor = colorPickInput.value;
let isDrawing = false;


// Colors array
const colors = [ 'black', 'red', 'green', 'blue', 'orange', 'yellow' ];
const tools = {
  brush: 'b',
  rectangle: 'r',
  line: 'l',
}

let currentTool = tools.brush;
let prevMouseX = null;
let prevMouseY = null;
let snapshot = null;


function drawBrush(event) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

function drawRect(event) {
  ctx.putImageData(snapshot, 0, 0);
  ctx.strokeRect(prevMouseX, prevMouseY, event.offsetX - prevMouseX, event.offsetY - prevMouseY);
}

// Line draw
function drawLine(event) {
  ctx.beginPath();
  ctx.putImageData(snapshot, 0, 0);
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();
}

function draw(event) {
  if (!isDrawing) return;
  if (currentTool === tools.brush) {
    drawBrush(event)
  } else if (currentTool === tools.rectangle) {
    drawRect(event)
  } else if (currentTool === tools.line) {
    drawLine(event)
  }
}

function startDrawing(event) {
  isDrawing = true;
  prevMouseX = event.offsetX;
  prevMouseY = event.offsetY;
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = lineWidth;
  ctx.beginPath()
  snapshot = ctx.getImageData(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

// Clear function
function clearBoard() {
  ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT)
}

// Change color
function changeColor(event) {
  currentColor = event.target.value;
  console.log(event)
  event.target.classList.toggle('color-list-item__active')
}

function changeLineWidth(event) {
  lineWidth = event.target.value;
}

// Change color
function createElement(name, text, classes=[], listeners=[]) {
  const element = document.createElement(name);
  element.textContent = text;
  element.classList.add(...classes);
  listeners.forEach(listener => {
    element.addEventListener(listener.event, listener.handler)
  })

  return element
}

function displayTools() {
  for (const tool in tools) {
    const listeners = [
      {event: 'click', handler: () => currentTool = tools[tool]}
    ];
    const li = createElement('li');
    li.className = 'tools-list__item';
    const input = createElement('input', null, ['tool-list-item'], listeners)
    input.type = 'radio';
    input.name = 'tool';
    if (tools[tool] === tools.brush) {
      input.checked = true;
    }
    const label = createElement('label', tool);
    li.append(label, input);
    toolsList.appendChild(li);
  }
}

// Display colors
function displayColors() {
  colors.forEach(color => {
    const listeners = [{event: 'click', handler: () => currentColor = color}]
    const li = createElement(
      'li',
      null,
      ['color-list-item'],
      listeners
    );
    li.style.backgroundColor = color;
    colorList.appendChild(li);
  })
}

// Save function
function saveDrawing() {
  const data = drawingBoard.toDataURL();
  const a = createElement('a');
  a.href = data;
  a.download = 'my_drawing.png';
  a.click();
}

displayColors()
displayTools()

// Events Listener
drawingBoard.addEventListener('mousemove', draw);
window.addEventListener('mousedown', startDrawing);
window.addEventListener('mouseup', stopDrawing);
clearBtn.addEventListener('click', clearBoard);
colorPickInput.addEventListener('change', changeColor);
lineWidthInput.addEventListener('change', changeLineWidth)
saveBtn.addEventListener('click', saveDrawing)