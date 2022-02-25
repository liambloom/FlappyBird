const c = document.getElementById("my-canvas");
const ctx = c.getContext("2d");

c.width = 300;
c.height = 800;
ctx.fillStyle = "red";

const jumpInitialVelocity = -1.5;
const gravity = 0.005;
const birdRadius = 20;
const birdX = c.width / 2;

let initialJumpPos = c.height / 2;
let gameStartTime, jumpStartTime;

function gameFrame(time) {
    if (jumpStartTime === undefined)
        jumpStartTime = time;
    const t = time - jumpStartTime;
    const y = initialJumpPos + jumpInitialVelocity * t + gravity * t * t / 2;


    console.log("frame @ t=%d, y=%d", t, y);

    ctx.clearRect(0, 0, c.width, c.height);

    ctx.beginPath();
    ctx.arc(birdX, y, birdRadius, 0, 2 * Math.PI);
    ctx.fill();

    if (y < 0 || y > c.height)
        gameOver();
    else
        requestAnimationFrame(gameFrame);
}

function start() {
    requestAnimationFrame(gameFrame);
}

function gameOver() {
    console.log("Game over");
}

start();