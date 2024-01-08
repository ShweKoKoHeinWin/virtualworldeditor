class Tree {
    constructor(center, size, heightCoef = 0.3) {
        this.center = center;
        this.size = size;
        this.heightCoef = heightCoef;
        this.base = this.#generateLevel(center, size);
    }

    #generateLevel(point, size) {
        const points = [];
        const rad = size / 2;
        for(let a = 0; a < Math.PI * 2; a+= Math.PI / 16) {  // Loop over angles in increments of Math.PI / 16
            const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2; // Calculate a kind of random value based on the cosine function
            const noisyRadius = rad * lerp(0.5, 1, kindOfRandom);  // Interpolate between 0.5 and 1 using the kindOfRandom value
            points.push(translate(point, a, noisyRadius));
        }
        return new Polygon(points);
    }

    draw(ctx, viewPoint) {
        const diff = substract(this.center, viewPoint);
        // this.center.draw(ctx, {size : this.size, color : 'green'});

        const top = add(this.center, scale(diff, this.heightCoef)); //perspective

        const levelCount = 7;
        for(let level = 0; level < levelCount; level++) {
            const t = level / (levelCount - 1);
            const color = 'rgb(30, ' + lerp(50, 200, t) + ',70)';
            const size = lerp(this.size, 40, t);
            const point = lerp2D(this.center, top, t);
            // point.draw(ctx, {size, color});
            const poly = this.#generateLevel(point, size);
            poly.draw(ctx, {fill: color, stroke: 'rgba(0, 0, 0, 0)'});
        }
        // new Segment(this.center, top).draw(ctx);
        // this.base.draw(ctx);
    }
}