$(document).ready(function() {

$('#initButton').click(checkBoard);
$("#make_move").click(makeMove);

});
var player = {
	game_id:null,
	turn:0,
	intervalHandle:null
};


var checkBoard = function() {
		player.game_id = $("#game_id").val();
		$.post("http://richydelaney.com:8001/current",
			{game_id:player.game_id},
			function(response) {
				console.log("Response is"+response);
				if(response.status_code === 1){
					var state = response.state;
					var board = JSON.parse(state.board);
					var table_board = prettyPrintBoard(board);
					$("#board").html(table_board);
					$("#game_ui").show();
				}else{
					alert(response.message);
				}
			}, "json");
};

		
var makeMove = function() {
	player.game_id = $("#game_id").val();
	var options = JSON.stringify({
					"x": $("#x").val(),
					"y": $("#y").val()
			});
	$.post("http://richydelaney.com:8001/move",
		{game_id:player.game_id, options:options},
		function(response) {
			if(response.status_code === 1){
				checkBoard();
				wait();
			}else{
				alert(response.message);
			}
		}, "json");
};

var wait = function() {
	$('#controls').hide();
	player.intervalHandle = setInterval(turnCheck, 5000);
}

var getState = function() {
		player.game_id = $("#game_id").val();
		var args = arguments;
		$.post("http://richydelaney.com:8001/current",
			{game_id:player.game_id},
			function(response) {
				if(response.status_code === 1){
					console.log("Here and args.length="+args.length);
					for(var i=0;i<args.length;i++) {
						if(typeof args[i] === "function")
							args[i](response);
					}
				}else{
					alert(response.message);
				}
			}, "json");
}

var turnCheck = function() {
	getState(function(response) {
		if(response.state){
			var turn = response.state.turn;
			console.log("Turn:"+turn+" PlayerTurn:"+player.turn);
			if(turn === player.turn){
				clearInterval(player.intervalHandle);
				$('#controls').show();
				$("#board").html(prettyPrintBoard(JSON.parse(response.state.board)));
			}
		}else{
			throw "InvalidStateFound";
		}
	});
}

var prettyPrintBoard = function(board) {
	if(board) {
		var html = "<table><tbody>";
		for(var i=0;i<board.length;i++){
			html+= "<tr>";
			for(var j=0;j<board[i].length;j++){
				html+="<td>"+board[i][j]+"</td>";
			}
			html+= "</tr>";
		}
		return html;
	}else{
		throw "InvalidBoardError";
	}
}

