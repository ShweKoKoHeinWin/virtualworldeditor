class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;
        this.targetSegments = targetSegments;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.mouse = null;
        this.intent = null;
        this.targetSegments = targetSegments;

        this.markings = world.markings;
    }

    creatingMarking(center, directionVector) {
        return center;
    }

    enable() {
        this.#addEventListeners();
    }

    disable() {
        this.#removeEventListeners();
    }

    #addEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundMouseRight = (event) => {
            event.preventDefault();
        };
        // On hover
        this.canvas.addEventListener('mousemove', this.boundMouseMove);

        // On mouse down
        this.canvas.addEventListener('mousedown', this.boundMouseDown)// we use arrow function or .bind(this) for this keyword as global

        // On right click
        this.canvas.addEventListener('contextmenu', this.boundMouseRight)
    }

    #removeEventListeners() {
        // On hover
        this.canvas.removeEventListener('mousemove', this.boundMouseMove);

        // On mouse down
        this.canvas.removeEventListener('mousedown', this.boundMouseDown)// we use arrow function or .bind(this) for this keyword as global

        // On right click
        this.canvas.removeEventListener('contextmenu', this.boundMouseRight )
    }

    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event, true);
        const seg = getNearestSegment(
            this.mouse, 
            this.targetSegments, 
            10 * this.viewport.zoom
        ); //hover one is the nearest point

        if(seg) {
            const proj = seg.projectPoint(this.mouse);
            if(proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.creatingMarking(
                    proj.point,
                    seg.directionVector()
                ); 
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
    }

    #handleMouseDown(event) {
        if(event.button == 0) {
            if(this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }

        if(event.button == 2) {
            for(let i = 0; i < this.markings.length; i++) {
                const poly = this.markings[i].polygon;
                console.log(this.markings[i])
                if(poly.containsPoint(this.mouse)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    display() {
        if(this.intent) {
            this.intent.draw(this.ctx)
        }
    }
}