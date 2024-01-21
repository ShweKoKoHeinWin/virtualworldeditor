class Cross extends Markings {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.borders = [this.polygon.segments[0], this.polygon.segments[2]];

        this.type = 'cross';
    }

    draw(ctx) {
        // this.polygon.draw(ctx);
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        )
        line.draw(ctx, {width: this.height, color: 'white', dash: [11, 11]});
        // for(const b of this. borders) {
        //     b.draw(ctx)
        // }
    }
}