var sha1_hash = require("./hash.js").sha1_hash;
var xo = require("./xo.js").xo;

function Manager() {
	this.games = {};
	this.types = {
	};
}

Manager.prototype.addType = function(label, obj) {
	var checks = [
		"move",
		"getBoard",
		"getLastMove"
	];	
	var temp = new obj;
	for(var i=0;i<checks.length;i++)
		if(typeof temp[checks[i]] !== "function")
			throw "FailedSchemaCheck";	
	this.types[label] = obj;
};

Manager.prototype.addGame = function(player1, player2, game, board) {
	var hash = sha1_hash(player1+player2);
	board = board || null;
	//Game Doesn't exist
	if (! game) {
		throw "NoGameSpecified";
	}
	if(typeof this.types[game] === "undefined") {
		throw "NoSuchGame";
	}else {
		if(typeof this.games[hash] === "undefined"){
			this.games[hash] = new this.types[game](board, 0, player1, player2);
			return hash;
		}else {
			console.log("Game Exists");
			return hash;
		}
	}
};

Manager.prototype.requestMove = function(game_id, options) {
	try {
		this.games[game_id].move(options);
		var over = this.games[game_id].over()
		if( over !== null) {
			delete this.games[game_id];
			return over;
		}else{
			return 1;
		}
	}catch(e) {
		/*console.log("Invalid Move, Ignoring");*/
		return 0;
	}
};

Manager.prototype.requestBoard = function(game_id) {
	try {
		return this.games[game_id].getBoard();
	}catch(e) {
		console.log("Invalid Game Id");
		return 0;
	}
};

Manager.prototype.requestLastMove = function(game_id) {
	try{
		return   this.games[game_id].getLastMove();
	}catch(e) {
		console.log("Invalid Game Id");
		return 0;
	}
};

exports.Manager = Manager;
