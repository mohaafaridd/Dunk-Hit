/* Variables */
var canvas, context, controller, ball, gem, loop, w, h, score, chain, bite, jump;

w = window.innerWidth;
h = window.innerHeight;

score = 0;
var scoreBoard = document.getElementById("points");

canvas = document.getElementById("playground");
context = canvas.getContext("2d");

canvas.width = w;
canvas.height = h;

/* Sounds */

chain = document.getElementById("chain");
bite = document.getElementById("bite");
jump = document.getElementById("jump")

/* Our beautiful ball */

ball = {
    radius: 32,
    juming_state: true,

    x_location: (w / 2),
    x_velocity: 0,

    y_location: (h / 2),
    y_velocity: 0
};

gem = {
    radius: 5,
    x_location: Math.random() * w,
    //y_location: Math.random() * (0.5 * h) + 0.2 * h
    y_location: (Math.random() * h * 0.6) + (h * 0.2)
}

/* Ball Movement Mangement */

controller = {

    left: false,
    right: false,
    up: false,


    keyListener: function (event) {

        var key_state = (event.type == "keydown") ? true : false;

        switch (event.keyCode) {

            // left key
            case 37:
                controller.left = key_state;
                break;

                // up key or space
            case 38:
            case 32:
                controller.up = key_state;
                break;

                // right key
            case 39:
                controller.right = key_state;
                break;
        }
    }
};

/* Physics */

loop = function () {


    /* Jumping */
    if (controller.up) {
        jump.pause();
        jump.currentTime = 0;
        ball.y_velocity -= 4;
        jump.play();
    }

    /* Moving Left */
    if (controller.left) {

        ball.x_velocity -= 1.5;
        chain.play();
    }

    /* Moving Right */
    if (controller.right) {

        ball.x_velocity += 1.5;
        chain.play();
    }

    /* To make the ball fall - simulating gravity */
    ball.y_velocity += 1.5;

    /* Changing the ball location */
    ball.x_location += ball.x_velocity;
    ball.y_location += ball.y_velocity;


    /* Ease-out animation */
    ball.x_velocity *= 0.9;
    ball.y_velocity *= 0.9;

    /* Lowest jumping point */
    if (ball.y_location > h - ball.radius) {
        ball.y_location = h - ball.radius;
        ball.y_velocity = 0;
        score = 0;
    }

    /* Highest Jumping point */
    if (ball.y_location < 0 + ball.radius) {
        ball.y_location = 0 + ball.radius;
        ball.y_velocity = 0;
        score = 0;
    }

    /* Spawn on the other Side */
    if (ball.x_location < -ball.radius) {
        ball.x_location = w;
    } else if (ball.x_location > w) {
        ball.x_location = -ball.radius;
    }

    /* Collision */
    var x = ball.x_location - gem.x_location;
    var y = ball.y_location - gem.y_location;

    var distance = Math.sqrt(x * x + y * y) - (ball.radius + gem.radius);


    if (distance <= 0) {
        bite.pause();
        bite.currentTime = 0;
        score++;
        gem.x_location = Math.random() * (w - 700);
        gem.y_location = (Math.random() * h * 0.6) + (h * 0.2);
        bite.play();
    }


    /* Colorizing background */
    context.fillStyle = "#202020";
    context.fillRect(0, 0, w, h);


    /* Draw a line */
    context.beginPath();
    context.setLineDash([5, 3]);
    context.moveTo(ball.x_location, ball.y_location);
    context.lineTo(gem.x_location, gem.y_location);
    context.lineWidth = 1;
    context.strokeStyle = "#FFF";
    context.stroke();

    /* Draw the gem */
    context.fillStyle = "#FFD700";
    context.beginPath();
    context.arc(gem.x_location, gem.y_location, gem.radius, 0, 2 * Math.PI);
    context.fill();

    /* Draw the ball */
    context.fillStyle = '#09c';
    context.beginPath();
    context.arc(ball.x_location, ball.y_location, ball.radius, 0, 2 * Math.PI);
    context.fill();
    scoreBoard.innerHTML = score;

    window.requestAnimationFrame(loop);
}

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener)
window.requestAnimationFrame(loop);
