class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 0; i <= points.length; i++) {
            this.segments.push(
                new Segment(
                    points[i - 1], points[i % points.length]    //points[i % points.length] will connect last point with first point
                )
            );
        }
    }

    static break(poly1, poly2) {
        const seg1 = poly1.segments;
        const seg2 = poly2.segments;
        const intersections = [];

        for(let i = 0; i < seg1.length; i++) {
            for(let j = 0; i < seg2.length; j++) {
                const inter = getIntersection(
                    seg1[i].p1, 
                    seg1[i].p2, 
                    seg2[j].p1,
                    seg2[j].p2
                );
            }
        }

        if(!!inter && inter.offset != 1 && inter.offset != 0) {
            const point = new Point(int.x, int.y);
            intersections.push(point);
        }
        return intersections;
    }

    draw(ctx, {stroke = 'blue', lineWidth = 2, fill = "rgba(0, 0, 255, 0.3)"} = {}) {
        ctx.beginPath();
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        for(let p = 1; p < this.points.length; p++) {
            ctx.lineTo(this.points[p].x, this.points[p].y);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}