"use strict";
const c = document.getElementById("my-canvas");
const ctx = c.getContext("2d");

c.width = 450;
c.height = 800;

const jumpInitialVelocity = -1.25;
const gravity = 0.005;
const birdRadius = 20;
const birdX = c.width / 2;
const pipeSpeed = -0.2;
const pipeWidth = 86;
const pipeGap = 285;
const bottomDiagonalWidth = 10;
const groundY = 624;
let spaceKeyIsPressed = false;
let hasJumped = false;

const pipeBodyColors = [
    ["#81a94f", "#80a158", "#656450", "#5d5b47", 2],
    ["#b1ec67", "#b1e56c", "#797f58", "#71714d", 2],
    ["#d8fa84", "#d7f983", "#8b835f", "#7e735a", 2],
    ["#c3f175", "#c1ea74", "#82815b", "#767356", 2],
    ["#9de85a", "#9adf5b", "#717b4f", "#6b6d49", 8],
    ["#83ce40", "#85cb46", "#687548", "#646642", 2],
    ["#7ac537", "#77bd38", "#616e41", "#60623d", 2],
    ["#94df51", "#90d651", "#6d7a4e", "#6a6c49", 4],
    ["#75c02d", "#78be39", "#626f42", "#5f613d", 2],
    ["#74bf2e", "#74bb32", "#606d40", "#5f623b", 28],
    ["#73be2e", "#72bb30", "#5f6d3f", "#5e623b", 2],
    ["#74c42e", "#72be31", "#5f6f3e", "#5a643d", 2],
    ["#6eb12a", "#6ead32", "#5e663f", "#585c3b", 2],
    ["#517f22", "#517e20", "#52503a", "#524d36", 2],
    ["#639b26", "#62972e", "#585c3d", "#585439", 2],
    ["#71bd2e", "#73bb36", "#5c6a3e", "#5e5f3b", 2],
    ["#5c9222", "#618e27", "#5a5c3d", "#545337", 2],
    ["#547822", "#527523", "#53513c", "#524b39", 2],
    ["#558821", "#588226", "#55543e", "#575037", 2]
];



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
        this.isStopped = y > groundY;
        // console.log(y);
        if (y < 0 || this.isStopped)
            game.end();

        return this.isStopped ? groundY : y;
    }

    draw() {
        ctx.fillStyle = game.isRunning ? "yellow" : "red";
        ctx.beginPath();
        ctx.arc(birdX, this.y, birdRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Pipe {
    constructor() {
        this.y = Math.floor(Math.random() * (groundY - pipeGap - 50)) + 25 + pipeGap / 2;
        this.spawnTime = performance.now();
    }

    get x() {
        return c.width + pipeSpeed * (game.time - this.spawnTime);
    }

    draw() {
        const left = this.x - pipeWidth / 2;
        const bottom = this.y - (pipeGap / 2);
        const bodyBottom = bottom - 20;
        const top = this.y + (pipeGap / 2);
        const bodyTop = top + 20; 

        ctx.fillStyle = "#63828f";
        ctx.fillRect(left + 4, 0, 2, bodyBottom);
        ctx.fillRect(left + 4, bodyTop, 2, groundY - bodyTop);
        ctx.fillStyle = "#5e4949";
        ctx.fillRect(left + 6, 0, 2, bodyBottom);
        ctx.fillRect(left + 6, bodyTop, 2, groundY - bodyTop);
        let x = left + 8;
        for (let stripe of pipeBodyColors) {
            ctx.fillStyle = stripe[0];
            ctx.fillRect(x, 0, stripe[4], bodyBottom - 4);
            ctx.fillRect(x, bodyTop + 2, stripe[4], groundY - bodyTop - 2);
            ctx.fillStyle = stripe[1];
            ctx.fillRect(x, bodyBottom - 4, stripe[4], 2);
            ctx.fillStyle = stripe[2];
            ctx.fillRect(x, bodyBottom - 2, stripe[4], 2);
            ctx.fillStyle = stripe[3];
            ctx.fillRect(x, bodyTop, stripe[4], 2);
            x += stripe[4];
        }
        ctx.fillStyle = "#54503a";
        ctx.fillRect(left + 78, 0, 4, bodyBottom);
        ctx.fillRect(left + 78, bodyTop, 4, groundY - bodyTop);
        ctx.fillStyle = "#564153";
        ctx.fillRect(left + 80, 0, 2, bodyBottom);
        ctx.fillRect(left + 80, bodyTop, 2, groundY - bodyTop);
        ctx.fillStyle = "#69aab5";
        ctx.fillRect(left + 82, 0, 2, bodyBottom);
        ctx.fillRect(left + 82, bodyTop, 2, groundY - bodyTop);

        ctx.fillStyle = "#4f4041";
        ctx.fillRect(left, bodyBottom, pipeWidth, 2);



        
        // ctx.fillStyle = "#";
        // ctx.fillRect(left + 82, 0, 2, bodyBottom - 4);
        // ctx.fillStyle = "#";
        // ctx.fillRect(left + 84, 0, 2, bodyBottom - 4);


        // ctx.fillStyle = "green";
        // console.log("pipe @ %s", this.x);
        // ctx.fillRect(this.x - (pipeWidth / 2), 0, pipeWidth, this.y - (pipeGap / 2));
        // ctx.fillRect(this.x - (pipeWidth / 2), this.y + (pipeGap / 2), pipeWidth, groundY - this.y - (pipeGap / 2));
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

        // Sky
        ctx.fillStyle = "#71c6cf"; 
        ctx.fillRect(0, 0, c.width, groundY);

        // Brown Line
        ctx.fillStyle = "#575653";
        ctx.fillRect(0, groundY, c.width, 1);
        ctx.fillStyle = "#745c51";
        ctx.fillRect(0, 625, c.width, 2);

        // Light Green Line
        ctx.fillStyle = "#d8f484";
        ctx.fillRect(0, 627, c.width, 2);

        // console.log("Stripe shift: %s", Math.floor(time * pipeSpeed % bottomDiagonalWidth));
        // console.log("Stripe 1 pos: %s", 2 * (5 - 1) + bottomDiagonalWidth + (0 - 1) * 2 * bottomDiagonalWidth + Math.floor(time * pipeSpeed % bottomDiagonalWidth));

        // Stripes
        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = i === 0 ? "#a4e156" : i === 5 ? "#5e9728" : "#72bb2c"; // Dark stripes
            for (let j = 0; j <= c.width / (bottomDiagonalWidth * 2) + 1; j++) {
                ctx.fillRect(2 * (5 - i) + bottomDiagonalWidth + (j - 1) * 2 * bottomDiagonalWidth + Math.floor(time * pipeSpeed % (bottomDiagonalWidth * 2)), 629 + 2 * i, bottomDiagonalWidth, 2);
            }                
            ctx.fillStyle = i === 0 ? "#b9f56f" : i === 5 ? "#6ea838" : "#97df53"; // Light stripes
            for (let j = 0; j <= c.width / (bottomDiagonalWidth * 2) + 1; j++)
                ctx.fillRect(2 * (5 - i) + j * 2 * bottomDiagonalWidth + Math.floor(time * pipeSpeed % (bottomDiagonalWidth * 2)), 629 + 2 * i, bottomDiagonalWidth, 2);
        }

        // Dark Green Line
        ctx.fillStyle = "#628024";
        ctx.fillRect(0, 641, c.width, 2);

        // Transition to bottom
        ctx.fillStyle = "#c2a344";
        ctx.fillRect(0, 643, c.width, 2);
        ctx.fillStyle = "#dcbc6b";
        ctx.fillRect(0, 645, c.width, 2);

        // Bottom
        ctx.fillStyle = "#ddd894";
        ctx.fillRect(0, 647, c.width, c.height - 647);
        

        // ctx.drawImage("bg.png", 0, 0);

        if (spaceKeyIsPressed && !hasJumped) {
            this.bird.jump();
            hasJumped = true;
        }

        for (let pipe of this.pipes) {
            pipe.draw();
            if (pipe.isColliding)
                game.end();
        }

        this.bird.draw();

        if (!this.bird.isStopped)
            this.frameId = requestAnimationFrame(this.frame);
    },

    end() {
        this.isRunning = false;
        clearInterval(this.pipeCreator);
    }
};
game.frame = game.frame.bind(game);

function resize() {
    const scale = Math.min(1, window.innerHeight / c.height, window.innerWidth / c.width);
    c.style.transform = `translate(-50%, -50%) scale(${scale}, ${scale})`;
}
resize();

window.addEventListener("keydown", event => {
    if (event.key === " ") {
        spaceKeyIsPressed = true;
        if (event.target === document.body)
            event.preventDefault();
    }
});
window.addEventListener("keyup", event => {
    if (event.key === " ") {
        spaceKeyIsPressed = false;
        hasJumped = false;
    }
});
window.addEventListener("resize", resize);

game.start();