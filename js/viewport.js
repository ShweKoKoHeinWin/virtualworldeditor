class Viewport{
    constructor(canvas, zoom = 1, offset = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.zoom = zoom;
        this.center = new Point(canvas.width / 2, canvas.height / 2);

        this.offset = offset ? offset : scale(this.center, -1);
        this.#dragReset();
        this.#addEventListener();
    }

    getMouse(event, substractDragOffset = false) {
        const p =  new Point(
            (event.offsetX - this.center.x) * this.zoom - this.offset.x,      // get the point correct by zoom
            (event.offsetY - this.center.y) * this.zoom - this.offset.y
        );

        return substractDragOffset ? substract(p, this.drag.offset) : p;    //if substruct true, for draging mycanva
    }

    getOffset() {
        return add(this.offset, this.drag.offset);
    }

    reset() {
        this.ctx.restore();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();         //save the before state
        this.ctx.translate(this.center.x, this.center.y);
        this.ctx.scale(1 / this.zoom , 1 / this.zoom);       //zooming
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y);
    }

    #addEventListener() {
        this.canvas.addEventListener('mousewheel', this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.#handleMouseUp.bind(this));
    }

    #handleMouseWheel(event) {
        const dir = Math.sign(event.deltaY);    //get direction of scrollY
        const step = 0.1;   
        this.zoom += dir * step;    
        this.zoom = Math.max(1, Math.min(5, this.zoom));    // Min 1 and Max 5
    }

    #handleMouseDown(event) {
        if(event.button == 1) {     //Mouse scroll wheel button click
            this.drag.start = this.getMouse(event);
            this.drag.active = true;
        }
    }

    #handleMouseMove(event) {
        if(this.drag.active) {
            this.drag.end = this.getMouse(event);
            this.drag.offset = substract(this.drag.end, this.drag.start);
        }
    }

    #handleMouseUp(event) {
        if(this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            this.#dragReset();
        }
    }

    #dragReset() {
        this.drag = {
            start : new Point(0, 0),
            end : new Point(0, 0),
            offset : new Point(0, 0),
            active : false
        }
    }
}