var express = require("express");
var Manager = require("./manager.js").Manager;

var gamesmaster = new Manager();
var app = express.createServer();

app.use(express.bodyParser());
/*	Each request has a response of the form
 *	{
 *		game_id: "game_id_hash",
 *		status_code:[ (0)failed | 1(success)],
 *		message: "Some message related to the status code"
 *	}
 *	Other requests may add things to this object, but they should also
 *	follow these 3 basic rules
 */

/*	Add is an excepton in that it replaces the game_id with
 *	a player_id object
 */
app.post("/add", function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		var params = req.body
		
		var player_id = null,
			status_code = 0,
				message = "";
				
		if(params) {
			if(params.player){
				try{
					var player_id =gamesmaster.login(params.player);
					status_code = 1;
					message = "Player "+params.player+" created successfully.";
				}catch(e) {
					message = "Error creating Player!";
				}
			}else{
				message = "Invalid Arguments!"
			}
		}else{
			message = "No params are defined"	
		}
		res.send({player_id:player_id, status_code:status_code, message:message});
});
/*	Lounge lists the current players in the lounge
 *	It replaces the default game_id field with a json object which gives information
 *	for each of the players in the game.
 *	Takes the players player id so it doesn't return that user
 */
app.post("/lounge", function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');

	var params = req.body;
	var players_object = null,
		status_code = 0,
			message = "";
	if(params) {
		if(params.player_id) {
			try{
				var list = gamesmaster.list(params.player_id);
				players_object = JSON.stringify(list);
				status_code = 1;
				message = "Player List Generation Successful";
			}catch(e) {
				message = "Error generating player list";
			}
		}else{
			message = "Invalid Arguments"
		}
	}else{
		message = "No params are defined"	
	}
	res.send({players_object:players_object, status_code:status_code, message:message});
});

app.post("/game", function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		var params = req.body
		
		var game_id = null,
			status_code = 0,
				message = "";
		
		if(params) {
			if(params.player1){
				var player1 = params.player1;
				var player2 = null;
				if(params.player2){
					player2 = params.player2;
				}
				if(params.type) {
					player2 = player2 || "oneplayer";
					try {
						game_id = gamesmaster.addGame(player1, player2, params.type)
						status_code = 1
						message = "Game Successfully added!"
					}catch(e){
						message = "Game Could not be created"
					}
				}else {
					message = "No type specified.";
				}
			}else {
				message = "No players specified.";
			}
		}else {
			message = "No params are defined"
		}
		res.send({game_id:game_id, status_code:status_code, message:message});
});

/*
 *
 */

app.post("/change", function(req, res) {
		var params = req.body

		var game_id = null,
			status_code = 0,
				message = "";
		if(params) {
			if(params.game_id) {
				game_id=params.game_id;
				if(params.board) {
					var board = JSON.parse(params.board)
					try{
						if(gamesmaster.changeBoard(params.game_id, board)){
							status_code = 1
							message = "Board change successful";
						}else{
							message = "Error with changing board"
						}
					}catch(e) {
						message = "Error with changing board"
					}
				}else {
					message="No board is given"
				}
			}else{
				message = "No params are defined"	
			}
		}
		res.send({game_id:game_id, status_code:status_code, message:message});
});

/* This is a getter request
 * Along with the default response json, we include 
 * a results key which points at the result object
 */

app.post("/current", function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		var params = req.body

		var game_id = null,
			status_code = 0,
				message = ""
					state = null;

		if(params) {
			if(params.game_id) {
				/* getState should return a object with the following
				 * {
				 *	board: JSON.stringified array
				 *	turn: 0 indicating player 1, 1 indicating player 2 etc.
				 * }
				 */
				game_id=params.game_id;
				try {
					state = gamesmaster.getState(params.game_id)
					status_code = 1
					message = "Retrieved state."
				}catch(e){
					message = "Failed to get state of game"
				}
			}else{
				message="No game id is given."
			}		
		}else{
			message = "No params are defined"	
		}
		res.send({game_id:game_id, status_code:status_code, message:message, state:state});

});

app.post("/move", function(req, res) {
		res.header('Access-Control-Allow-Origin', '*');
		var params = req.body

		var game_id = null,
			status_code = 0,
				message = "";

		if(params) {
			if(params.game_id && params.options) {
				game_id=params.game_id;
				var options = JSON.parse(params.options);
				try {
					if(gamesmaster.requestMove(params.game_id, options)){
						message = "Valid Move";
						status_code = 1
					}else{
						message = "Invalid Move";
					}
				}catch(e) {
					message = "Invalid Move"
				}
			}
		}else {
			message = "No params are defined"	
		}
		res.send({game_id:game_id, status_code:status_code, message:message});
});

app.listen(8001);
