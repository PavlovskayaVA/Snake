function Img() {
    let elem = document.getElementById("Snake");
    let game = document.getElementById("Game");
    let style = getComputedStyle(elem);
    if (style.display === "none") {
        document.getElementById("Snake").style.display = "block";
    } else if (style.display !== "none") {
        document.getElementById("Snake").style.display = "none";
        document.getElementById("Game").style.display = "block";
    }
}



let scoreBlock;
let bestScoreBlock;
let score = 0;
let bestScore = 0;

const config = {
	step: 0,
	maxStep: 30,
	sizeCell: 30,
	sizeApple: 30 / 4
}

const snake = {
	x: 150,
	y: 150,
	dx: config.sizeCell,
	dy: 0,
	tails: [],
	maxTails: 2
}

let apple = {
	x: 30,
	y: 30
}

// Настройка «холста»
let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");

let button = document.querySelector("button");
scoreBlock = document.querySelector(".game-score .score-count");
bestScoreBlock = document.querySelector(".best-score .score-best");
drawScore();

// Настройка скорости
function gameLoop() {

	requestAnimationFrame( gameLoop );
	if ( ++config.step < config.maxStep) {
		return;
	}
	config.step = 0;
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawApple();
	drawSnake();
}
requestAnimationFrame( gameLoop );

// Настройка движения змейки
function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;
	collisionBorder();


	snake.tails.unshift( { x: snake.x, y: snake.y } );

	if ( snake.tails.length > snake.maxTails ) {
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){
		if (index == 0) {
			context.fillStyle = "#c5638e";
		} else if (index % 2 === 0) {
			context.fillStyle = "#eecf00";
		} else if (index % 2 !== 0) {
			context.fillStyle = "#de98b6";
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

		if ( el.x === apple.x && el.y === apple.y ) {
			snake.maxTails++;
			incScore();
			randomPositionApple();
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) {

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
				refreshButton();
			}
		}

	} );
}

// Запрет на перемещение сквозь границы
function collisionBorder() {
	if (snake.x < 0 || snake.x >= canvas.width) {
		refreshButton()
	} 

	if (snake.y < 0 || snake.y >= canvas.height) {
		refreshButton()
	}
}

// Обновление игры по проигрышу
function refreshButton() {
    alert(`Ваш результат: ${score}`);
    refresBestScore()
}

// Обновление игры по кнопке
button.onclick = function() {
    alert(`Ваш результат: ${score}`);
    refresBestScore()
}

// Обновление лучшего результат
function refresBestScore() {
  if (score>=bestScore && score!=0) {
    bestScore = score;
    bestScoreBlock.innerHTML = bestScore;
    localStorage.setItem("score", bestScore);
    localStorage.getItem("score");
    refreshGame()
  }
  else {
    refreshGame()
  }
}

// Игра сначала
function refreshGame() { 
	score = 0;
	drawScore();
	snake.x = 150;
	snake.y = 150;
	snake.tails = [];
	snake.maxTails = 2;
	snake.dx = config.sizeCell;
	snake.dy = 0;
	randomPositionApple();
}


// Отрисовка табла с результатом
function drawScore() {
	scoreBlock.innerHTML = score;
}

function incScore() {
	score++;
	drawScore();
}

function getRandomInt(min, max) {
	return Math.floor( Math.random() * (max - min) + min );
}

// Отрисовка яблока
function drawApple() {
	context.beginPath(); 
	context.fillStyle = "#de98b6";
	context.arc( apple.x + (config.sizeCell / 2 ), apple.y + (config.sizeCell / 2 ), config.sizeApple, 0, 2 * Math.PI );
	context.fill();
}

function randomPositionApple() {
	apple.x = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	apple.y = getRandomInt( 0, canvas.height / config.sizeCell ) * config.sizeCell;
}


// Управление по стрелкам
document.addEventListener("keydown", function (e) {
	if ( e.code == "ArrowUp" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "ArrowLeft" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "ArrowDown" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "ArrowRight" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});