const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');

carCanvas.width = 200;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 1;
const cars = generateCars(N);
// car.draw(ctx);
let bestCar = cars[0];
if(localStorage.getItem('bestBrain')) {
    for(let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

        if(i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.2);
        }
    }
}
const traffics = [
    new Car(road.getLaneCenter(1), -250, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -100, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -100, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -350, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -500, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -650, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -200, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -800, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -950, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -800, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -250, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -100, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -1000, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -1350, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -1300, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -1500, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -1650, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -1200, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -1800, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -1950, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -1800, 30, 50, 'Dummy', 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -1700, 30, 50, 'Dummy', 2, getRandomColor())
]

function generateCars(N) {
    const cars = [];
    for(let i = 0; i < N; i++) {
        cars.push(
            new Car(road.getLaneCenter(1), 100, 30, 50, 'Ai', 5)
        );
    }
    return cars;
}

animate();

function animate(time) {
    for(let i = 0; i < traffics.length; i++) {
        traffics[i].update(road.borders, []);
    }
    for(let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffics);
    }
    bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    // car.update(road.borders);

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);

    for(let i = 0; i < traffics.length; i++) {
        traffics[i].draw(carCtx, 'red');
    }
    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, 'blue');
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);
    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizar.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain)); 
}

function remove() {
    localStorage.removeItem('bestBrain'); 
}