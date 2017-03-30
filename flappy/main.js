function randomize(list){
	var number_elements = list.length;
	var random = Math.floor(Math.random() * number_elements);
	return list[random];	
}

var mainState = {
	preload: function(){

		var user = randomize([
			
								{
									"name" : "Farid",
									"sound": "assets/farid.wav",
									"image": "assets/farid.png"
								},
								{
									"name" : "Ritchie",
									"sound": "assets/tiger-roar1.wav",
									"image": "assets/tiger.png"
								},
								{
									"name" : "Jeff",
									"sound": "assets/jeff.wav",
									"image": "assets/jeff.png"
								}
								
							]);

		game.load.image('bird', user.image);
		game.load.image('pipe', 'assets/pipe.png');
		game.load.audio('jump', user.sound);
		game.load.audio('punch', 'assets/punch.wav');
		
		document.getElementById("name").innerHTML = user.name;
		
	},
	create: function(){

		game.stage.backgroundColor = '#6ae1fc';
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bird = game.add.sprite(100, 245, 'bird');
		game.physics.arcade.enable(this.bird);
		this.bird.anchor.setTo(-0.2, 0.5); 
		this.bird.body.gravity.y = 1000;

		this.jumpSound = game.add.audio('jump');
		this.punchSound = game.add.audio('punch'); 

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    	spaceKey.onDown.add(this.jump, this);
    	game.input.onDown.add(this.jump, this);

    	this.pipes = game.add.group();
    	this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    	this.score = 0;
		this.labelScore = game.add.text(20, 20, "0",{ font: "30px Arial", fill: "#ffffff" });   
	},
	update: function(){

		if (this.bird.y < 0 || this.bird.y > 490)
        this.restartGame();
    	game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

    	if (this.bird.angle < 20)
    		this.bird.angle += 1; 
	},
	// Make the bird jump 
	jump: function() {
	    // Add a vertical velocity to the bird
	    this.bird.body.velocity.y = -350;
	    game.add.tween(this.bird).to({angle: -20}, 100).start(); 
	    this.jumpSound.play();

	    if (this.bird.alive == false)
    		return;
	},

	// Restart the game
	restartGame: function() {
	    // Start the 'main' state, which restarts the game
	    game.state.start('main');
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
	    this.punchSound.play()

	    // Prevent new pipes from appearing
	    game.time.events.remove(this.timer);

	    // Go through all the pipes, and stop their movement
	    this.pipes.forEach(function(p){
	        p.body.velocity.x = 0;
	    }, this);
	},
};

var winW = document.getElementById("gameview").offsetWidth;
var game = new Phaser.Game(winW, 480, Phaser.AUTO, 'gameview');
game.state.add('main', mainState);
game.state.start('main');