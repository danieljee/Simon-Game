var simon = {
	level: 1,
	strict: false,
	powerOn: false,
	currentSequence: [],
	userSequence:[],
	timeouts: [],
	buttons: [],
	defaultColors: ["#006600", "#660000", "#666600", "#000066"],
	brightColors: ["#00ff00", "#ff0000", "#ffff00", "#0000ff"],
	reset: function(){
		this.level =1;
		this.currentSequence = [];
		this.userSequence= [];
		this.timeouts.forEach(function(timeout){clearTimeout(timeout);}); //Stop the buttons from blinking
		this.game.disableTimer();
		this.timeouts = [];
	},
	
	togglePower: function(){	
		this.strict = false;
		this.strictSignal.style.backgroundColor = "#333";
		if (this.powerOn){
			this.reset();
			this.disableButtons();
			this.powerOn = false;
			this.scoreBoard.style.color = "#550000";
			this.scoreBoard.innerHTML = "--";
		} else {
			this.powerOn = true;
			this.scoreBoard.style.color = "#ff0000";
		}
	},
	
	startGame: function(){
		if (this.powerOn) {
			this.reset();
			this.displayLevel();
			this.game.nextSequence();
			this.game.runSequence();
		}
	},
	
	setStrict: function(){
		if(this.powerOn)this.strict = !this.strict;
		if (this.strict){
			this.strictSignal.style.backgroundColor = "#ff0000";
		} else {
			this.strictSignal.style.backgroundColor = "#333";
		}
	},
	
	displayLevel: function(){
		((this.level+'').length > 1)? this.scoreBoard.innerHTML = this.level: this.scoreBoard.innerHTML ='0'+ this.level;
	},
	
	initialize: function(){
		this.scoreBoard = document.getElementById("score");
		document.getElementById("startButton").addEventListener("click", this.startGame.bind(this));
		document.getElementById("strictButton").addEventListener("click", this.setStrict.bind(this));
		document.getElementById("powerButton").addEventListener("click", this.togglePower.bind(this));
		
		(this.green = document.getElementById("green")).addEventListener("click", this.game.getUserSequence);
		(this.red = document.getElementById("red")).addEventListener("click", this.game.getUserSequence);
		(this.yellow = document.getElementById("yellow")).addEventListener("click", this.game.getUserSequence);
		(this.blue = document.getElementById("blue")).addEventListener("click", this.game.getUserSequence);
		this.buttons.push(this.green);
		this.buttons.push(this.red);
		this.buttons.push(this.yellow);
		this.buttons.push(this.blue);
		this.strictSignal = document.getElementById("strictSignal");
		this.greenSound = new Audio();
		this.greenSound.src = "http://www.soundjig.com/pages/soundfx/drums.php?mp3=BD0000.mp3";
		this.redSound = new Audio();
		this.redSound.src = "http://www.soundjig.com/pages/soundfx/drums.php?mp3=CH.mp3";
		this.yellowSound = new Audio();
		this.yellowSound.src = "http://www.soundjig.com/pages/soundfx/drums.php?mp3=CY0000.mp3";
		this.blueSound = new Audio();
		this.blueSound.src = "http://www.soundjig.com/pages/soundfx/drums.php?mp3=SD0050.mp3";
		this.disableButtons();
	},
	
	disableButtons:function(){
		this.green.disabled = true;
		this.red.disabled= true;
		this.yellow.disabled = true;
		this.blue.disabled= true;
	},
	
	enableButtons: function(){
		this.green.disabled = false;
		this.red.disabled= false;
		this.yellow.disabled = false;
		this.blue.disabled= false;
	}
}

//Each round add one random note to the sequence. 
simon.game = {
	nextSequence: function(){
		var next = Math.floor(Math.random() * 4) + 1;
		this.currentSequence.push(next);
	}.bind(simon),
	
	runSequence: function(){
		this.disableButtons();
		for(var i=0; i<this.currentSequence.length; i++){
			if (this.currentSequence[i] == 1){
				this.timeouts.push(setTimeout(()=>{this.greenSound.play();this.green.style.backgroundColor = "#00ff00";}, i * 1000));
				setTimeout(()=>{this.green.style.backgroundColor = "#006600"; this.greenSound.pause();
this.greenSound.currentTime = 0;}, i * 1000 + 500);
			} else if (this.currentSequence[i] == 2){
				this.timeouts.push(setTimeout(()=>{this.redSound.play();this.red.style.backgroundColor = "#ff0000";}, i * 1000));
				setTimeout(()=>{this.red.style.backgroundColor = "#660000"; this.redSound.pause();
this.redSound.currentTime = 0;}, i * 1000 + 500);
			} else if (this.currentSequence[i] ==3){
				this.timeouts.push(setTimeout(()=>{this.yellowSound.play();this.yellow.style.backgroundColor = "#ffff00";}, i * 1000));
				setTimeout(()=>{this.yellow.style.backgroundColor = "#666600"; this.yellowSound.pause();
this.yellowSound.currentTime = 0;}, i * 1000 + 500);
			} else if (this.currentSequence[i] ==4){
				this.timeouts.push(setTimeout(()=>{this.blueSound.play();this.blue.style.backgroundColor = "#0000ff";}, i * 1000));
				setTimeout(()=>{this.blue.style.backgroundColor = "#000066"; this.blueSound.pause();
this.blueSound.currentTime = 0;}, i * 1000 + 500);
			}
		}
		setTimeout(()=>{this.enableButtons();this.game.setTimer();}, this.currentSequence.length * 1000);
	}.bind(simon),
	
	getUserSequence: function(){	
			if (this.id == "green"){	
				simon.userSequence.push(1);
				simon.greenSound.play();
				this.style.backgroundColor = simon.brightColors[0]; //make sure light turns on all the time
				setTimeout(()=>{this.style.backgroundColor = simon.defaultColors[0]},50);
			} else if (this.id == "red"){
				simon.userSequence.push(2);
				simon.redSound.play();
				this.style.backgroundColor = simon.brightColors[1];
				setTimeout(()=>{this.style.backgroundColor = simon.defaultColors[1]},50);
			} else if (this.id == "yellow"){
				simon.userSequence.push(3);
				simon.yellowSound.play();
				this.style.backgroundColor = simon.brightColors[2];
				setTimeout(()=>{this.style.backgroundColor = simon.defaultColors[2]},50);
			} else if (this.id == "blue") {
				simon.userSequence.push(4);
				simon.blueSound.play();
				this.style.backgroundColor = simon.brightColors[3];
				setTimeout(()=>{this.style.backgroundColor = simon.defaultColors[3]},50);
			}
		simon.game.testIfMatches();
	},
	
	testIfMatches: function(){	
		this.game.disableTimer();
		if (this.currentSequence[this.userSequence.length-1] == this.userSequence[this.userSequence.length-1]){		
			if (this.userSequence.length == this.currentSequence.length){ //if user has successfully matched the pattern
				clearTimeout(this.timertimeout);
				this.disableButtons();
				this.level++;
				this.userSequence =[];
				this.displayLevel();
				this.game.nextSequence();
				setTimeout(()=>{this.game.runSequence();}, 2000);
			}
		} else {//if user gets it wrong, and if not in strict mode, run the pattern again and let user enter the sequence. 
					//If in the strict mode, reset the score and start a new sequence. 
			this.disableButtons();
			//Blinking effect
			this.scoreBoard.innerHTML = "!!";
			setTimeout(()=>{this.scoreBoard.innerHTML = "";}, 300);
			setTimeout(()=>{this.scoreBoard.innerHTML = "!!";}, 600);
			setTimeout(()=>{this.scoreBoard.innerHTML = "";}, 900);
			setTimeout(()=>{this.scoreBoard.innerHTML = "!!";}, 1200);
			setTimeout(()=>{this.scoreBoard.innerHTML = "";}, 1500);
			setTimeout(()=>{
				if (this.strict){
					this.startGame();
				} else {		
					this.userSequence =[];
					this.displayLevel();
					this.game.runSequence();
				}
			}, 2000);		
		}
	}.bind(simon),
	
	setTimer: function(){
		//user must press a button within 5 seconds or it will fail
		this.timertimeout = setTimeout(()=>{this.userSequence.push(100);this.game.testIfMatches();}, 5000);
	}.bind(simon),
	
	disableTimer: function(){
		if (this.timertimeout !== null){
			clearTimeout(this.timertimeout);
			this.timertimeout = null;
		}
	}.bind(simon)
}   

document.addEventListener("DOMContentLoaded", function(){
	simon.initialize();
});

