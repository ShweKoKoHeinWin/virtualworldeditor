class Car {
    constructor(x, y, width, height, controlType, angle = 0, maxSpeed = 3, color = "blue") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;

        this.angle = angle;
        this.isDamaged = false;

        this.fitness = 0;
        
        this.useBrain = controlType == 'Ai';

        if (controlType != 'Dummy') {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        

        this.controls = new Controls(controlType);
        this.img = new Image();
        this.img.src = 'car.png';

        this.mask = document.createElement('canvas');
        this.mask.width = width;
        this.mask.height = height;

        const maskCtx = this.mask.getContext('2d');
        this.img.onload = () => {
            maskCtx.fillStyle = color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();
            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        }
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;    //get the cross line of a square and half it for radius
        const alpha= Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })
       
        return points;
    }

    update(roadBorders, traffics) {
        if(!this.isDamaged) {
            this.#move();
            this.fitness += this.speed;
            this.polygon = this.#createPolygon();
            this.isDamaged = this.#accessDamage(roadBorders, traffics);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffics);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);

            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
        
    }

    #move() {
        if(this.controls.forward) {     // move forward + the speed
            this.speed += this.acceleration;
        }

        if(this.controls.reverse) {     // move backward - the speed
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed) {    // limit the forward speed 
            this.speed = this.maxSpeed;
        }

        if(this.speed < -this.maxSpeed / 2) {   // limit the backward speed
            this.speed = -this.maxSpeed / 2;
        }

        if(this.speed > 0) {        // if speed is over 0( car is move forward ) - the friction
            this.speed -= this.friction;
        }

        if(this.speed < 0) {         // if speed is below 0( car is move backward ) + the friction
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction) {  // when speed value is < friction (To solve moveing .0000 value)
            this.speed = 0;
        }

        if(this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controls.left) {
                this.angle += 0.025 * flip;
            }
            if(this.controls.right) {
                this.angle -= 0.025 * flip;
            }
        }

       
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #accessDamage(roadBorders, traffics) {
        for (let i = 0; i < roadBorders.length; i++) {
           if (polyIntersect(this.polygon, roadBorders[i])) {
                return true;
           }
        }
        for (let i = 0; i < traffics.length; i++) {
            if (polyIntersect(this.polygon, traffics[i].polygon)) {
                 return true;
            }
         }
        return false;
    }

    draw(ctx, drawSenser) {
        if (this.sensor && drawSenser) {
            this.sensor.draw(ctx);
       }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if(!this.isDamaged) {
             ctx.drawImage(this.mask, -this.width / 2, -this.height / 2, this.width, this.height);

            ctx.globalCompositeOperation = 'multiply';
        }
       

        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();

        // if(this.isDamaged) {
        //     ctx.fillStyle = 'gray';
        // } else {
        //     ctx.fillStyle = color;
        // }
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        // for(let i = 1; i < this.polygon.length; i++) {
        //     ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        // }
        // ctx.fill();

        // ctx.save();
        // ctx.translate(this.x, this.y);
        // ctx.rotate(-this.angle);

        // ctx.beginPath();
        // ctx.rect(
        //     -this.width / 2,    //center the rectangle
        //     -this.height / 2,
        //     this.width,
        //     this.height
        // );        
        // ctx.fillStyle = 'red';
        // ctx.fill();
        // ctx.restore();

        // ctx.rect(
        //     this.x - this.width / 2,    //center the rectangle
        //     this.y - this.height / 2,
        //     this.width,
        //     this.height
        // );

 
       
    }
}