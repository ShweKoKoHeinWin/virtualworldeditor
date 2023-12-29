function getNearestPoint(current, points, threadHold = Number.MAX_SAFE_INTEGER) { //threadHold for limit distance
    let minDistance = Number.MAX_SAFE_INTEGER;  //initiate min distance with max safe integer
    let nearestPoint = null;

    for (const point of points) {
        const dist = distance(point, current);      //get distance between current and one of point
        if(dist < minDistance && dist < threadHold) {
            minDistance = dist;         //update the min distance to lower
            nearestPoint = point;
        }
    }
    return nearestPoint;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function isObject(variable) {
    return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
}

function add(p1, p2) {
    return new Point(
        p1.x + p2.x,
        p1.y + p2.y
    );
}

function substract(p1, p2) {
    return new Point(
        p1.x - p2.x, 
        p1.y - p2.y
    );
}

function scale(p, scalar) { //origin point , scalar
    return new Point(p.x * scalar, p.y * scalar);   // define the point with zoom
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    )
}

function angle(p) {
    return Math.atan2(p.y, p.x);
}

function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if(bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;

        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x : lerp(A.x, B.x, t),
                y : lerp(A.y, B.y, t),
                offset : t,
            };
        }
    }
    return null;
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}