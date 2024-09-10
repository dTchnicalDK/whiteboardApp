const canvas = document.getElementById("myCanvas");
// const ctx = canvas.getContext("2d");
const ctx = canvas.getContext("2d", { willReadFrequently: true }); //added "willReadFrequently" to minimize rendering agian and again;
const tools = document.querySelectorAll(".button.tool");
const filledShapeCheckBox = document.getElementById("filledShapes");
const ClearCanva = document.getElementById("clearCanva");
const fillColorPicker = document.getElementById("fillColor");
const outlineColorPicker = document.getElementById("outlineColor");
const eraser = document.getElementById("eraser");
const brushIncrese = document.getElementById("increase");
const brushDecrese = document.getElementById("decrease");
const brushSizeText = document.getElementById("strokeSize");
const saveCanva = document.getElementById("saveCanva");

// unversal veriable to be used in various place
let fillColor = "#7695FF",
  outlineColor = "";
let brushWidth = 5;
let x1, y1, x2, y2;
let isPointerdown = false;
let activeTool = "brush";
let snapshot;

// onload function to calibrate brush and canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// fuction to activate a tool
tools.forEach((tool) => {
  tool.addEventListener("click", (e) => {
    document.querySelector(".button.tool.active").classList.remove("active");
    tool.classList.add("active");
    activeTool = tool.id;
    console.log(activeTool);
  });
});

const downloadCanvas = () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpeg`;
  link.href = canvas.toDataURL();
  link.click();
};

//function for smile face;
const drawSmily = (e) => {
  console.log("drawing smily");

  // ctx.beginPath();

  // ctx.arc(x1, y1, Math.abs(e.offsetX - x1), 0, 2 * Math.PI);
  // ctx.fill();
  // ctx.stroke();
  // ctx.closePath();

  // //eyes
  // ctx.fillStyle = "cyan";
  // ctx.beginPath();
  // ctx.arc(270, 175, 30, 0, 2 * Math.PI);
  // ctx.fill();
  // ctx.stroke();
  // ctx.closePath();

  // ctx.beginPath();
  // ctx.arc(370, 175, 30, 0, 2 * Math.PI);
  // ctx.fill();
  // ctx.stroke();
  // ctx.closePath();

  // //mouth
  // ctx.strokeStyle = "magenta";
  // ctx.lineWidth = 5;
  // ctx.beginPath();
  // ctx.arc(320, 240, 150, 0, -1 * Math.PI);
  // ctx.stroke();
  // ctx.closePath();

  // ctx.font = "50px Arial Black";
  // ctx.fillText("Smile!", 230, 500);
};
// function  to draw heart the copy pasted code with little tweak;
const drawHeart = (e) => {
  console.log("drawing heart");

  var x = x1;
  var y = y1;
  var width = e.offsetX - x1;
  var height = e.offsetY - y1;

  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);
  filledShapeCheckBox.checked ? (ctx.stroke(), ctx.fill()) : ctx.stroke();
};
// ----------------------------------------------------------------------------------------------
const drawEraser = (e) => {
  // outlineColor = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x1, y1, e.offsetX - x1, e.offsetY - y1);
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(x1 * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  filledShapeCheckBox.checked ? (ctx.stroke(), ctx.fill()) : ctx.stroke();
};

const drawStraightLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

const drawCircle = (e) => {
  ctx.beginPath();
  ctx.arc(x1, y1, Math.abs(e.offsetX - x1), 0, Math.PI * 2);
  filledShapeCheckBox.checked ? (ctx.stroke(), ctx.fill()) : ctx.stroke();
};
const drawRectangle = (e) => {
  console.log("drawing rect");
  x2 = e.offsetX;
  y2 = e.offsetY;

  if (filledShapeCheckBox.checked) {
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
  } else {
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
};

// function to set all neccsary attribute to begin drawing
const beginDrawing = (e) => {
  isPointerdown = true;
  x1 = e.offsetX;
  y1 = e.offsetY;
  ctx.moveTo(x1, y1);
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = outlineColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// function to decide what shape is to be drawn on canvas
const drawing = (e) => {
  if (!isPointerdown) return;
  ctx.putImageData(snapshot, 0, 0);
  if (activeTool === "brush") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (activeTool === "square") {
    drawRectangle(e);
  } else if (activeTool === "circle") {
    drawCircle(e);
  } else if (activeTool === "triangle") {
    drawTriangle(e);
  } else if (activeTool === "sLine") {
    drawStraightLine(e);
  } else if (activeTool === "heart") {
    drawHeart(e);
  } else if (activeTool === "eraser") {
    drawEraser(e);
  } else if (activeTool === "smile") {
    drawSmily(e);
  }
};

canvas.addEventListener("pointermove", drawing);
canvas.addEventListener("pointerdown", beginDrawing);
canvas.addEventListener("pointerup", () => {
  isPointerdown = false;
});
ClearCanva.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
fillColorPicker.addEventListener("change", (e) => {
  fillColor = e.target.value;
});
outlineColorPicker.addEventListener("change", (e) => {
  outlineColor = e.target.value;
});
brushIncrese.addEventListener("click", () => {
  brushWidth = brushWidth + 1;
  brushIncrese = brushSizeText.innerText = `${brushWidth}`;
});
brushDecrese.addEventListener("click", () => {
  brushWidth = brushWidth - 1;
  brushIncrese = brushSizeText.innerText = `${brushWidth}`;
});
saveCanva.addEventListener("click", downloadCanvas);
