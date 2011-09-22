var sha1_hash = require("./hash.js").sha1_hash;
var xo = require("./xo.js").xo;
var Player = require("./player.js").Player;

function Manager() {
	this.games = {};
	this.players = [];
	this.types = {
		"xo": xo
	};
}

Manager.prototype.accept = function(player_id, game_id) {
	if(player_id && game_id) {
		var _players = this.players.filter(function(x) { return (x.player_id === player_id); });
		if(_players.length <= 0){
			throw "InvalidPlayerID"
		}else{
			var opp_id;
			 _players[0].requestsIncoming = _players[0].requestsIncoming.filter(function(x) {
						console.log(x);
						console.log(game_id);
						if(x.game_id === game_id) {
							opp_id = x.player;
							return false;
						}else{
							return true;
						}
					});
			console.log(opp_id);
			var _players = this.players.filter(function(x) { return (x.player_id === opp_id); });
			if(_players.length <= 0) {
				throw "Unknown Opposition";
			}else{
				_players[0].requestsPending = _players[0].requestsPending.filter(function(x) {return(!(x.game_id != game_id));});
				return game_id;
			}
		}
	}else {
		throw "InvalidArgumentsAccept"
	}
};

Manager.prototype.addGame = function(player1, player2, game) {
	var hash = sha1_hash(player1+player2+game);

	if (!game) {
		throw "NoGameSpecified";
	}
	if(typeof this.types[game] === "undefined") {
		throw "NoSuchGame";
	}else {
		if(typeof this.games[hash] === "undefined"){
			this.games[hash] = new this.types[game](null, 0, player1, player2);
			return hash;
		}else {
			return hash;
		}
	}
};


Manager.prototype.addGameMulti = function(player1, player2, game) {
	if(!(player1 && player2 && game))
		throw "addGameCalledIncorrectly"
	var _players = this.players.filter(function(x) { return ((x.player_id === player2 || x.player_id === player1)); });
	if(_players.length <2){
		throw "Invalid Players"
	}else{
		var game_id = this.addGame(_players[0].player_name,_players[1].player_name, game);
		_players.map(function(x) {
				if(x.player_id === player1){
					x.requestsPending.push({
						game_id:game_id,
						player:player2
					});
				}else{
					x.requestsIncoming.push({
						game_id:game_id,
						player:player1
					});
				}
		});
		return game_id;
	}
};

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


Manager.prototype.changeBoard = function(game_id, board) {
	if(game_id && board) {
		try {
			return this.games[game_id].setBoard(board)
		}catch (e) {
			throw "Error in games set Board"
		}
	}else {
		throw "Error in Change Board"
	}
}

Manager.prototype.getState = function(game_id) {
	if(game_id) {
		try {
			return this.games[game_id].getState();
		}catch(e){
			throw "Error getting state"
		}
	}else {
		throw "No Game id given in getState"
	}
}

Manager.prototype.list = function(player_id){	
	return (this.players
		.filter(function(x) { return (!(x.player_id === player_id)); })
		.map(function(x) {
			return {
				"player_name": x.player_name,
				"player_id": x.player_id,
				"playing": x.playing
			}		
		}));
};


Manager.prototype.login = function(player_name) {
	if(!player_name){
		throw "NoNameSpecified";
	}else{
		var index = this.players.length;
		this.players.push(
				new Player(player_name, index)
				);	
		return(this.players[this.players.length-1].player_id);
	}
};

Manager.prototype.playerState = function(player_id) {
	return (this.players
		.filter(function(x) { return ((x.player_id === player_id)); })
		.map(function(x) {
			return {
				"games":x.games,
				"pending":x.requestsPending,
				"incoming":x.requestsIncoming
			}
		}));
};

Manager.prototype.requestMove = function(game_id, options) {
	if(game_id && options) {
		try {
			return this.games[game_id].move(options);
		}catch(e) {
			console.log(e);
			return 0;
		}
	}else{
		return 0;
	}
};


exports.Manager = Manager;
