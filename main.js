const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");
const miniMapCanvas = document.getElementById('miniMapCanvas');
// World objet > get from localstorage or create one
// const worldString = localStorage.getItem('world');
// const worldInfo = worldString ? JSON.parse(worldString) : null;
// const world = worldInfo ?  World.load(worldInfo) : new World(new Graph());
// const graph = world.graph;


miniMapCanvas.width = 300;
miniMapCanvas.height = 300;
carCanvas.width = window.innerWidth - 350;
networkCanvas.width = 300;
carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight - 400;
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
// const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const miniMap = new MiniMap(miniMapCanvas, world.graph, 300);
const N = 1;
const cars = generateCars(N);
// car.draw(ctx);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}
const traffics = [
  // new Car(road.getLaneCenter(1), -250, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -100, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -100, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -350, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -300, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -500, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -650, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -200, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -800, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -950, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -800, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -700, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -250, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -100, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -1000, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -1350, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -1300, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -1500, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -1650, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -1200, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -1800, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(1), -1950, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(0), -1800, 30, 50, 'Dummy', 2, getRandomColor()),
  // new Car(road.getLaneCenter(2), -1700, 30, 50, 'Dummy', 2, getRandomColor())
];

function generateCars(N) {
    const startPoints = world.markings.filter(m => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir) + Math.PI / 2;
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(startPoint.x, startPoint.y, 30, 50, "Ai", startAngle, 2));
  }
  return cars;
}
// let roadBorders = world.buildings.map(b => b.base.segments).flat().map(s => [s.p1, s.p2]);
let roadBorders = world.roadBorders.map(s => [s.p1, s.p2]);
animate();

function animate(time) {
  for (let i = 0; i < traffics.length; i++) {
    traffics[i].update(roadBorders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(roadBorders, traffics);
  }
  bestCar = cars.find((c) => c.fitness == Math.max(...cars.map((c) => c.fitness)));

  world.cars = cars;
  world.bestCar = bestCar;

  viewport.offset.x = -bestCar.x;
  viewport.offset.y = -bestCar.y;

  viewport.reset();
  const viewPoint = scale(viewport.getOffset(), - 1);
  world.draw(carCtx, viewPoint, false);

  miniMap.update(viewPoint);

  // ctx.clearRect(0,0, canvas.width, canvas.height);
  // car.update(road.borders);

  // carCtx.save();
  // carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  // road.draw(carCtx);

  for (let i = 0; i < traffics.length; i++) {
    traffics[i].draw(carCtx, "red");
  }
//   carCtx.globalAlpha = 0.2;
//   for (let i = 0; i < cars.length; i++) {
//     cars[i].draw(carCtx, "blue");
//   }
//   carCtx.globalAlpha = 1;
//   bestCar.draw(carCtx, "blue", true);
//   // carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
  Visualizar.drawNetwork(networkCtx, bestCar.brain);

  requestAnimationFrame(animate);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function remove() {
  localStorage.removeItem("bestBrain");
}
