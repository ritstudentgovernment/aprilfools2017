var textOrange = { 

	font: "30px flappyFont", 
	align: "center", 
	fill: "#f8b505",
	stroke: "#000",
	strokeThickness: 3,
};

var textWhite = { 

	font: "35px flappyFont", 
	align: "center", 
	fill: "#fff",
	stroke: "#000",
	strokeThickness: 3,
};

var textScore = { 

	font: "20px flappyFont", 
	align: "center", 
	fill: "#fff",
	stroke: "#000",
	strokeThickness: 3,
};


var mainState = {
	init: function(birdNum){

		this.birdNum = birdNum;
	},
	preload: function(){

		var user = [
			{
				"name" : "Farid",
				"sound": "assets/farid.mp3",
				"image": "assets/farid.png"
			},
			{
				"name" : "Ritchie",
				"sound": "assets/tiger.mp3",
				"image": "assets/tiger.png"
			},
			{
				"name" : "Jeff",
				"sound": "assets/jeff.mp3",
				"image": "assets/jeff.png"
			},
			{
				"name" : "Kathy",
				"sound": "assets/kathy.mp3",
				"image": "assets/kathy.png"
			},
			{
				"name" : "Amar",
				"sound": "assets/amar.mp3",
				"image": "assets/amar.png"
			},
			{
				"name" : "Andrea",
				"sound": "assets/andrea.mp3",
				"image": "assets/andrea.png"
			}				
		];

		// Bird assets.
		game.load.image('bird', user[this.birdNum].image);
		game.load.audio('jump', user[this.birdNum].sound);

		// Pipe assets.
		game.load.image('pipe', 'assets/pipe1.png');
		game.load.audio('punch', 'assets/punch.mp3');

		// GameOver assets
		game.load.image('restart', 'assets/replay.png');
		game.load.image('gameOver', 'assets/scoreboard.png');

		game.load.audio('song', 'assets/song.mp3');

	},
	create: function(){

		// Create the game.
		game.stage.backgroundColor = '#6ae1fc';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", textWhite); 

		// Create the bird.
		this.bird = game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
		this.bird.anchor.setTo(-0.2, 0.5); 
		this.bird.body.gravity.y = 1000;

		// Create the pipes
		this.pipes = game.add.group();
    	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		// Create audio FX.
		this.jumpSound = game.add.audio('jump');
		this.punchSound = game.add.audio('punch'); 

		// Add user interaction.
		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	spaceKey.onDown.add(this.jump, this);
    	game.input.onDown.add(this.jump, this);

    	this.song = game.add.audio('song');
    	this.song.loop = true;
    	this.song.play();
	},
	update: function(){

		// Restart game if user out of bounds.
		if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();

    	// Move bird back to original rotation.
    	if (this.bird.angle < 20)
    		this.bird.angle += 1;

    	// Detect collision with pipe.
    	game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this); 
	},
	jump: function() {

		// Dont jump if the bird is dead.
	    if (this.bird.alive == false)
    		return;

	    // Add a vertical velocity to the bird
	    this.bird.body.velocity.y = -350;

	    // Rotate bird a little and play sound.
	    game.add.tween(this.bird).to({angle: -20}, 100).start(); 
	    this.jumpSound.play();
	},
	restartGame: function() {

	    // Start the 'main' state, which restarts the game
	    this.hitPipe();
	},
	addOnePipe: function(x, y) {
	    // Create a pipe at the position x and y
	    var pipe = game.add.sprite(x, y, 'pipe');

	    // Add the pipe to our previously created group
	    this.pipes.add(pipe);

	    // Enable physics on the pipe 
	    game.physics.arcade.enable(pipe);

	    // Add velocity to the pipe to make it move left
	    pipe.body.velocity.x = -200; 

	    // Automatically kill the pipe when it's no longer visible 
	    pipe.checkWorldBounds = true;
	    pipe.outOfBoundsKill = true;
	},
	addRowOfPipes: function() {
	    // Randomly pick a number between 1 and 5
	    // This will be the hole position
	    var hole = Math.floor(Math.random() * 5) + 1;

	    // Add the 6 pipes 
	    // With one big hole at position 'hole' and 'hole + 1'
	    for (var i = 0; i < 8; i++)
	        if (i != hole && i != hole + 1) 
	            this.addOnePipe(winW, i * 60 + 10);

	    this.score += 1;
		this.labelScore.text = this.score;  
	},
	hitPipe: function() {

	    // If the bird has already hit a pipe, do nothing
	    // It means the bird is already falling off the screen
	    if (this.bird.alive == false)
	        return;

	    // Set the alive property of the bird to false
	    this.bird.alive = false;

	    // Play punch sound
	    this.song.stop();
	    this.punchSound.play()

	    // Prevent new pipes from appearing
	    game.time.events.remove(this.timer);

	    // Go through all the pipes, and stop their movement
	    this.pipes.forEach(function(p){
	        p.body.velocity.x = 0;
	    }, this);

	    game.state.start('gameOver', true, false, this.score, this.birdNum);
	}
};


var startState = {
	preload: function(){

		game.load.image('pipe', 'assets/pipe1.png');
		game.load.image('bird1','assets/farid.png');
		game.load.image('bird2','assets/tiger.png');
		game.load.image('bird3','assets/jeff.png');
		game.load.image('bird4','assets/kathy.png');
		game.load.image('bird5','assets/amar.png');
		game.load.image('bird6','assets/andrea.png');
		game.load.audio('intro', 'assets/intro.mp3');
	},
	create: function(){

		game.stage.backgroundColor = '#6ae1fc';

		// Create the pipes
		this.pipes = game.add.group();
    	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    	// Game title.
		var gameTitle = game.add.text(game.world.centerX, 100, "FlappySG", textOrange);
		gameTitle.anchor.set(0.5);

		// Pick a president label.
		var pick = game.add.text(game.world.centerX, 145, "Pick a Member", textWhite);
		pick.anchor.set(0.5);
		pick.scale.setTo(0.75,0.75);

		// Create intro song
		var introSong = game.add.audio('intro');
		introSong.loop = true;
		introSong.play();


		var pickPlayer = function(playerNum){
			introSong.stop();
			game.state.start('main', true, false, playerNum);
		};
		var center = game.world.centerX;

		// Farid bird.
		var bird1 = game.add.button(center - 100, 300, 'bird1', function(){pickPlayer(0)}, mainState, this, 2, 1, 0);
		bird1.anchor.set(0.5);
		bird1.scale.setTo(1,1);

		// Ritchie fird.
		var bird2 = game.add.button(center, 300, 'bird2', function(){pickPlayer(1)}, mainState, this, 2, 1, 0);
		bird2.anchor.set(0.5);
		bird2.scale.setTo(1,1);

		// Jeff bird.
		var bird3 = game.add.button(center + 100, 300, 'bird3', function(){pickPlayer(2)}, mainState, this, 2, 1, 0);
		bird3.anchor.set(0.5);
		bird3.scale.setTo(1,1);

		// Kathy bird.
		var bird4 = game.add.button(center - 100, 380, 'bird4', function(){pickPlayer(3)}, mainState, this, 2, 1, 0);
		bird4.anchor.set(0.5);
		bird4.scale.setTo(1,1);

		// Amar Bird
		var bird5 = game.add.button(center, 380, 'bird5', function(){pickPlayer(4)}, mainState, this, 2, 1, 0);
		bird5.anchor.set(0.5);
		bird5.scale.setTo(1,1);

		// Andrea Bird
		var bird6 = game.add.button(center + 100, 380, 'bird6', function(){pickPlayer(5)}, mainState, this, 2, 1, 0);
		bird6.anchor.set(0.5);
		bird6.scale.setTo(1,1);

		
	},
	addOnePipe: function(x, y) {
	    // Create a pipe at the position x and y
	    var pipe = game.add.sprite(x, y, 'pipe');

	    // Add the pipe to our previously created group
	    this.pipes.add(pipe);

	    // Enable physics on the pipe 
	    game.physics.arcade.enable(pipe);

	    // Add velocity to the pipe to make it move left
	    pipe.body.velocity.x = -200; 

	    // Automatically kill the pipe when it's no longer visible 
	    pipe.checkWorldBounds = true;
	    pipe.outOfBoundsKill = true;
	},
	addRowOfPipes: function() {
	    // Randomly pick a number between 1 and 5
	    // This will be the hole position
	    var hole = Math.floor(Math.random() * 5) + 1;

	    // Add the 6 pipes 
	    // With one big hole at position 'hole' and 'hole + 1'
	    for (var i = 0; i < 8; i++)
	        if (i != hole && i != hole + 1) 
	            this.addOnePipe(winW, i * 60 + 10);
	}
}


var overState = {
	init: function(score, birdNum){

		this.score = score;
		this.birdNum = birdNum;
	},
	create: function(){

		var center = game.world.centerX;

		game.stage.backgroundColor = '#6ae1fc';
		var gameOver = game.add.image(center, 180,'gameOver');
		gameOver.anchor.set(0.5);

		var score = game.add.text(center + 89, 159, this.score, textScore);
		score.anchor.set(0.5);

		if(this.score > game.global.best)
			game.global.best = this.score;

		var best = game.add.text(center + 89, 200, game.global.best, textScore);
		best.anchor.set(0.5);

		var restartFunc = function(){game.state.start('main', true, false, this.birdNum)};
		var restart = game.add.button(center, 400, 'restart', restartFunc, mainState, this, 2, 1, 0);
		restart.anchor.set(0.5);
		restart.scale.setTo(0.5,0.5);
	}
}


var winW = document.getElementById("gameview").offsetWidth;
var game = new Phaser.Game(winW, 480, Phaser.AUTO, 'gameview');
game.state.add('main', mainState);
game.state.add("gameStart", startState);
game.state.add('gameOver', overState);
game.global = {best: 0};

$(document).ready(function() {
	
	game.state.start('gameStart');
	game.renderer.renderSession.roundPixels = true;
});

