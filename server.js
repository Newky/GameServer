var express = require("express");
var Manager = require("./xo.js").Manager;

var gamesmaster = new Manager();
var app = express.createServer();

app.use(express.bodyParser());

app.post("/", function(req, res) {
		var params = req.body

		if(params){
			if(params.player1 && params.player2){
				var game_id = gamesmaster.addGame(params.player1, params.player2);
				res.send(JSON.stringify(
						{ game_id: game_id }
						) + "\n");
			}
			else if(params.game_id && params.options) {
				var options = JSON.parse(params.options);
				var returnCode = gamesmaster.requestMove(params.game_id, options);
				var messages = {
					"0": "InvalidMove",
					"1": "validMove",
				};
				var statusCode = messages[""+returnCode];
				var winner = null;
				if(typeof statusCode === "undefined"){
					statusCode = "GameOver";
					winner = returnCode;
				}
				res.send(JSON.stringify(
						{
							game_id:params.game_id,
							status: statusCode,
							winner: winner		
						}
						) + "\n");
			}else if(params.game_id) {
				var board = gamesmaster.requestBoard(params.game_id);
				res.send(JSON.stringify(
							{
								game_id:params.game_id,
								board: board
							}
						       ) + "\n");
			}else {
				console.log(params);
				res.send(JSON.stringify(
						{
							error: "Invalid"
						}
						       ) + "\n");
			}
		}

		});

app.listen(8001);
