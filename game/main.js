// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameOver = false;

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 120,
    width: 100, // Increased width
    height: 100, // Increased height
    speed: 5,
    movingLeft: false,
    movingRight: false,
    img: new Image()
};

player.img.src = './assets/mini1.png'; // Add the path to your hero image

const bullets = [];
const enemies = [];

const enemyImg = new Image();
enemyImg.src = './assets/enemy.webp'; // Add the path to your enemy image

const backgroundImg = new Image();
backgroundImg.src = './assets/background.png'; // Add the path to your background image

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

function movePlayer(e) {
    if (e.key === 'ArrowLeft') player.movingLeft = true;
    if (e.key === 'ArrowRight') player.movingRight = true;
    if (e.key === 'ArrowUp') shootBullet(); // Shoot bullet with ArrowUp
}

function stopPlayer(e) {
    if (e.key === 'ArrowLeft') player.movingLeft = false;
    if (e.key === 'ArrowRight') player.movingRight = false;
}

function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        color: 'red',
        speed: 7
    });
}

function update() {
    if (player.movingLeft && player.x > 0) player.x -= player.speed;
    if (player.movingRight && player.x + player.width < canvas.width) player.x += player.speed;

    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
    });

    if (Math.random() < 0.01) {
        enemies.push({
            x: Math.random() * (canvas.width - 40), // Adjusted for smaller width
            y: 0,
            width: 50, // Decreased width
            height: 50, // Decreased height
            speed: 3,
            img: enemyImg
        });
    }

    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) enemies.splice(index, 1);

        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            gameOver = true;
        }

        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(index, 1);
                score++;
                document.getElementById('score').innerText = `Score: ${score}`;
            }
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach(enemy => {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function displayGameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        displayGameOver();
        canvas.addEventListener('click', restartGame);
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    enemies.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2 - 50; // Adjusted for new player size
    document.getElementById('score').innerText = `Score: ${score}`;
    canvas.removeEventListener('click', restartGame);
    gameLoop();
}

gameLoop();