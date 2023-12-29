class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        const points = info.points.map((p) => new Point(p.x, p.y));
        const segments = info.segments.map((s) => new Segment(
            points.find((p) => p.equals(s.p1)),
            points.find((p) => p.equals(s.p2))
        ));

        return new Graph(points, segments);
    }


// Points
    addPoint(point) {
        this.points.push(point);
    }

    isContainPoint(point) {
        return this.points.find(p => p.equals(point));
    }

    tryAddPoint(point) {
        if(!this.isContainPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    removePoint(idx) {
        if(isObject(idx)) {
            idx = this.points.indexOf(idx)
        }
        let removedPoint = this.points.splice(idx, 1)[0];
        let segmentsToRemove = this.getSegmentsWithPoint(removedPoint);

        for(let seg of segmentsToRemove) {
            this.removeSegment(seg);
        }

        // below is work too
        // this.segments = this.segments.filter(function(seg, idx) {
        //     return !(seg.p1.equals(removedPoint) || seg.p2.equals(removedPoint))
        // })
    }


// Segments
    addSegment(seg) {
        this.segments.push(seg);
    }

    isContainSegment(seg) {
        return this.segments.find(s => s.equals(seg));
    }

    tryAddSegment(seg) {
        if(!this.isContainSegment(seg) && !seg.p1.equals(seg.p2)) {
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    removeSegment(idx) {
        if(isObject(idx)) {
            idx = this.segments.indexOf(idx)
        }
        this.segments.splice(idx , 1);
    }

    getSegmentsWithPoint(point) {
        return this.segments.filter(function(seg) {
            return seg.includes(point);
        })
    }

    draw(ctx) {
        for(const seg of this.segments) {
            seg.draw(ctx);
        }

        for(const point of this.points) {
            point.draw(ctx);
        }
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }
}