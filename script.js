"use strict";
const c = document.getElementById("my-canvas");
const ctx = c.getContext("2d");

c.width = 300;
c.height = 800;

const jumpInitialVelocity = -1.5;
const gravity = 0.005;
const birdRadius = 20;
const birdX = c.width / 2;
const pipeSpeed = -0.2;
const pipeWidth = 50;
const pipeGap = 100;

class Bird {
    constructor() {
        this.initialJumpPos = c.height / 2;
        this.jumpStartTime = performance.now();
        this.isStopped = false;
        // this.jump();
    }

    jump() {
        if (!game.isRunning)
            return;
        this.initialJumpPos = this.y;
        this.jumpStartTime = performance.now();
    }

    get y() {
        const t = game.time - this.jumpStartTime;
        const y = this.initialJumpPos + jumpInitialVelocity * t + gravity * t * t / 2;
        this.isStopped = y > c.height;
        // console.log(y);
        if (y < 0 || this.isStopped)
            game.end();

        return y;
    }

    draw() {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(birdX, this.y, birdRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Pipe {
    constructor() {
        this.y = Math.floor(Math.random() * c.height - 100) + 50;
        this.spawnTime = performance.now();
    }

    get x() {
        return c.width + pipeSpeed * (game.time - this.spawnTime);
    }

    draw() {
        ctx.fillStyle = "green";
        console.log("pipe @ %s", this.x);
        ctx.fillRect(this.x - (pipeWidth / 2), 0, pipeWidth, this.y - (pipeGap / 2));
        ctx.fillRect(this.x - (pipeWidth / 2), this.y + (pipeGap / 2), pipeWidth, c.height);
    }

    get isColliding() {
        return this.x - (pipeWidth / 2) <= birdX + birdRadius && this.x + (pipeWidth / 2) >= birdX - birdRadius
            && (this.y - (pipeGap / 2) >= game.bird.y - birdRadius || this.y + (pipeGap / 2) <= game.bird.y + birdRadius);
        
    }
}

const game = {
    isRunning: true,
    pipes: [],

    start() {
        this.bird = new Bird();
        this.frameId = requestAnimationFrame(this.frame);
        this.pipeCreator = setInterval(() => {
            this.pipes.push(new Pipe());
        }, 1000);
    },

    frame(time) {
        // console.log("frame");
        this.time = time;

        ctx.clearRect(0, 0, c.width, c.height);

        this.bird.draw();
        for (let pipe of this.pipes) {
            pipe.draw();
            if (pipe.isColliding)
                game.end();
        }

        if (!this.bird.isStopped)
            this.frameId = requestAnimationFrame(this.frame);
    },

    end() {
        this.isRunning = false;
        clearInterval(this.pipeCreator);
    }
};

window.addEventListener("keydown", event => {
    if (event.key === " ")
        game.bird.jump();
});

game.frame = game.frame.bind(game);

game.start();