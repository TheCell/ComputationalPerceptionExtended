/*
let mnist;
let train_index = 0;

// testing variables
let test_index = 0;
let total_tests = 0;
let total_correct = 0;

let train_image;

let user_digit;
let user_has_drawing = false;
let user_guess_ele;
let percent_ele;
*/

let nn;
// let userShape;
// let trainingShape;
let userGuessDOM;
let trainingGuessDOM;
let percentDOM;
let p5TrainingSketch

function setup()
{
	p5TrainingSketch = new p5(trainingSketch);
}

let trainingSketch = function (sketch)
{
	sketch.setup = function ()
	{
		userGuessDOM = select('#user_guess');
		percentDOM = select('#percent');
		trainingGuessDOM = select('#trainingGuess');

		sketch.createCanvas(28, 28).parent('container');
		sketch.pixelDensity(1);
		sketch.loadPixels();

		// will detect rectangle, circle or triangle
		nn = new NeuralNetwork(
			sketch.width * sketch.height,
			64,
			3);
	}

	sketch.draw = function ()
	{
		sketch.background(0);
		sketch.train();
	}

	sketch.train = function ()
	{
		let label = sketch.generateShapeOnTrainingShape();
		let inputs = sketch.getInputFromPixels();

		// Do the neural network stuff;
		let targets = [0, 0, 0];
		targets[label] = 1;

		// console.log(inputs);
		// console.log(label);
		// console.log(targets);
		let prediction = nn.predict(inputs);
		let guess = findMax(prediction);
		trainingGuessDOM.html(guess);
		nn.train(inputs, targets);
	}

	sketch.generateShapeOnTrainingShape = function ()
	{
		//let shapeNumber = Math.round(Math.random() * 2); // 0 to 2, 3 states
		let shapeNumber = 0; // decided by fair random dice roll ;)
		strokeWeight(1);
		stroke(255, 255, 255);
		fill(0);
		let shape;

		switch(shapeNumber)
		{
			case 0:
				sketch.generateTriangle(
					sketch.width,
					sketch.height);
				break;
			case 1:
				sketch.generateRectangle(
					sketch.width,
					sketch.height);
				break;
			case 2:
				sketch.generateCircle(
					sketch.width,
					sketch.height);
				break;
			default:
				console.error("unknown shape Number to generate");
		}

		return shapeNumber;
	}

	sketch.generateTriangle = function (maxX, maxY)
	{
		let point1 = {
			x: Math.round(Math.random() * maxX),
			y: Math.round(Math.random() * maxY)};
		let point2 = {
			x: Math.round(Math.random() * maxX),
			y: Math.round(Math.random() * maxY)};
		let point3 = {
			x: Math.round(Math.random() * maxX),
			y: Math.round(Math.random() * maxY)};
		sketch.triangle(
			point1.x, point1.y,
			point2.x, point2.y,
			point3.x, point3.y);
	}

	sketch.generateRectangle = function (maxX, maxY)
	{
		console.log("todo");
	}

	sketch.generateCircle = function (maxX, maxY)
	{
		console.log("todo");
	}

	sketch.getInputFromPixels = function ()
	{
		let pixelArr = sketch.getPixelsFromTrainingShape();
		let inputs = [];
		for (let i = 0, j = 0; i < pixelArr.length; i += 4, j++)
		{
			inputs[j] = pixelArr[i];
		}

		return inputs;
	}

	sketch.getPixelsFromTrainingShape = function ()
	{
		let inputs = [];
		sketch.loadPixels();
		inputs = sketch.pixels.slice(0); // copy array
		// console.log(inputs);
		return inputs;
	}
}

function findMax(arr)
{
	let record = 0;
	let index = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] > record) {
			record = arr[i];
			index = i;
		}
	}
	return index;
}