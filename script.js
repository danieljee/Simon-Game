var simon = {
	level: 1,
	strict: false,
	powerOn: false, //If power is off, all other buttons will not work
	allowUserInput: false,
	currentSequence: [],
	userSequence:[],
	userClickCount:0,
	togglePower: function(){
		if (this.powerOn){
			this.level =1;
			this.currentSequence = [];
			this.userClickCount = 0;
			this.strict = false;
			this.powerOn = false;
			this.allowUserInput = false;
			this.scoreBoard.style.color = "#550000";
			this.scoreBoard.innerHTML = "--";
		} else {
			this.scoreBoard.style.color = "#ff0000";
			this.powerOn = true;
		}
	},
	
	startGame: function(){
		this.level =1;
		this.userClickCount = 0;
		this.allowUserInput = false;
		this.currentSequence = [];
		if (this.powerOn) this.displayLevel();
		this.game.nextSequence();
		this.game.runSequence();
	},
	
	setStrict: function(){
		if (this.powerOn)this.strict = !this.strict;;	
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
		this.disableButtons();
	},
	
	disableButtons:function(){
		this.green.disabled = true;
		this.red.disabled= true;
		this.yellow.disabled = true;
		this.blue.diabled= true;
	},
	
	enableButtons: function(){
		this.green.disabled = false;
		this.red.disabled= false;
		this.yellow.disabled = false;
		this.blue.diabled= false;
	}
}

//Each round add one random note to the sequence. 
simon.game = {
	nextSequence: function(){
		var next = Math.floor(Math.random() * 4) + 1;
		this.currentSequence.push(next);
	}.bind(simon),
	
	runSequence: function(){
		this.userClickCount = 0;
		this.disableButtons();
		for(var i=0; i<this.currentSequence.length; i++){
			if (this.currentSequence[i] == 1){
				setTimeout(()=>{this.green.style.backgroundColor = "#00ff00";}, i * 1000);
				setTimeout(()=>{this.green.style.backgroundColor = "#00aa00";}, i * 1000 + 1000);
			} else if (this.currentSequence[i] == 2){
				setTimeout(()=>{this.red.style.backgroundColor = "#ff0000";}, i * 1000);
				setTimeout(()=>{this.red.style.backgroundColor = "#aa0000";}, i * 1000 + 1000);
			} else if (this.currentSequence[i] ==3){
				setTimeout(()=>{this.yellow.style.backgroundColor = "#ffff00";}, i * 1000);
				setTimeout(()=>{this.yellow.style.backgroundColor = "#aaaa00";}, i * 1000 + 1000);
			} else if (this.currentSequence[i] ==4){
				setTimeout(()=>{this.blue.style.backgroundColor = "#0000ff";}, i * 1000);
				setTimeout(()=>{this.blue.style.backgroundColor = "#0000cc";}, i * 1000 + 1000);
			}		
		}
		this.allowUserInput = true;
		this.enableButtons();
	}.bind(simon),
	
	getUserSequence: function(){
		if (simon.allowUserInput){
			simon.userClickCount++;
			if (this.id == "green"){
				simon.userSequence.push(1);
			} else if (this.id == "red"){
				simon.userSequence.push(2);
			} else if (this.id == "yellow"){
				simon.userSequence.push(3);
			} else if (this.id == "blue") {
				simon.userSequnce.push(4);
			}
		}
		simon.game.testIfMatches().bind(simon);
	},
	
	testIfMatches: function(){
		if (this.currentSequence[this.userClickCount-1] == this.userSequence[this.userClickCount-1]){
			
		} else {//if user gets it wrong, and if not in strict mode, run the pattern again and let user enter the sequence. 
					//If in the strict mode, reset the score and start a new sequence. 
			this.allowUserInput = false;
		}
		
		if (this.userClickCount == this.currentSequence.length && this.allowUserInput){ //if user has successfully matched the pattern
			this.allowUserInput = false;	
		}
	}
}

document.addEventListener("DOMContentLoaded", function(){
	simon.initialize();
});
