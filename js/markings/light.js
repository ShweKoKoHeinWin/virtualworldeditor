class Light extends Markings {
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);
        this.state = 'off';
        this.borders = this.polygon.segments[0];

        this.type = 'light';
    }

    draw(ctx) {
        const prep = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(prep, this.width / 2)),
            add(this.center, scale(prep, -this.width / 2))
        )
        const green = lerp2D(line.p1, line.p2, 0.2);
        const yellow = lerp2D(line.p1, line.p2, 0.5);
        const red = lerp2D(line.p1, line.p2, 0.8);

        new Segment(red, green).draw(ctx, {width: this.height , cap: 'round'})
    }
}