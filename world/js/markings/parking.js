class Parking extends Markings {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [this.polygon.segments[0],this.polygon.segments[1],this.polygon.segments[2], this.polygon.segments[3]];

        this.type = 'parking';
    }

    draw(ctx) {
        // this.polygon.draw(ctx);
        for(const border of this.borders) {
            border.draw(ctx, {width: 5, color: 'white'});
        }
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - (Math.PI / 2));
        ctx.scale(1, 3);

        ctx.beginPath();
        ctx.fillStyle = 'transparent';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.beginPath();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + this.height * 0.4 + 'px Arial';
        ctx.fillText('P', 0, 3);

        ctx.restore();
    }
}