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
let userShape;
let trainingShape;
let userGuessDOM;
let percentDOM;

function setup()
{
	createCanvas(400, 200).parent('container');
	userShape = createGraphics(200, 200);
	userShape.pixelDensity(1);

	trainingShape = createImage(28, 28);
	// will detect rectangle, circle or triangle
	nn = new NeuralNetwork(trainingShape.width * trainingShape.height, 64, 3);

	userGuessDOM = select('#user_guess');
	percentDOM = select('#percent');
}

function draw()
{
	background(0);

	train();

	if (true)
	{
		//image(trainingShape, 0, 0, 200, 200);
	}
}

function train()
{
	let label = generateShapeOnTrainingShape();
	let input = getInputFromPixels();

	// Do the neural network stuff;
	let targets = [0, 0, 0];
	targets[label] = 1;

	//console.log(input);
	// console.log(targets);

	//console.log(train_index);

	/*
	let prediction = nn.predict(input);
	let guess = findMax(prediction);

	nn.train(input, targets);
	*/
}

function generateShapeOnTrainingShape()
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
			shape = generateTriangle(
				trainingShape.width,
				trainingShape.height);
			break;
		case 1:
			shape = generateRectangle(
				trainingShape.width,
				trainingShape.height);
			break;
		case 2:
			shape = generateCircle(
				trainingShape.width,
				trainingShape.height);
			break;
		default:
			console.error("unknown shape Number to generate");
	}

	// shape.loadPixels();
	// console.log(shape);
	// updatePixelsFromTrainingShape(shape.pixels.slice(0));
	return shapeNumber;
}

function generateTriangle(maxX, maxY)
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
	return triangle(
		point1.x, point1.y,
		point2.x, point2.y,
		point3.x, point3.y);
}

function generateRectangle(maxX, maxY)
{
	console.log("todo");
}

function generateCircle(maxX, maxY)
{
	console.log("todo");
}

function getInputFromPixels()
{
	let pixelArr = getPixelsFromTrainingShape();
	let inputs = [];
	// console.log(pixelArr);
	for (let i = 0, j = 0; i < pixelArr.length; i += 4, j++)
	{
		inputs[j] = pixelArr[i];
	}

	return inputs;
}

function getPixelsFromTrainingShape()
{
	let inputs = [];
	// inputs = trainingShape.pixels.slice(0); // copy array
	// console.log(trainingShape.pixels);
	return inputs;
}

function updatePixelsFromTrainingShape(pixelArr)
{
	trainingShape.pixels = pixelArr;
	//trainingShape.updatePixels();
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

/*
function train(show) {
	let inputs = [];
	if (show) {
		train_image.loadPixels();
	}
	for (let i = 0; i < 784; i++) {
		let bright = mnist.train_images[train_index][i];
		inputs[i] = bright / 255;
		if (show) {
			let index = i * 4;
			train_image.pixels[index + 0] = bright;
			train_image.pixels[index + 1] = bright;
			train_image.pixels[index + 2] = bright;
			train_image.pixels[index + 3] = 255;
		}
	}
	if (show) {
		train_image.updatePixels();
		image(train_image, 200, 0, 200, 200);
	}

	// Do the neural network stuff;
	let label = mnist.train_labels[train_index];
	let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	targets[label] = 1;

	// console.log(inputs);
	// console.log(targets);

	//console.log(train_index);

	let prediction = nn.predict(inputs);
	let guess = findMax(prediction);

	nn.train(inputs, targets);
	train_index = (train_index + 1) % mnist.train_labels.length;
}

function testing() {
	let inputs = [];
	for (let i = 0; i < 784; i++) {
		let bright = mnist.test_images[test_index][i];
		inputs[i] = bright / 255;
	}
	let label = mnist.test_labels[test_index];

	let prediction = nn.predict(inputs);
	let guess = findMax(prediction);
	total_tests++;
	if (guess == label) {
		total_correct++;
	}

	let percent = 100 * (total_correct / total_tests);
	percent_ele.html(nf(percent, 2, 2) + '%');


	test_index++;
	if (test_index == mnist.test_labels.length) {
		test_index = 0;
		console.log('finished test set');
		console.log(percent);
		total_tests = 0;
		total_correct = 0;
	}
}


function guessUserDigit() {
	let img = user_digit.get();
	if(!user_has_drawing) {
		user_guess_ele.html('_');
		return img;
	}
	let inputs = [];
	img.resize(28, 28);
	img.loadPixels();
	for (let i = 0; i < 784; i++) {
		inputs[i] = img.pixels[i * 4] / 255;
	}
	let prediction = nn.predict(inputs);
	let guess = findMax(prediction);
	user_guess_ele.html(guess);
	return img;
}


function draw() {
	background(0);

	let user = guessUserDigit();
	//image(user, 0, 0);


	if (mnist) {
		let total1 = 5;
		for (let i = 0; i < total1; i++) {
			if (i == total1 - 1) {
				train(true);
			} else {
				train(false);
			}
		}
		let total2 = 25;
		for (let i = 0; i < total2; i++) {
			testing();
		}
	}
	image(user_digit, 0, 0);

	if (mouseIsPressed) {
		user_has_drawing = true;
		user_digit.stroke(255);
		user_digit.strokeWeight(16);
		user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
	}
}

function keyPressed() {
	if (key == ' ') {
		user_has_drawing = false;
		user_digit.background(0);
	}
}




*/