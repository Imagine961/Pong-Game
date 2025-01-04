// Board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// Players
let playerWidth = 10;
let playerHeight = 50;

let player1 = {
    x: 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

let player2 = {
    x: boardWidth - playerWidth - 10,
    y: boardHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
};

// Ball
let ballWidth = 10;
let ballHeight = 10;
let ball = {
    x: boardWidth / 2,
    y: boardHeight / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 1,
    velocityY: 1
};

let player1Score = 0;
let player2Score = 0;

window.onload = function () {
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Start the game loop
    requestAnimationFrame(update);

    // Event listeners for player movement
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
};

function update() {
    // Clear the board
    context.clearRect(0, 0, boardWidth, boardHeight);

    // Update and draw player 1
    player1.y += player1.velocityY;
    player1.y = Math.max(0, Math.min(player1.y, boardHeight - player1.height)); // Keep within bounds
    context.fillStyle = "skyblue";
    context.fillRect(player1.x, player1.y, player1.width, player1.height);

    // Update and draw player 2
    player2.y += player2.velocityY;
    player2.y = Math.max(0, Math.min(player2.y, boardHeight - player2.height)); // Keep within bounds
    context.fillStyle = "skyblue";
    context.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Update and draw the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
        ball.velocityY *= -1; // Reverse vertical direction
    }

    // Ball collision with paddles
    if (detectCollision(ball, player1) && ball.x <= player1.x + player1.width) {
        ball.velocityX *= -1; // Reverse horizontal direction
    } else if (detectCollision(ball, player2) && ball.x + ballWidth >= player2.x) {
        ball.velocityX *= -1; // Reverse horizontal direction
    }

    // Draw the ball
    context.fillStyle = "white";
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    // Loop the update function
    requestAnimationFrame(update);

    // game over each round
    if (ball.x < 0) {
        player2Score++;
        resetGame(1);
    } else if (ball.x + ballWidth > boardWidth) {
        player1Score++;
        resetGame(-1);
    }

    //scores
    context.font = "45px sansa-serif";
    context.fillText(player1Score, boardWidth / 5, 45);
    context.fillText(player2Score, boardWidth * 4 / 5 - 45, 45);

    //  draw the dotted line down the middle
    for (let i = 10; i < board.height; i += 25) {
        //i = starting y position, draw a square every 25 pixels down
        // (x position = half of boardWidth - 10), i = y position, width = 5, height = 5
        context.fillRect(board.width / 2 - 10, i, 5, 5);
    }
}

function movePlayer(e) {
    // Player 1 controls
    if (e.code === "KeyW") {
        player1.velocityY = -3;
    } else if (e.code === "KeyS") {
        player1.velocityY = 3;
    }

    // Player 2 controls
    if (e.code === "ArrowUp") {
        player2.velocityY = -3;
    } else if (e.code === "ArrowDown") {
        player2.velocityY = 3;
    }
}

function stopPlayer(e) {
    // Reset Player 1 movement
    if (e.code === "KeyW" || e.code === "KeyS") {
        player1.velocityY = 0;
    }

    // Reset Player 2 movement
    if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        player2.velocityY = 0;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && // Ball's left edge doesn't pass the paddle's right edge
        a.x + a.width > b.x && // Ball's right edge overlaps paddle's left edge
        a.y < b.y + b.height && // Ball's top edge overlaps paddle's bottom edge
        a.y + a.height > b.y; // Ball's bottom edge overlaps paddle's top edge
}

function resetGame(direction) {
    ball = {
        x: boardWidth/2,
        y: boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX: direction,
        velocityY: 1
    };
}