let timerColor = "#719dd6";

export class CircleTimer {
    constructor(timer) {
        this.timer = timer;
        this.x = 400;
        this.y = 400;
        this.radius = 250;

        this.totalTime = 60;
        this.remainingTime = 60;
        this.currentAngle = 2 * Math.PI;
        this.isRunning = false;

        // Finished timer flashing 
        this.isFinished = false;
        this.isFlashing = false;
        this.flashInterval = 100;
        this.flashTimer = 0;
        this.flashCount = 0; 
    }

    setTimer(hours = 0, minutes = 0, seconds = 0) {
        const totalInSeconds = (Number(seconds) || 0) + 
                            ((Number(minutes) || 0) * 60) + 
                            ((Number(hours) || 0) * 3600);

        if (totalInSeconds > 0) {
            this.totalTime = totalInSeconds;
            this.remainingTime = totalInSeconds;
            this.currentAngle = 2 * Math.PI;
            this.isRunning = true;
        }

        // reset finished state with timer reset
        this.isFinished = false;
        this.isFlashing = false;
        this.flashTimer = 0;
        this.flashCount = 0;
    }

    update(deltaTime) {
        // Timer Countdown
        if (this.isRunning) {
            if (this.remainingTime > 0) {
                this.remainingTime -= deltaTime;
            } else {
                this.remainingTime = 0;
                this.isRunning = false;
                this.isFinished = true; 
            }

            this.currentAngle = (this.remainingTime / this.totalTime) * 2 * Math.PI;
        }

        // Finished timer, flash -> solid pink screen until timer reset
        if (this.isFinished) {
            const deltaMs = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
            this.flashTimer += Math.min(deltaMs, 100);

            if (this.flashCount < 10) {
                if (this.flashTimer >= this.flashInterval) {
                    this.isFlashing = !this.isFlashing; 
                    this.flashCount++;
                    this.flashTimer = 0;
                }
            } 
            else {
                this.isFlashing = true;
            }
        }
    }

    formatTime(seconds) {
        const totalSecs = Math.ceil(seconds);
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        const pad = (num) => String(num).padStart(2, '0');

        if (hrs > 0) {
            return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
        } else {
            return `${pad(mins)}:${pad(secs)}`;
        }
    }

    draw(context) {
        const centerX = context.canvas.width / 2;
        const centerY = context.canvas.height / 2;
        const dynamicRadius = Math.min(context.canvas.width, context.canvas.height) * 0.30;

        // Draw flashing/solid pink screen when timer is finished
        if (this.isFinished && this.isFlashing) {
            context.save();
            context.fillStyle = "#ebbdeb";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
        }

        // Finished timer text
        if (this.isFinished) {
            context.save();
            context.font = "bold 32px sans-serif";
            context.fillStyle = "#1f2c59";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText("Done!", centerX, centerY);
            context.restore();
        }
        
        // Draw circle timer when active
        if (this.remainingTime > 0) {
            context.save();
            context.beginPath();
            context.arc(centerX, centerY, dynamicRadius, 0, this.currentAngle);
            context.lineTo(centerX, centerY); 
            context.lineTo(centerX + dynamicRadius, centerY + 4); 
            context.fillStyle = timerColor; 
            context.fill();
            context.lineWidth = 8;
            context.strokeStyle = "#4f6cb2";
            context.stroke();
            context.restore();

            // Remaining time display
            context.save();
            context.font = "bold 48px sans-serif";
            context.fillStyle = "#ebbdeb";
            context.textAlign = "center";
            context.textBaseline = "bottom";
            const timeString = this.formatTime(this.remainingTime);
            context.fillText(timeString, centerX, centerY - dynamicRadius);
            context.restore();
        }
    }
}