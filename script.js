const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");
const highScoreElement = document.getElementById("highScoreVal");

// High Score Management with LocalStorage
function getHighScore() {
    const highScore = localStorage.getItem("snakeHighScore");
    return highScore ? parseInt(highScore) : 0;
}

function setHighScore(score) {
    localStorage.setItem("snakeHighScore", score.toString());
    highScoreElement.textContent = score;
}

// Load and display high score on page load
let highScore = getHighScore();
highScoreElement.textContent = highScore;

// Collision detection function
function collision(head, array) {
    for(let i = 0; i < array.length; i++) {
        if(head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

let box = 20; // Size of one square
let score = 0;
let snake = [{ x: 10 * box, y: 10 * box }]; // Initial snake position
// Calculate grid size (canvas is 400x400, box is 20, so grid is 20x20, positions 0-19)
let gridSize = canvas.width / box;
let food = {
    x: Math.floor(Math.random() * gridSize) * box,
    y: Math.floor(Math.random() * gridSize) * box
};
// Ensure initial food doesn't spawn on snake
while (collision(food, snake)) {
    food = {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };
}
let d; // Direction

// Control the snake
document.addEventListener("keydown", direction);
function direction(event) {
    if(event.key === "ArrowLeft" && d != "RIGHT") d = "LEFT";
    else if(event.key === "ArrowUp" && d != "DOWN") d = "UP";
    else if(event.key === "ArrowRight" && d != "LEFT") d = "RIGHT";
    else if(event.key === "ArrowDown" && d != "UP") d = "DOWN";
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "lime";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;

    // Check if snake eats food
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        // Generate new food position that doesn't overlap with snake
        do {
            food = {
                x: Math.floor(Math.random() * gridSize) * box,
                y: Math.floor(Math.random() * gridSize) * box
            };
        } while (collision(food, snake));
    } else {
        snake.pop(); // Remove tail
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over rules
    // Check collision with body only (exclude the current head which will be replaced)
    // Boundary check: snake can reach edges (0 to canvas.width-box), game over when it goes beyond
    let bodyOnly = snake.slice(1); // Skip the head, check only body segments
    if(snakeX < 0 || snakeX + box > canvas.width || snakeY < 0 || snakeY + box > canvas.height || collision(newHead, bodyOnly)) {
        clearInterval(game);
        
        // Check and update high score
        if(score > highScore) {
            highScore = score;
            setHighScore(highScore);
            alert("Game Over! New High Score: " + score + "!");
        } else {
            alert("Game Over! Score: " + score + "\nHigh Score: " + highScore);
        }
        
        location.reload(); 
    }

    snake.unshift(newHead); // Add new head
}

let game = setInterval(draw, 100); // Run every 100ms