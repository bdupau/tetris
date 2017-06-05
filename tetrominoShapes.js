var iShape = [
  [-2, 0],
  [-1, 0],
  [0, 0],
  [1, 0]
]
var oShape = [
  [-1, -1],
  [-1, 0],
  [0, -1],
  [0, 0]
]
var tShape = [
  [-1, 0],
  [0, 0],
  [1, 0],
  [0, -1]
]
var jShape = [
  [-1, 0],
  [0, 0],
  [1, 0],
  [1, -1]
]
var lShape = [
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, -1]
]
var sShape = [
  [1, 0],
  [0, 0],
  [0, -1],
  [-1, -1]
]
var zShape = [
  [-1, 0],
  [0, 0],
  [0, -1],
  [1, -1]
]
var tetrominoShapes = [iShape, oShape, tShape, jShape, lShape, sShape, zShape]

function getRandomTetrominoShape() {
	return jQuery.extend(true, {}, tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)]);
}