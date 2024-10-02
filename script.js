const canvas = document.getElementById("myCanvas");
// const ctx = canvas.getContext("2d");
const ctx = canvas.getContext("2d", { willReadFrequently: true }); //added "willReadFrequently" to minimize rendering agian and again;
const tools = document.querySelectorAll(".button.tool");
const filledShapeCheckBox = document.getElementById("filledShapes");
const ClearCanva = document.getElementById("clearCanva");
const fillColorPicker = document.getElementById("fillColor");
const outlineColorPicker = document.getElementById("outlineColor");
const eraser = document.getElementById("eraser");
const insertText = document.getElementById("text");
const brushIncrese = document.getElementById("increase");
const brushDecrese = document.getElementById("decrease");
const brushSizeText = document.getElementById("strokeSize");
const saveCanva = document.getElementById("saveCanva");
const insertImgButton = document.querySelector("#inputFile");

// unversal veriable to be used in various place
let fillColor = "#7695FF",
  outlineColor = "";
let brushWidth = 5;
let x1, y1, x2, y2;
let isPointerdown = false;
let activeTool = "brush";
let snapshot;
let image = null;
let widthForImage2Draw = 0;
let is_rect4ImageDrawn = false;
let imageDimensions = {};

// onload function to calibrate brush and canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// fuction to activate a tool by assigning listen click function;
tools.forEach((tool) => {
  tool.addEventListener("click", (e) => {
    document.querySelector(".button.tool.active").classList.remove("active");
    tool.classList.add("active");
    activeTool = tool.id;
    console.log(activeTool);
  });
});

// ---------------------------------------------------Functions for differend Drawings-----------------------------------------------
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
  // //arc(x,y,r,sAngle,eAngle,counterclockwise);
  // ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
  // ctx.moveTo(110, 75);
  // ctx.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
  // ctx.moveTo(65, 65);
  // ctx.arc(60, 65, 5, 0, Math.PI * 2, true); // Left eye
  // ctx.moveTo(95, 65);
  // ctx.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
  // ctx.stroke();
};

const drawImage = () => {
  console.log(imageDimensions);
  let { staringPoint, width } = imageDimensions;

  console.log("drawing image started");
  //getting natural height and width of the image;
  const originalWidth = image.naturalWidth;
  const originalHeight = image.naturalHeight;
  // finding ration between natural height and width of selected image;
  let multiplier = originalHeight / originalWidth;
  //drawing image in same ratio with original image;
  ctx.drawImage(
    image,
    staringPoint.x,
    staringPoint.y,
    width,
    width * multiplier
  );
  is_rect4ImageDrawn = false;
  activeTool = "brush";
};

const choosePhoto = () => {
  insertImgButton.click();
};

const drawRect4Image = (e) => {
  const imageDimensions = drawRectangle(e);
  is_rect4ImageDrawn = true;
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
const drawPara = (e) => {
  console.log("drawing text initiated");

  //initial setup and variables to be used;
  let space = 0;
  let vSpace = 0;
  let undoList = [];
  let index = 0;
  // ctx.closePath();
  ctx.font = "25px serif";

  // function to grab pressed key and write on canvas
  document.addEventListener("keydown", (keyEvent) => {
    //for moving cursor to next letter space;
    if (keyEvent.keyCode === 13) {
      vSpace += 25;
      space = 0;
      console.log("enter key pressed");
    } else {
      ctx.fillText(keyEvent.key, x1 + space, y1 + vSpace);
      space += ctx.measureText(keyEvent.key).width;
    }
  });
};

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
  imageDimensions = {
    width: x2 - x1 + 10,
    staringPoint: {
      x: x1 - 5,
      y: y1 - 5,
    },
  };
};
// ==============================================================================================

// function to set all neccsary attribute to begin drawing
const setupBeforeDraw = (e) => {
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
  } else if (activeTool === "image") {
    drawRect4Image(e);
  } else if (activeTool === "text") {
    drawPara(e);
  }
};

// ---------------------------if left button is kept pressed to draw something ----------------
canvas.addEventListener("pointermove", drawing);
canvas.addEventListener("pointerdown", setupBeforeDraw);
canvas.addEventListener("pointerup", () => {
  isPointerdown = false;
  if (is_rect4ImageDrawn) {
    choosePhoto();
  }
});
ClearCanva.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
fillColorPicker.addEventListener("change", (e) => {
  fillColor = e.target.value;
});
outlineColorPicker.addEventListener("change", (e) => {
  outlineColor = e.target.value;
  console.log(outlineColorPicker.style);
});
brushIncrese.addEventListener("click", () => {
  brushWidth = brushWidth + 1;
  brushSizeText.innerText = `${brushWidth}`;
});
brushDecrese.addEventListener("click", () => {
  brushWidth = brushWidth - 1;
  brushSizeText.innerText = `${brushWidth}`;
});
saveCanva.addEventListener("click", downloadCanvas);

insertImgButton.addEventListener("change", () => {
  image = new Image();
  image.src = URL.createObjectURL(insertImgButton.files[0]);
  image.addEventListener("load", () => {
    drawImage();
  });
});
