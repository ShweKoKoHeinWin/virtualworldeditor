
class ParkingEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    creatingMarking(center, directionVector) {
        return new Parking(
            center,
            directionVector,
            world.roadWidth / 2,
            world.roadWidth / 2
        )
    }
}