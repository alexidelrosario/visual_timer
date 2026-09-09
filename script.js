import { CircleTimer } from './CircleTimer.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById("circleTimer");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const startButton = document.getElementById("startButton");
    const hoursInput = document.getElementById("hoursInput");
    const minutesInput = document.getElementById("minutesInput");
    const secondsInput = document.getElementById("secondsInput");

    class Timer {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.timer = new CircleTimer(this);
        }

        update(deltaTime) {
            this.timer.update(deltaTime);
        }

        draw(context) {
            this.timer.draw(context);
        }
    }

    const timer = new Timer(canvas.width, canvas.height);

    startButton.addEventListener("click", function() {
        const hrs = parseInt(hoursInput?.value) || 0;
        const mins = parseInt(minutesInput?.value) || 0;
        const secs = parseInt(secondsInput?.value) || 0;
        timer.timer.setTimer(hrs, mins, secs);
    });

    let lastTime = 0;

    function animate(timeStamp){
        if (!lastTime) lastTime = timeStamp;

        let deltaTime = (timeStamp - lastTime) / 1000;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        timer.update(deltaTime);
        timer.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        timer.width = canvas.width;
        timer.height = canvas.height;
    });
});