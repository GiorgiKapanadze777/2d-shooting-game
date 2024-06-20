// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let score = 0;
let gameOver = false;
let killedByEnemy = false;
let bossActive = false;
let bossShootInterval;

const player = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 120,
    width: 100,
    height: 100,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    img: new Image()
};

player.img.src = 'assets/hero.png';

const bullets = [];
const enemies = [];
const bossBullets = [];

const enemyImg = new Image();
enemyImg.src = 'assets/enemy.webp';

const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';

const boss = {
    x: canvas.width / 2 - 75,
    y: 20,
    width: 150,
    height: 150,
    speed: 0,
    health: 10,
    img: new Image()
};

boss.img.src = 'assets/boss.png';

document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

function movePlayer(e) {
    if (e.key === 'ArrowLeft') player.movingLeft = true;
    if (e.key === 'ArrowRight') player.movingRight = true;
    if (e.key === 'ArrowUp') shootBullet();
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

function shootBossBullet() {
    bossBullets.push({
        x: boss.x + boss.width / 2 - 5,
        y: boss.y + boss.height,
        width: 10,
        height: 20,
        color: 'purple',
        speed: 5
    });
}

function update() {
    if (player.movingLeft && player.x > 0) player.x -= player.speed;
    if (player.movingRight && player.x + player.width < canvas.width) player.x += player.speed;

    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) bullets.splice(index, 1);
    });

    bossBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) bossBullets.splice(index, 1);
    });

    if (!bossActive && Math.random() < 0.01) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: 0,
            width: 40,
            height: 40,
            speed: 3,
            img: enemyImg
        });
    }

    if (score >= 15 && !bossActive) {
        bossActive = true;
        bossShootInterval = setInterval(shootBossBullet, 1000); // Boss shoots every second
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
            killedByEnemy = true;

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

    if (bossActive) {
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < boss.x + boss.width &&
                bullet.x + bullet.width > boss.x &&
                bullet.y < boss.y + boss.height &&
                bullet.y + bullet.height > boss.y
            ) {
                bullets.splice(bIndex, 1);
                boss.health--;
                if (boss.health <= 0) {
                    bossActive = false;
                    clearInterval(bossShootInterval);
                    score += 10;
                    document.getElementById('score').innerText = `Score: ${score}`;
                    displayWinMessage(); // Display win message when boss is defeated
                    gameOver = true; // Game over after winning
                }
            }
        });

        bossBullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < player.x + player.width &&
                bullet.x + bullet.width > player.x &&
                bullet.y < player.y + player.height &&
                bullet.y + bullet.height > player.y
            ) {
                gameOver = true;
                killedByEnemy = true;
            }
        });

        if (
            boss.x < player.x + player.width &&
            boss.x + boss.width > player.x &&
            boss.y < player.y + player.height &&
            boss.y + boss.height > player.y
        ) {
            gameOver = true;
            killedByEnemy = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);

    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    bossBullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    enemies.forEach(enemy => {
        ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    if (bossActive) {
        ctx.drawImage(boss.img, boss.x, boss.y, boss.width, boss.height);
        // Draw boss health bar
        ctx.fillStyle = 'red';
        ctx.fillRect(boss.x, boss.y - 20, boss.width, 10);
        ctx.fillStyle = 'green';
        ctx.fillRect(boss.x, boss.y - 20, boss.width * (boss.health / 10), 10);
    }
}

function displayWinMessage() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
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
    } else if(gameOver && killedByEnemy){
        clearInterval(bossShootInterval);
        displayGameOver();
        canvas.addEventListener('click', restartGame);

    }else {
        clearInterval(bossShootInterval);
        if (bossActive) {
            
        } else {
            console.log("else statement hit!");
            displayWinMessage();
        }
        canvas.addEventListener('click', restartGame);
    }
}

function restartGame() {
    score = 0;
    gameOver = false;
    bossActive = false;
    boss.health = 10;
    clearInterval(bossShootInterval);
    enemies.length = 0;
    bullets.length = 0;
    bossBullets.length = 0;
    player.x = canvas.width / 2 - 50;
    document.getElementById('score').innerText = `Score: ${score}`;
    canvas.removeEventListener('click', restartGame);
    gameLoop();
}

gameLoop();
