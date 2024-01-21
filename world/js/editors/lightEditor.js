class LightEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    creatingMarking(center, directionVector) {
        console.log('okok')
        return new Light(
            center,
            directionVector,
            world.roadWidth / 2,
            20
        )
    }
}