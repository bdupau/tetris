// Tetris
var level = 1
var lines = 0
var speed = 100
var height = 20
var width = 10
var field
var tetromino
var nextTetromino
var play = true

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

function Tetromino() {
  this.done = false
  this.shape = jQuery.extend(true, {}, tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)]);

  this.position = [6, 21]

  this.rotate = function() {
    for (block in this.shape) {
      y_backup = this.shape[block][1]
      this.shape[block][1] = -this.shape[block][0]
      this.shape[block][0] = y_backup
    }
  }
  this.draw = function(style) {
    let lines = []
    for (block in this.shape) {
      let x = this.position[0] + this.shape[block][0]
      let y = this.position[1] + this.shape[block][1]
      lines.push(y);
      let cell = document.getElementById(x + ' ' + y)
      cell.classList.add(style)
    }
    if (style = 'solid') {
      lines = [...new Set(lines)]
      for (line in lines) {
        if (isFull(lines[line])) console.log('Line ' + lines[line] + ' is full')
      }
    }
  }
  this.remove = function() {
    $(".tetromino").removeClass("tetromino")
  }
  this.moveable = function(direction) {
    for (block in this.shape) {
      let x = this.position[0] + this.shape[block][0] + direction[0]
      if (x == 0 || x > width) return false
      let y = this.position[1] + this.shape[block][1] + direction[1]
      if (y > height) return false
      if (y == 0) {
        this.done = true
        return false
      }
      let newPosition = document.getElementById((x + ' ' + y))
      if (newPosition.classList.contains('solid')) {
        if (direction[1] == -1) this.done = true
        return false
      }
    }
    return true
  }
  this.move = function(direction) {
    if (this.moveable(direction)) {
      this.remove()
      this.position[0] += direction[0]
      this.position[1] += direction[1]
      this.draw('tetromino')
    } else if (this.done) {
      if ($(".tetromino").length > 0) {
        this.remove()
        this.draw('solid')
        if (isFull(this.position[1])) {
          //remove(this.position[1])
        }
      }
      tetromino = new Tetromino()
    }
  }

  if (this.moveable([0, -1])) {
    this.position[1]--
      this.draw('tetromino')
  }
  return this
}

function isFull(line) {
  for (let x = 1; x <= width; x++) {
    let cell = document.getElementById(x + ' ' + line)
    if (!cell.classList.contains('solid')) return false
  }
  return true
}

function initField() {
  let table = document.getElementById('field')
  for (let y = height; y > 0; y--) {
    let row = table.insertRow()
    for (let x = 1; x <= width; x++) {
      let cell = row.insertCell()
      cell.id = x + ' ' + y;
    }
  }
}

function move() {
  tetromino.move([0, -1])
  if (play) setTimeout(move, speed)
}

function playOn() {
  console.log('h')
  play = true
  setTimeout(move, speed)
}

function stop() {
  play = false
}

function rotateTetromino() {
  tetromino.rotate()
}

function handleEvent(event) {
  switch (event.keyCode) {
    case 37: //left
      tetromino.move([-1, 0])
      break
    case 38: //up
      tetromino.rotate()
      break
    case 39: //right
      tetromino.move([1, 0])
      break
    case 40: //down
      tetromino.move([0, -1])
      break
  }
}

//document.addEventListener("keyup", handleEvent(event))

initField()
tetromino = new Tetromino()
setTimeout(move, speed)
