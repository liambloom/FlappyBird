"use strict";
const c = document.getElementById("my-canvas");
const ctx = c.getContext("2d");

c.width = 450;
c.height = 800;

const jumpInitialVelocity = -0.7;
const gravity = 0.003;
const birdRadius = 20;
const birdWidth = 51;
const birdHeight = 36;
const birdX = (c.width - birdWidth) / 2;
const pipeSpeed = -0.2;
const pipeWidth = 86;
const pipeGap = 147;
const bottomDiagonalWidth = 10;
const groundY = 624;
const pipeTipHeight = 38;
const upwardRotationAngle = -0.43;
const pipeTimeGap = 1300;
const scoreY = 100;
const showHitboxesString = new URLSearchParams(location.search).get("showHitboxes");
let showHitboxes = false;
if (showHitboxesString === "true")
    showHitboxes = true;
else if (showHitboxesString !== "false" && showHitboxesString !== null)
    alert("Warning: Unrecognized value for 'showHitboxes'");
// const showHitboxes =  === "true";
let spaceKeyIsPressed = false;
let hasJumped = false;

const gameStates = {
    /***
     * The game has not started. The bird is going up and down in a sine wave
     */
    preGame: Symbol("preGame"),

    /**
     * The game is currently running
     */
    running: Symbol("running"),

    /**
     * The bird has died, but not yet hit the ground. The background and pipes are stationary, 
     * the restart menu appears. The only thing still happening is the bird falling to the ground.
     */
    dead: Symbol("dead"),

    /**
     * The game is over and the bird has hit the ground. No animation is playing.
     */
    over: Symbol("over")
};

const pipeBodyColors = [
    ["#81a94f", 2],
    ["#b1ec67", 2],
    ["#d8fa84", 2],
    ["#c3f175", 2],
    ["#9de85a", 8],
    ["#83ce40", 2],
    ["#7ac537", 2],
    ["#94df51", 4],
    ["#75c02d", 2],
    ["#74bf2e", 28],
    ["#73be2e", 2],
    ["#74c42e", 2],
    ["#6eb12a", 2],
    ["#517f22", 2],
    ["#639b26", 2],
    ["#71bd2e", 2],
    ["#5c9222", 2],
    ["#547822", 2],
    ["white", 2]
];
const pipeTipColors = [
    ["#6f8641", 2],
    ["#9de757", 2],
    ["#d1f47c", 2],
    ["#cdf67c", 2],
    ["#aae863", 2],
    ["#9be75a", 2],
    ["#97e352", 2],
    ["#7ec938", 2],
    ["#80cb3a", 2],
    ["#97e251", 2],
    ["#85d040", 2],
    ["#75c12f", 2],
    ["#75c12c", 2],
    ["#74bf2e", 34],
    ["#73be2d", 2],
    ["#75c030", 2],
    ["#74c22d", 2],
    ["#63a423", 2],
    ["#568120", 2],
    ["#6bab29", 2],
    ["#6fb82e", 2],
    ["#578820", 2],
    ["#517a24", 2],
    ["#537c26", 2]
];
const pipeGlareColors = [
    ["#71883f", 2],
    ["#6bbe29", 2],
    ["#87dc41", 2],
    ["#b6f169", 2],
    ["#d8fe82", 2],
    ["#e5ff8b", 2],
    ["#eaff90", 2],
    ["#e7ff8e", 28],
    ["#e7ff8c", 2],
    ["#edff8e", 2],
    ["#c1f971", 2],
    ["#9cee5e", 2],
    ["#d2ff7d", 2],
    ["#d9fe81", 2],
    ["#9eed5a", 2],
    ["#9fed5a", 2],
    ["#9deb58", 2],
    ["#9eec59", 6],
    ["#9dec59", 2],
    ["#9aec57", 2],
    ["#9bec59", 2],
    ["#93e451", 2],
    ["#7dcc37", 2],
    ["#5c9522", 2],
    ["#527f23", 2]
];


class Bird {
    constructor() {
        this.initialJumpPos = c.height / 2;
        this.jumpStartTime = performance.now();
    }

    jump() {
        if (game.state == gameStates.running || game.state == gameStates.preGame) {
            this.initialJumpPos = this.y;
            this.jumpStartTime = game.time;
            if (game.state == gameStates.preGame) {
                game.state = gameStates.running;
                this.pipeCreator = setInterval(() => {
                    game.pipes.push(new Pipe());
                }, pipeTimeGap);
            }
        }
    }

    get y() {
        const t = game.time - this.jumpStartTime;
        const y = this.initialJumpPos + jumpInitialVelocity * t + gravity * t * t / 2;
        if (game.state == gameStates.preGame) 
            return c.height / 2 + 20 * Math.sin(game.time * Math.PI / 375);
        else if (y > groundY) {// jshint ignore:line
            game.state = gameStates.over;
            return groundY;
        }
        else if (y < 0) // TODO: The game does not kill you if you hit the top. There is an invisable wall a bit above the top.
            game.state = gameStates.dead;

        return y;
    }

    draw() {
        let rotationAngle;
        if (game.state == gameStates.preGame)
            rotationAngle = 0;
        else {
            if (this.y >= this.initialJumpPos)
                rotationAngle = Math.atan((this.y - this.initialJumpPos) / 150 + Math.tan(upwardRotationAngle));
            else
                rotationAngle = upwardRotationAngle;
        }
        // ctx.rotate(rotationAngle);
        // const dx0 = birdX - birdWidth / 2;
        // const dy0 = this.y -  birdHeight / 2;
        // const hypotenuse = Math.sqrt(Math.pow(dx0, 2), Math.pow(dy0, 2));
        // const angle0 = Math.atan(dx0 / dy0);
        // const angle1 = rotationAngle - angle0;
        // const dx1 = hypotenuse * Math.sin(angle1);
        // const dy1 = hypotenuse * Math.cos(angle1);
        // ctx.translate(dx1 + birdWidth / 2, dy1 + birdHeight / 2);

        // const rotationMatrix = ctx.getTransform();
        // const x1 = rotationMatrix.a * x0 + rotationMatrix.c * y0;
        // const y1 = rotationMatrix.b * x0 + rotationMatrix.d * y0;
        // const dx = birdX - x1;
        // const dy = this.initialJumpPos - y1;
        // ctx.translate(-(rotationMatrix.a * dx + rotationMatrix.c * dy), rotationMatrix.b * dx + rotationMatrix.d * dy);

        const x = birdX - birdWidth / 2;
        const y = this.y - birdHeight / 2;
        ctx.translate(x + birdWidth / 2, y + birdHeight / 2);
        ctx.rotate(rotationAngle);
        ctx.translate(-x - birdWidth / 2, -y - birdHeight / 2);
        ctx.translate(x, y);
        // const angle0 = Math.atan(x0 / y0);
        // const angle1 = rotationAngle - angle0;
        // const hypotenuse = Math.sqrt(x0 * x0 + y0 * y0);
        // const x1 = hypotenuse * Math.sin(angle1);
        // const y1 = hypotenuse * Math.cos(angle1);
        // ctx.translate(0, 100);
        

        
        ctx.fillStyle = "#533846";
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(36, 0);
        ctx.lineTo(36, 3);
        ctx.lineTo(39, 3);
        ctx.lineTo(39, 6);
        ctx.lineTo(42, 6);
        ctx.lineTo(42, 9);
        ctx.lineTo(45, 9);
        ctx.lineTo(45, 18);
        ctx.lineTo(48, 18);
        ctx.lineTo(48, 21);
        ctx.lineTo(51, 21);
        ctx.lineTo(51, 24);
        ctx.lineTo(48, 24);
        ctx.lineTo(48, 30);
        ctx.lineTo(45, 30);
        ctx.lineTo(45, 33);
        ctx.lineTo(30, 33);
        ctx.lineTo(30, 36);
        ctx.lineTo(15, 36);
        ctx.lineTo(15, 33);
        ctx.lineTo(9, 33);
        ctx.lineTo(9, 30);
        ctx.lineTo(6, 30);
        ctx.lineTo(6, 24);
        ctx.lineTo(3, 24);
        ctx.lineTo(3, 21);
        ctx.lineTo(0, 21);
        ctx.lineTo(0, 12);
        ctx.lineTo(3, 12);
        ctx.lineTo(3, 9);
        ctx.lineTo(9, 9);
        ctx.lineTo(9, 6);
        ctx.lineTo(12, 6);
        ctx.lineTo(12, 3);
        ctx.lineTo(18, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fafce9";
        ctx.beginPath();
        ctx.moveTo(3, 12);
        ctx.lineTo(15, 12);
        ctx.lineTo(15, 15);
        ctx.lineTo(18, 15);
        ctx.lineTo(18, 18);
        ctx.lineTo(15, 18);
        ctx.lineTo(15, 21);
        ctx.lineTo(6, 21);
        ctx.lineTo(6, 18);
        ctx.lineTo(3, 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#f8ff2e";
        ctx.beginPath();
        ctx.rect(3, 18, 3, 3);
        ctx.rect(6, 21, 9, 3);
        ctx.rect(15, 18, 3, 3);
        ctx.rect(12, 6, 6, 3);
        ctx.rect(18, 3, 9, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#f9f124";
        ctx.beginPath();
        ctx.moveTo(15, 9);
        ctx.lineTo(18, 9);
        ctx.lineTo(18, 6);
        ctx.lineTo(24, 6);
        ctx.lineTo(24, 15);
        ctx.lineTo(27, 15);
        ctx.lineTo(27, 18);
        ctx.lineTo(30, 18);
        ctx.lineTo(30, 21);
        ctx.lineTo(27, 21);
        ctx.lineTo(27, 24);
        ctx.lineTo(18, 24);
        ctx.lineTo(18, 21);
        ctx.lineTo(21, 21);
        ctx.lineTo(21, 15);
        ctx.lineTo(18, 15);
        ctx.lineTo(18, 12);
        ctx.lineTo(15, 12);
        ctx.lineTo(15, 9);
        ctx.lineTo(18, 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#f9c22c";
        ctx.beginPath();
        ctx.moveTo(15, 24);
        ctx.lineTo(24, 24);
        ctx.lineTo(24, 27);
        ctx.lineTo(27, 27);
        ctx.lineTo(27, 30);
        ctx.lineTo(30, 30);
        ctx.lineTo(30, 33);
        ctx.lineTo(15, 33);
        ctx.lineTo(15, 30);
        ctx.lineTo(9, 30);
        ctx.lineTo(9, 27);
        ctx.lineTo(15, 27);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#f5f1f1";
        ctx.beginPath();
        ctx.rect(27, 9, 3, 6);
        ctx.rect(30, 15, 3, 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fdfffa";
        ctx.beginPath();
        ctx.moveTo(30, 3);
        ctx.lineTo(36, 3);
        ctx.lineTo(36, 6);
        ctx.lineTo(39, 6);
        ctx.lineTo(39, 9);
        ctx.lineTo(36, 9);
        ctx.lineTo(36, 15);
        ctx.lineTo(39, 15);
        ctx.lineTo(39, 9);
        ctx.lineTo(42, 9);
        ctx.lineTo(42, 18);
        ctx.lineTo(33, 18);
        ctx.lineTo(33, 15);
        ctx.lineTo(30, 15);
        ctx.lineTo(30, 9);
        ctx.lineTo(27, 9);
        ctx.lineTo(27, 6);
        ctx.lineTo(30, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#fd684b";
        ctx.beginPath();
        ctx.rect(30, 21, 18, 3);
        ctx.rect(27, 24, 3, 3);
        ctx.rect(30, 27, 15, 3);
        ctx.closePath();
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // ctx.fillStyle = 'gray';
        // ctx.fillRect(80, 60, 140, 30);

        // // Matrix transformation
        // ctx.translate(150, 75);
        // ctx.rotate(0.43);
        // ctx.translate(-150, -75);

        // // Rotated rectangle
        // ctx.fillStyle = 'red';
        // ctx.fillRect(80, 60, 140, 30);

        if (showHitboxes) {
            ctx.fillStyle = ctx.strokeStyle = (game.state == gameStates.preGame || game.state == gameStates.running) ? "yellow" : "red";
            ctx.beginPath();
            ctx.arc(birdX, this.y, birdRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

class Pipe {
    constructor() {
        this.y = Math.floor(Math.random() * (groundY - pipeGap - 2 * pipeTipHeight - 50)) + 25 + pipeGap / 2 + pipeTipHeight;
        this.spawnTime = performance.now();
        this.pointHasBeenAwarded = false;
    }

    get x() {
        return c.width + pipeSpeed * (game.time - this.spawnTime);
    }

    draw() {
        const left = this.x - pipeWidth / 2;
        const bottom = this.y - (pipeGap / 2);
        const bodyBottom = bottom - pipeTipHeight;
        const top = this.y + (pipeGap / 2);
        const bodyTop = top + pipeTipHeight; 

        ctx.fillStyle = "#63828f";
        ctx.fillRect(left + 4, 0, 2, bodyBottom);
        ctx.fillRect(left + 4, bodyTop, 2, groundY - bodyTop);
        ctx.fillStyle = "#5e4949";
        ctx.fillRect(left + 6, 0, 2, bodyBottom);
        ctx.fillRect(left + 6, bodyTop, 2, groundY - bodyTop);
        let x = left + 8;
        for (let stripe of pipeBodyColors) {
            ctx.fillStyle = stripe[0];
            ctx.fillRect(x, 0, stripe[1] + 2, bodyBottom/* - 4*/);
            ctx.fillRect(x, bodyTop /*+ 2*/, stripe[1] + 2, groundY - bodyTop/* - 2*/);
            // ctx.fillStyle = stripe[1];
            // ctx.fillRect(x, bodyBottom - 4, stripe[4] + 2, /* 2 */3);
            // ctx.fillStyle = stripe[2];
            // ctx.fillRect(x, bodyBottom - 2, stripe[4] + 2, /* 2 */2);
            // ctx.fillStyle = stripe[3];
            // ctx.fillRect(x, bodyTop, stripe[4] + 2, 2);
            x += stripe[1];
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
        ctx.fillRect(left, bodyBottom, pipeWidth, pipeTipHeight);
        ctx.fillRect(left, top, pipeWidth, pipeTipHeight);
        ctx.globalAlpha = 0.1;
        ctx.fillRect(left + 8, bodyBottom - 4, x - left - 8, 2);
        ctx.fillRect(left + 8, bodyTop + 2, x - left - 8, 2);
        ctx.globalAlpha = 0.4;
        ctx.fillRect(left - 2, bodyBottom, pipeWidth + 4, pipeTipHeight);
        ctx.fillRect(left, bodyBottom - 2, pipeWidth, pipeTipHeight + 4);
        ctx.fillRect(left - 2, top, pipeWidth + 4, pipeTipHeight);
        ctx.fillRect(left, top - 2, pipeWidth, pipeTipHeight + 4);
        // ctx.fillRect(left + 8, bodyBottom - 2, x - left - 8, 2);
        // ctx.fillRect(left + 8, bodyTop, x - left - 8, 2);
        ctx.globalAlpha = 1;

        x = left + 2;
        for (let stripe of pipeTipColors) {
            ctx.fillStyle = stripe[0];
            ctx.fillRect(x, bodyBottom + 2, stripe[1] + 2, bottom - bodyBottom - 4);
            ctx.fillRect(x, top + 2/*+ 2*/, stripe[1] + 2, bodyTop - top - 4/* - 2*/);
            // ctx.fillStyle = stripe[1];
            // ctx.fillRect(x, bodyBottom - 4, stripe[4] + 2, /* 2 */3);
            // ctx.fillStyle = stripe[2];
            // ctx.fillRect(x, bodyBottom - 2, stripe[4] + 2, /* 2 */2);
            // ctx.fillStyle = stripe[3];
            // ctx.fillRect(x, bodyTop, stripe[4] + 2, 2);
            x += stripe[1];
        }

        x = left + 2;
        for (let stripe of pipeGlareColors) {
            ctx.fillStyle = stripe[0];
            ctx.fillRect(x, bottom - 6, stripe[1] + 2, 4);
            ctx.fillRect(x, top + 2, stripe[1] + 2, 4);
            x += stripe[1];
        }

        ctx.fillStyle = "#4f4041";
        ctx.globalAlpha = 0.4;
        ctx.fillRect(left + 2, bodyBottom + 2, x - left/* - 2*/, 2);
        ctx.fillRect(left + 2, bodyTop - 4, x - left/* - 2*/, 2);
        ctx.fillRect(left + 2, bottom - 4, x - left/* - 2*/, 2);
        ctx.fillRect(left + 2, top + 2, x - left/* - 2*/, 2);
        ctx.globalAlpha = 0.1;
        ctx.fillRect(left + 2, bodyBottom + 4, x - left/* - 2*/, 2);
        ctx.fillRect(left + 2, bodyTop - 6, x - left/* - 2*/, 2);
        ctx.fillStyle = "#ccef9f";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(left + 2, bottom - 8, x - left/* - 2*/, 2);
        ctx.fillRect(left + 2, top + 6, x - left/* - 2*/, 2);

        if (showHitboxes) {
            ctx.fillStyle = ctx.strokeStyle = "green";// game.isRunning ? "yellow" : "red";
            ctx.beginPath();
            ctx.rect(this.x - pipeWidth / 2, 0, pipeWidth, this.y - pipeGap / 2);
            // console.log("hitbox height: %s", c.height - this.y - pipeGap / 2);
            ctx.rect(this.x - pipeWidth / 2, this.y + pipeGap / 2, pipeWidth, c.height - this.y - pipeGap / 2);
            // ctx.arc(birdX, this.y, birdRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.globalAlpha = 0.3;
            ctx.fill();
            ctx.globalAlpha = 1;
        }


        ctx.globalAlpha = 1;


        // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        // ctx.strokeStyle = "red";
        // ctx.fillRect(this.x - (pipeWidth / 2), 0, pipeWidth, this.y - (pipeGap / 2));
        // ctx.strokeRect(this.x - (pipeWidth / 2), 0, pipeWidth, this.y - (pipeGap / 2));
        // ctx.fillRect(this.x - (pipeWidth / 2), this.y + (pipeGap / 2), pipeWidth, c.height - (this.y + (pipeGap / 2)));
        // ctx.strokeRect(this.x - (pipeWidth / 2), this.y + (pipeGap / 2), pipeWidth, c.height - (this.y + (pipeGap / 2)));
        
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

    get isOffScreen() {
        return this.x + pipeWidth / 2 < 0;
    }

    get addPoint() {
        const r = !this.pointHasBeenAwarded && this.x < birdX;
        if (r)
            this.pointHasBeenAwarded = true;
        return r;
    }
}

const game = {
    state: gameStates.preGame,
    score: 0,
    pipes: [],

    start() {
        this.bird = new Bird();
        this.frameId = requestAnimationFrame(this.frame);
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

        for (let i = 0; i < this.pipes.length; i++) {
            const pipe = this.pipes[i];
            pipe.draw();
            if (pipe.isOffScreen)
                this.pipes.splice(i--, 1);
            else if (pipe.isColliding)
                game.state = gameStates.dead;
            else if (pipe.addPoint && this.state == gameStates.running)
                this.score++;
        }

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.font = "64px Dustfine";
        if (document.fonts.check(ctx.font)) {
            const scoreX = (c.width - ctx.measureText(this.score).width) / 2;
            ctx.fillText(this.score, scoreX, scoreY);
            ctx.strokeText(this.score, scoreX, scoreY);
        }
        else 
            document.fonts.load(ctx.font);
        
        ctx.lineWidth = 1;

        if (spaceKeyIsPressed && !hasJumped) {
            this.bird.jump();
            hasJumped = true;
        }

        this.bird.draw();

        if (game.state != gameStates.over)
            this.frameId = requestAnimationFrame(this.frame);
        else
            clearInterval(this.pipeCreator);
    },
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