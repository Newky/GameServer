function xo(board, turn) {
	var args = Array.prototype.slice.apply(arguments, [2]);
	var name0 = args[0] || "Player 1";
	var name1 = args[1] || "Player 2";
	this.turn = turn || 0;
	this.board = new Board(board);

	this.players = {
		0: name0,
		1: name1
	};

	this.move = function(options) {
		if(options && options.x !== null && options.y !== null) {
			var x = options.x;
			var y = options.y;
			if(this.board.isValidMove(x, y)){
				this.board.makeMove(x, y, this.turn);
				this.turn = (this.turn == 0) ? 1: 0 ;
				return 1;
			}else{
				throw "InvalidMoveError";
			}
		}else {
			throw "Insufficient Arguments for movement";
		}
	};

	this.setBoard = function(board) {
		this.board = new Board(board);
		return 1;
	};

	this.getState = function() {
		return {
			board: JSON.stringify(this.board.getBoard()),
			turn: this.turn,
			status: this.over()
		};	
	}

	this.whosTurn = function() {
		return this.players[this.turn];
	}

	this.over = function() {
		var game_status = this.board.over();
		if(game_status == -1)
			return "Running";
		if(game_status == 2)
			return "DrawnGame";
		return "Won By "+this.players[game_status];
	};

	this.printBoard = function() {
		this.board.printBoard();
	};

	this.getBoard = function() {
		return this.board.getBoard();
	};

	this.isValidBoard = function() {
		return this.board.isValidBoard();
	}

	this.getLastMove = function() {
		var last_move =  this.board.getLastMove();
		if(last_move === null)
			return last_move;
		var last_turn = (this.turn == 0) ? 1: 0 ;
		last_move.player = this.players[last_turn];
		return last_move;
	}
};

function Board(starting) {

	starting = starting || [
		[ -1 , -1, -1 ],
		[ -1 , -1, -1 ],
		[ -1 , -1, -1 ]
			];


	this.moves = [];

	this.printBoard = function() {
		var markers = {
			"0": "O",
			"1": "X",
			"-1": "-"
		};
		for(var i=0;i<starting.length;i++) {
			for(var j=0;j<starting[i].length;j++) {
				console.log(markers[starting[i][j]] + ""); 
			}
			console.log("\n");
		}
	};

	this.getBoard= function() {
		var markers = {
			"0": "O",
			"1": "X",
			"-1": "-"
		};
		var result = new Array(3);
		for(var i=0;i<3;i++) {
			result[i] = new Array(3);
			for(var j=0;j<3;j++) {
				result[i][j] = markers[starting[i][j]];
			}
		}
		return result;
	};

	this.isValidBoard = function() {
		var count = [0,0];
		starting.forEach(function(x) {
					x.forEach(
						function(y) {
							if(y == 1) count[y] += 1;						
							if(y == 0) count[y] += 1;						
						}
						);
				});
		return (Math.abs(count[0] - count[1]) <= 1)
	};

	this.getLastMove = function( ) {
		if(this.moves.length >0)
			return this.moves[this.moves.length-1];
		else
			return null;
	};


	this.isValidMove = function( x, y ) {
		return (this.over() === -this.over() === -11 && starting[x][y] == -1);
	};

	this.makeMove = function( x, y, marker ) {
		this.moves.push({
					x: x,
					y: y
				});
		starting[x][y] = marker;
	};

	this.over = function() {
		//Case 1 horizontal same
		var match = function(x) {
					return x.reduce(function(sum,index) {
								if(sum == null) return index;
								if(sum != index) return -1;
								return sum;
							}, null);
				};

		for(var i=0;i<starting[0].length;i++) {
			var temp = [starting[0][i], starting[1][i], starting[2][i]];

			var result = match(temp);
			
			if(result != -1) {
				return result;
			}
			
			temp = [starting[i][0], starting[i][1], starting[i][2]];

			var result = match(temp);
			
			if(result != -1) {
				return result;
			}
		}
		
		temp = [starting[0][0], starting[1][1], starting[2][2]];
		result = match(temp);
		if (result != -1) return result;
		temp = [starting[2][0], starting[1][1], starting[0][2]];
		result = match(temp);
		if (result != -1) return result;

		//Is it a draw
		for(var i=0;i<3;i++) {
			temp = starting[i];
			for(var j=0;j<3;j++)
				if(temp[j] == -1)
					return temp[j];
		}
		//Its a Draw
		return 2;
	};
};

exports.xo = xo;
