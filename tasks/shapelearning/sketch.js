let nn;
let userGuessDOM;
let trainingGuessDOM;
let percentDOM;
let p5TrainingSketch
let nnCorrectResults = [];
let inTraining = true;
let resetUserCanvas = false;

function setup()
{
	noCanvas();
	userGuessDOM = select('#user_guess');
	percentDOM = select('#percent');
	trainingGuessDOM = select('#trainingGuess');

	p5UserSketch = new p5(userSketch);
	p5TrainingSketch = new p5(trainingSketch);

	keyPressed = function ()
	{
		if (key == ' ')
		{
			resetUserDrawing();
			inTraining = true;
		}
	}
}

let trainingSketch = function (sketch)
{
	sketch.setup = function ()
	{
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
		if(inTraining)
		{
			sketch.background(0);
			sketch.train();
			trainingGuessDOM.html(getPercentCorrectResults());
		}
	}

	sketch.train = function ()
	{
		let label = sketch.generateShapeOnTrainingShape();
		let inputs = sketch.getInputFromPixels();

		// Do the neural network stuff;
		let targets = [0, 0, 0];
		targets[label] = 1;

		let prediction = nn.predict(inputs);
		let guess = findMax(prediction);
		if (label == guess)
		{
			updateCorrectResults(1);
		}
		else
		{
			updateCorrectResults(0);
		}
		trainingGuessDOM.html(guess);
		nn.train(inputs, targets);
	}

	sketch.generateShapeOnTrainingShape = function ()
	{
		let shapeNumber = Math.round(Math.random() * 2); // 0 to 2, 3 states
		sketch.strokeWeight(1);
		sketch.stroke(255, 255, 255);
		sketch.fill(0);
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
		let point1 = {
			x: Math.round(Math.random() * maxX),
			y: Math.round(Math.random() * maxY)};
		let width = Math.round(Math.random() * (maxX - point1.x));
		let height = Math.round(Math.random() * (maxY - point1.y));

		sketch.rect(point1.x, point1.y, width, height);
	}

	sketch.generateCircle = function (maxX, maxY)
	{
		let point1 = {
			x: Math.round(Math.random() * maxX),
			y: Math.round(Math.random() * maxY)};
		let width = Math.round(Math.random() * (maxX - point1.x));
		let height = Math.round(Math.random() * (maxY - point1.y));

		sketch.ellipse(point1.x, point1.y, width, height);
	}

	sketch.getInputFromPixels = function ()
	{
		let pixelArr = sketch.getPixelsFromTrainingShape();
		let inputs = [];
		let arrayLength = sketch.width * sketch.height;
		for (let i = 0; i < arrayLength; i++)
		{
			inputs[i] = pixelArr[i * 4] / 255;
		}

		return inputs;
	}

	sketch.getPixelsFromTrainingShape = function ()
	{
		let inputs = [];
		sketch.loadPixels();
		inputs = sketch.pixels.slice(0); // copy array
		return inputs;
	}
}

let userSketch = function (sketch)
{
	sketch.setup = function ()
	{
		sketch.createCanvas(200, 200).parent('container');
		sketch.pixelDensity(1);
		sketch.loadPixels();
		sketch.background(0);
	}

	sketch.draw = function ()
	{
		if (resetUserCanvas)
		{
			sketch.background(0);
			resetUserCanvas = false;
		}

		sketch.drawSketch();
	}

	sketch.drawSketch = function (argument)
	{
		if (sketch.mouseIsPressed)
		{
			inTraining = false;
			sketch.stroke(255);
			sketch.strokeWeight(4);
			// this offset though
			sketch.line(
			sketch.mouseX,
			sketch.mouseY,
			sketch.pmouseX,
			sketch.pmouseY);

			sketch.guessFromUser();
		}
	}

	sketch.guessFromUser = function ()
	{
		let img = sketch.get();
		let inputs = [];
		img.resize(28,28);
		img.loadPixels();
		for (let i = 0; i < 784; i++)
		{
			inputs[i] = img.pixels[i * 4] / 255;
		}
		let prediction = nn.predict(inputs);
		let guess = findMax(prediction);
		let guessShape = "";
		switch(guess)
		{
			case 0:
				guessShape = "Triangle";
				break;
			case 1:
				guessShape = "Rectangle";
				break;
			case 2:
				guessShape = "Circle";
				break;
			default:
				console.error("unknown shape Number to generate");
		}
		userGuessDOM.html(guessShape);
	}
}

function resetUserDrawing()
{
	resetUserCanvas = true;
}

function updateCorrectResults(result)
{
	if (nnCorrectResults.length >= 50)
	{
		nnCorrectResults.shift();
	}

	nnCorrectResults.push(result);
}

function getPercentCorrectResults()
{
	let sum = nnCorrectResults.reduce((a, b) => a + b, 0);
	return (Math.round(sum / nnCorrectResults.length * 10000) / 100) + "%";
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