// Tetris
var lines = 0
var score = 0
var height = 20
var width = 10
var tetromino
var nextTetromino
var play = true
var busy = false

function Tetromino() {
  this.done = false
  this.shape = jQuery.extend(true, {}, tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)]);

  this.position = [6, 21]
  this.drops = 0

  this.rotate = function() {
    for (block in this.shape) {
      y_backup = this.shape[block][1]
      this.shape[block][1] = -this.shape[block][0]
      this.shape[block][0] = y_backup
    }
  }
  this.draw = function(style) {
    let lines = []
    let fullLines = []
    for (block in this.shape) {
      let x = this.position[0] + this.shape[block][0]
      let y = this.position[1] + this.shape[block][1]
      lines.push(y);
      let cell = document.getElementById(x + ' ' + y)
      cell.classList.add(style)
    }
    if (style == 'solid') {
		// het is gek dat hier gescoord wordt
      lines = [...new Set(lines)] //filter so only unique lines remain
      for (line in lines) {
        if (isFull(lines[line])) fullLines.push(lines[line])
      }
      if (fullLines.length > 0) scoreLine(fullLines)
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
	  return true
    } else if (this.done) {
      if ($(".tetromino").length > 0) {
		score += this.drops
        this.remove()
        this.draw('solid')
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

function scoreLine(lineNumbers) {
  busy = true
  let lineQuery = ''
    // construct a selector for all full lines, e.g. ".1, .2, .3"
  for (let n = 0; n < lineNumbers.length; n++) {
    if (n > 0) lineQuery += ', '
    lineQuery += '.' + lineNumbers[n]
  }
  $(lineQuery).toggleClass('solid')
  $(lineQuery).toggleClass('selected')
  
  let myTimer = window.setTimeout(function() {dropLinesAbove(lineNumbers, lineQuery)}, 200)
  //clearTimeout(myTimer)
  
  switch (lineNumbers.length) {
    case 4:
	  score += 900 * (level + 1)
	  lines++
	case 3:
	  score += 200 * (level + 1)
	  lines++
	case 2:
	  score += 60 * (level + 1)
	  lines++
	case 1:
	  score += 40 * (level + 1)
	  lines++
  }
}

function dropLinesAbove(lineNumbers, lineQuery) {
  for (let above = Math.min(...lineNumbers) + 1; above < height; above++) {
    let nLines = 0
    for (let full = 0; full < lineNumbers.length; full++) {
      if (lineNumbers[full] < above) nLines++
    }
    for (let x = 1; x <= width; x++) {
      let cell = document.getElementById(x + ' ' + above)
      if (cell.classList.contains('solid')) {
        cell.classList.remove('solid')
        let goalCell = document.getElementById(x + ' ' + (above - nLines))
        goalCell.classList.add('solid')
      }
    }
  }
  $(lineQuery).toggleClass('selected')
  busy = false
}

function updateScoresheet() {
	var scoreSheet = document.getElementById('score')
	var scoreText = ''
	scoreText += "<br>LEVEL:<br>"
	scoreText += getLevel()
	scoreText += "<br>SCORE:<BR>"
	scoreText += score
	scoreSheet.innerHTML = scoreText
}

function init() {
  let playfield = document.getElementById('field')
  let tbl = document.createElement('table')
  playfield.appendChild(tbl)
  for (let y = height; y > 0; y--) {
    let row = tbl.insertRow()
    for (let x = 1; x <= width; x++) {
      let cell = row.insertCell()
      cell.id = x + ' ' + y
      cell.classList.add(y)
    }
  }
  
  let nextArea = document.getElementById('next')
  let nextTbl = document.createElement('table')
  nextArea.appendChild(nextTbl)
  for (let y = 0; y < 4; y++) {
    let row = nextTbl.insertRow()
    for (let x = 0; x < 4; x++) {
      let cell = row.insertCell()
      cell.id = 'next ' + x + ' ' + y
    }
  }
}

function getLevel() {
	return Math.floor(lines / 10)
}

function getSpeed() {
	return 1000 * 1.2 ** (-getLevel())
}

function move() {
  if (play && !busy) tetromino.move([0, -1])
  if (play) setTimeout(move, getSpeed())
  updateScoresheet()
}

function playOn() {
  play = true
  setTimeout(move, getSpeed())
}

function stop() {
  play = false
}

function handleKeyDown(event) {
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
      if (tetromino.move([0, -1])) tetromino.drops++
      break
  }
}

function handleKeyUp(event) {
  switch (event.keyCode) {
    case 40: //down
      if (tetromino.move([0, -1])) tetromino.drops = 0
      break
  }
}

init()
tetromino = new Tetromino()
setTimeout(move, getSpeed())
