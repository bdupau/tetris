// Tetris
var height = 20;
var width = 10;
var lines;
var score;
var tetromino;
var nextTetromino;
var play;
var busy;
var gameOver;

function Tetromino(shape) {
	this.shape = shape;
	this.onField = false;
	this.done = false;
	this.position = [6, 21];
	this.drops = 0;

	this.draw = function(style) {
		for (block in this.shape) {
			let x = this.position[0] + this.shape[block][0];
			let y = this.position[1] + this.shape[block][1];
			let cell = document.getElementById(x + ' ' + y);
			cell.classList.add(style);
		}
	}
	this.remove = function() {
		// Verwijdert niet alleen zichzelf, maar alle tetromino cellen
		// Onder de aanname dat er altijd maar één tetromino is
		$(".tetromino").removeClass("tetromino");
	}
	this.movable = function(direction) {
		for (block in this.shape) {
			let x = this.position[0] + this.shape[block][0] + direction[0];
			if (x == 0 || x > width)
				return false;
			let y = this.position[1] + this.shape[block][1] + direction[1];
			if (y > height)
				return false;
			if (y == 0) {
				this.done = true;
				return false;
			}
			let newPosition = document.getElementById((x + ' ' + y));
			if (newPosition.classList.contains('solid')) {
				if (direction[1] == -1)
					this.done = true;
				return false;
			}
		}
		return true
	}
	this.move = function(direction) {
		if (!play)
			return;
		if (this.movable(direction)) {
			this.remove();
			this.position[0] += direction[0];
			this.position[1] += direction[1];
			this.draw('tetromino');
			return 'moved';
		} else if (this.done) {
			if ($(".tetromino").length > 0) {
				score += this.drops;
				this.remove();
				this.draw('solid');
			}
			return 'done'
		}
	}
	this.rotatable = function() {
		for (block in this.shape) {
			let y_backup = this.shape[block][1];
			let y = -this.shape[block][0];
			let x = y_backup;
			x += this.position[0];
			y += this.position[1];
			if (x <= 0 || x > width)
				return false;
			if (y <= 0 || y > height)
				return false;
			let newPosition = document.getElementById((x + ' ' + y));
			if (newPosition.classList.contains('solid'))
				return false;
		}
		return true;
	}
	this.rotate = function() {
		if (!play || !this.rotatable())
			return;
		this.remove();
		for (block in this.shape) {
			let y_backup = this.shape[block][1];
			this.shape[block][1] = -this.shape[block][0];
			this.shape[block][0] = y_backup;
		}
		this.draw('tetromino');
	}
	this.start = function() {
		if (this.movable([0, -1])) {
			this.onField = true;
			this.position[1]--;
			this.draw('tetromino');
		} else {
			endGame();
		}
	}
	return this;
}

function endGame() {
	stop();
	gameOver = true;
	$(".solid").addClass('selected');
	setHighscore();
	if (confirm("Start new game ?"))
		startNewGame();
}

function startNewGame() {
	$(".tetromino").removeClass("tetromino");
	$(".solid").removeClass("solid");
	$(".next").removeClass("next");
	$(".selected").removeClass("selected");
	
	lines = 0;
	score = 0;
	play = true;
	busy = false;
	gameOver = false;
	
	nextTetromino = getRandomTetrominoShape();
	placeNextTetrominoInField();
	updateScoresheet();
}

function isFull(line) {
	for (let x = 1; x <= width; x++) {
		let cell = document.getElementById(x + ' ' + line);
		if (!cell.classList.contains('solid'))
			return false;
	}
	return true;
}

function scoreLines(lineNumbers) {
	let lineQuery = '';
	// construct a selector for all full lines, e.g. ".1, .2, .3"
	for (let n = 0; n < lineNumbers.length; n++) {
		if (n > 0)
			lineQuery += ', ';
		lineQuery += '.' + lineNumbers[n];
	}
	$(lineQuery).toggleClass('solid');
	$(lineQuery).toggleClass('selected');

	let myTimer = window.setTimeout(function () {
			dropLinesAbove(lineNumbers, lineQuery)
		}, 200);

	switch (lineNumbers.length) {
	case 4:
		score += 900 * (getLevel() + 1);
		lines++;
		$("#wellDone").show().delay(5000).fadeOut();
	case 3:
		score += 200 * (getLevel() + 1);
		lines++;
	case 2:
		score += 60 * (getLevel() + 1);
		lines++;
	case 1:
		score += 40 * (getLevel() + 1);
		lines++;
	}
}

function dropLinesAbove(lineNumbers, lineQuery) {
	for (let above = Math.min(...lineNumbers) + 1; above < height; above++) {
		let nLines = 0;
		for (let full = 0; full < lineNumbers.length; full++) {
			if (lineNumbers[full] < above)
				nLines++;
		}
		for (let x = 1; x <= width; x++) {
			let cell = document.getElementById(x + ' ' + above);
			if (cell.classList.contains('solid')) {
				cell.classList.remove('solid');
				let goalCell = document.getElementById(x + ' ' + (above - nLines));
				goalCell.classList.add('solid');
			}
		}
	}
	$(lineQuery).toggleClass('selected');
}

function updateScoresheet() {
	var scoreSheet = document.getElementById('score');
	var scoreText = '';
	scoreText += "<br>LINES:<br>";
	scoreText += lines;
	scoreText += "<br><br>LEVEL:<br>";
	scoreText += getLevel();
	scoreText += "<br><br>SCORE:<BR>";
	scoreText += score;
	scoreText += "<br><br>HISCORE:<BR>";
	scoreText += getHighscore();
	scoreSheet.innerHTML = scoreText;
}

function drawNextTetromino() {
	$(".next").removeClass("next");
	for (block in nextTetromino) {
		let x = 3 + nextTetromino[block][0];
		let y = 3 + nextTetromino[block][1];
		let cell = document.getElementById('next ' + x + ' ' + y);
		cell.classList.add('next');
	}
}

function init() {
	let playfield = document.getElementById('field');
	let tbl = document.createElement('table');
	playfield.appendChild(tbl);
	for (let y = height; y > 0; y--) {
		let row = tbl.insertRow();
		for (let x = 1; x <= width; x++) {
			let cell = row.insertCell();
			cell.id = x + ' ' + y;
			cell.classList.add(y);
		}
	}

	let nextArea = document.getElementById('next');
	nextArea.innerHTML = 'NEXT:<br><br>'
	let nextTbl = document.createElement('table');
	nextArea.appendChild(nextTbl);
	for (let y = 4; y > 0; y--) {
		let row = nextTbl.insertRow();
		for (let x = 1; x <= 4; x++) {
			let cell = row.insertCell();
			cell.id = 'next ' + x + ' ' + y;
		}
	}
	
	$("#wellDone").hide();
}

function getHighscore() {
	if (typeof(Storage) !== "undefined") {
		if (localStorage.highscore)
			return localStorage.highscore;
	}
	return 0;
}

function setHighscore() {
	if (typeof(Storage) !== "undefined") {
		if (!localStorage.highscore || score > localStorage.highscore)
			localStorage.highscore = score;
	}
}

function getLevel() {
	return Math.floor(lines / 10);
}

function getSpeed() {
	return 1000 * 1.2 ** (-getLevel());
}

function getFullLines() {
	let fullLines = [];
	for (let line = 1; line <= height; line++) {
		if (isFull(line))
			fullLines.push(line);
	}
	return fullLines;
}

function move() {
	if (play && !busy) {
		switch (tetromino.move([0, -1])) {
		case 'moved':
			break;
		case 'done':
			let fullLines = getFullLines();
			if (fullLines.length > 0)
				scoreLines(fullLines);
			placeNextTetrominoInField()
			break;
		}
	}
	if (play) {
		updateScoresheet();
		setTimeout(move, getSpeed());
	}
}

function playOn() {
	if (gameOver)
		return;
	play = true;
	setTimeout(move, getSpeed());
}

function stop() {
	play = false;
}

function handleKeyDown(event) {
	if (gameOver)
		return;
	switch (event.keyCode) {
	case 37: //left
		tetromino.move([-1, 0]);
		break;
	case 38: //up
		tetromino.rotate();
		break;
	case 39: //right
		tetromino.move([1, 0]);
		break;
	case 40: //down
		switch (tetromino.move([0, -1])) {
		case 'moved':
			tetromino.drops++;
			break;
		case 'done':
			let fullLines = getFullLines();
			if (fullLines.length > 0)
				scoreLines(fullLines);
			placeNextTetrominoInField()
			break;
		}
		break;
	case 80: //p for pauze
		if (play) 
			stop();
		else
			playOn();
		break;
	}
}

function handleKeyUp(event) {
	if (gameOver)
		return;
	switch (event.keyCode) {
	case 40: //down
		if (tetromino.move([0, -1]))
			tetromino.drops = 0;
		break;
	}
}

function placeNextTetrominoInField() {
	tetromino = new Tetromino(nextTetromino);
	nextTetromino = getRandomTetrominoShape();
	drawNextTetromino();
	tetromino.start();
}

init();
startNewGame();
setTimeout(move, getSpeed());