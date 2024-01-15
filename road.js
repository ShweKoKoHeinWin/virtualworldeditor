class Road {
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 100000;
        this.top = -infinity;
        this.bottom = infinity;

        this.topLeft = {x: this.left, y: this.top};
        this.topRight = {x: this.right, y: this.top};
        this.bottomLeft = {x: this.left, y: this.bottom};
        this.bottomRight = {x: this.right, y: this.bottom};

        this.borders = [
            [this.topLeft, this.bottomLeft],
            [this.topRight, this.bottomRight]
        ]
    }

    getLaneCenter(lane) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 + laneWidth * (lane % (this.laneCount));
    }

    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';

        for(let i = 0; i <= this.laneCount; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount      // between 0 and 1
            );

            if(i > 0 && i < this.laneCount) {
                if((this.laneCount % 2 )== 0 && i == this.laneCount / 2) {
                    ctx.setLineDash([]);
                } else {
                    ctx.setLineDash([20, 20]);
                }
                ctx.beginPath();
                ctx.moveTo(x, this.top);
                ctx.lineTo(x, this.bottom);
                ctx.stroke();
            }     
        }

        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        })
    }
}
