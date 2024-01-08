class CrossEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.graph.segments);
    }

    creatingMarking(center, directionVector) {
        return new Cross(
            center,
            directionVector,
            world.roadWidth,
            world.roadWidth / 2
        )
    }
}