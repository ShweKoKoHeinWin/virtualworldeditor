class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext('2d');
        this.isSelected = null;
        this.isHovered = null;
        this.mouse = null;
        this.isDragging = false;
        this.#addEventListeners();
        
    }

    #addEventListeners() {
        // On hover
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));

        // On mouse down
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this))// we use arrow function or .bind(this) for this keyword as global

        this.canvas.addEventListener('mouseup', (event) => {
            if(!!this.isDragging) {
                this.isDragging = false;
            }
        })

        // On right click
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        })
    }

    #handleMouseMove(event) {
        this.mouse = this.viewport.getMouse(event, true);
        this.isHovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom); //hover one is the nearest point
        if(!!this.isDragging) {
            this.isSelected.x = this.mouse.x;
            this.isSelected.y = this.mouse.y;
        }
    }

    #handleMouseDown(event) {
        if(event.button == 2) { //check if click is right click
            if(this.isSelected) {       //check this first to prevent remove point while selected on a point
                this.isSelected = null;     // when click without hover (on free space) make unselected
            } else if(this.isHovered) {
                this.#removePoint(this.isHovered);
            }
        }
        if(event.button == 0) { // when left click

            if(this.isHovered) {    //check if currently is on a existed point
                this.#select(this.isHovered);
                this.isDragging = true;
                return;
            }
      
            this.graph.addPoint(this.mouse);         

            this.#select(this.mouse);
            this.isHovered = this.mouse              // On click it is also hovered too
        }
    }

    #select(point) {
        if(this.isSelected) {
            this.graph.tryAddSegment(new Segment(this.isSelected, point));
        }
        this.isSelected = point;
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.isHovered = null;
        if(this.isSelected == point) {
            this.isSelected = null;
        }
    }

    display() {
        this.graph.draw(this.ctx);

        if(!!this.isHovered) {
            this.isHovered.draw(this.ctx, {fill : true});
        }

        if(!!this.isSelected) {
            const intent = this.isHovered ? this.isHovered : this.mouse;    // for Draw on selected and mousemove when hover on a point draw to that point
            new Segment(this.isSelected, intent).draw(this.ctx, {dash : [3, 3]});  // Draw on selected and mousemove for user to know where will going to draw
            this.isSelected.draw(this.ctx, {outline : true});
        }
    }

    dispose() {
        this.graph.dispose();
        this.isSelected = null;
        this.isHovered = null;
    }
}