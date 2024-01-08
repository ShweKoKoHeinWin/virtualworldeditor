class World {
    constructor(graph, roadWidth = 100, roadRoundness = 10, buildingWidth = 150, buildingMinLength = 150, spacing = 50, treeSize = 160) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.buildingMinLength = buildingMinLength;
        this.buildingWidth = buildingWidth;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.buildings = [];
        this.trees = [];
        this.roadBorders = [];
        this.envelopes = [];
        this.laneGuides = [];
        this.markings = [];

        this.generate();
    }

    static load(info) {
        // return new World(Graph.load(info.graph));
        const world = new World(new Graph());
        world.graph = Graph.load(info.graph);
        world.roadWidth = info.roadWidth;
        world.roadRoundness = info.roadRoundness;

        world.buildingMinLength = info.buildingMinLength;
        world.buildingWidth = info.buildingWidth;
        world.spacing = info.spacing;
        world.treeSize = info.treeSize;

        world.envelopes = info.envelopes.map(e => Envelope.load(e));
        world.roadBorders = info.roadBorders.map(b => new Segment(b.p1, b.p2));
        world.buildings = info.buildings.map(b => Building.load(b));
        world.trees = info.trees.map(t => new Tree(t.center, info.treeSize));
        world.laneGuides = info.laneGuides.map(g => new Segment(g.p1, g.p2));

        world.markings = info.markings.map(m => Markings.load(m));

        world.zoom = info.zoom;
        world.offset = info.offset;
        return world;
    }

    generate() {
        this.envelopes.length = 0;
        for(const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            )
        }
        // this.intersections = Polygon.break(
        //     this.envelopes[0].polygon,
        //     this.envelopes[1].polygon
        // )

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.polygon));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
        console.log(this.laneGuides)
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for(const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg, this.roadWidth / 2, this.roadRoundness)
            )
        }

        const segments = Polygon.union(tmpEnvelopes.map(e => e.polygon));
        return segments;
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for(const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(seg, this.roadWidth + this.buildingWidth + this.spacing * 2, this.roadRoundness)
            )
        }
        const guides = Polygon.union(tmpEnvelopes.map(e => e.polygon));

        for(let i = 0; i < guides.length; i++) {
            const seg = guides[i];
            if(seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;        //since remove an item guides.length will decrease 1 so need to i-- so that we dont skip one item;
            }
        }
        const supports = [];
        for(let seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(len / (this.buildingMinLength + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;
            const dir = seg.directionVector();
            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));     //add first segment in available area

            for(let i = 2; i < buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2)); // add other segment in available area after first one
            }
        }

        const bases = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg, this.buildingWidth).polygon);
        }
        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++) {
            for (let j = i + 1; j < bases.length; j++) {
                if(bases[i].intersectPoly(bases[j]) || bases[i].distanceToPoly(bases[j]) < this.spacing - eps) {
                    bases.splice(j, 1);         //remove building that intersect
                    j--;
                }
            }
        }
        return bases.map(b => new Building(b));
    }

    #generateTrees() {
        console.log(this.buildings)
        const trees = [];
        const points = [
            ...this.roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b => b.base.points).flat()
        ];

        const left = Math.min(...points.map(p => p.x));     //map's left
        const right = Math.max(...points.map(p => p.x));    //map's right
        const top = Math.min(...points.map(p => p.y));      //map'stop
        const bottom = Math.max(...points.map(p => p.y));   //map's bottom
        
        const illegalPolys = [
            ...this.buildings.map(b => b.base),
            ...this.envelopes.map(e => e.polygon)
        ];  //define unwanted point like already existed objects

        let tryCount = 0;
        while(tryCount < 100) { //this will do untill no space for tree
            const p = new Point(    //create a new random point
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            );

            let keep = true;
            for(const poly of illegalPolys) {   //check if current point is same / close to  unwanted point remove it
                if(poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
                    keep = false;
                    break;
                }
            }

            if(keep) {
                for(const tree of trees) {  //if(distance between existed tree and new point regenarate)
                    if(distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            if(keep) {
                let closeToSomething = false;
                for(const poly of illegalPolys) {   //Control trees not to exist too far from build and road
                    if(poly.distanceToPoint(p) < this.treeSize) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if(keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    draw(ctx, viewPoint) {
        for (const env of this.envelopes) {
            env.draw(ctx, {fill: '#bbb', stroke: '#bbb', lineWidth: 15});
        }
        // for (const inter of this.intersections) {
        //     inter.draw(ctx, {color :'red', size: 6});
        // }
        for(const seg of this.graph.segments) {
            seg.draw(ctx, {color: 'white', width: 5, dash: [10, 10]});
        }
        for(const seg of this.roadBorders) {
            seg.draw(ctx, {color : 'white', width: 5});
        }

        const objects = [...this.buildings, ...this.trees]; //combine all objects
        objects.sort(       
            (a, b) => {
                return b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint) //sort by viewPoint closer first
            }
        );

        for(const object of objects) {
            object.draw(ctx, viewPoint);    //then draw by sorting
        }

        for(const marking of this.markings) {
            marking.draw(ctx);
        }

        // for(const seg of this.laneGuides) {
        //     seg.draw(ctx, {color: 'red'});
        // }

        // for(const bld of this.buildings) {
        //     bld.draw(ctx, viewPoint);
        // }

        // for(const tree of this.trees) {
        //     tree.draw(ctx, viewPoint);
        // }
    }
}