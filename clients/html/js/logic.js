$(document).ready(function() {

$('#initButton').click(login);
$("#make_move").click(makeMove);
$("#selectPlay").live("click",makeGame);
$("#accept").live("click",accept);



playerTicker = setInterval(checkPlayerState, 5000);

});

var playerTicker; 


var player = {
	game:"xo",
	player_name:null,
	player_id:null,
	game_id:null,
	turn:0,
	intervalHandle:null
};

var login = function() {
	var name = $("#login_name").val();
	if(name === "") return false;
	$.post("http://richydelaney.com:8001/add",
			{player:name},
			function(response) {
				if(response){	
					if(response.status_code ===1){
						if(response.player_id){
							player.player_name = name;
							player.player_id= response.player_id;
							list(response.player_id);					
						}else{
							throw "InvalidPlayerId";
						}
					}else {
						alert(response.message);
					}
				}else{
					throw "ErrorWithAdd"
				}
			},"json");
};

var makeGame = function() {
	var opp_id = $("#players_list").val();
	$.post("http://richydelaney.com:8001/request",
			{
				player_id:player.player_id, 
				opp_id:opp_id,
				type:player.game
			},function(response) {
				if(response) {
					if(response.status_code ===1){
						player.game_id = response.game_id;
						checkBoard();
					}else{
						alert(response.message);
					}
				}else{
					throw "ErrorWithMakingGame"
				}
			}, "json");
				
};

var list = function(player_id) {
	$.post("http://richydelaney.com:8001/lounge",
			{player_id:player_id},
			function(response) {
				if(response) {	
					if(response.status_code ===1){
						if(response.players_object) {
							var player_list = JSON.parse(response.players_object);
							$("#list").html(list_select(player_list));
						}
					}else{
						alert(response.message);
					}
				}else {
					throw "ErrorWithList"
				}
			},"json");
};

var list_select = function(player_list) {
	if(player_list) {
		var select= "<select id='players_list'>";
		$.each(player_list, function(i) {
				var x = player_list[i];
				select += "<option value='"+x.player_id+"'>"+x.player_name+"</option>";
			});
		select+= "</select><button id='selectPlay'>Play!</button>";
		return select;
	}else{
		throw "UghPlayerListError"
	}
};

var list_table = function(player_list) {
	if(player_list) {
		var table = "<table><tbody>";
		table += "<tr><td>Player Name</td><td>Player ID</td><td>Player Status</td></tr>";
		$.each(player_list, function(i) {
				var x = player_list[i];
				table += "<tr><td>"+x.player_name+"</td><td>"+x.player_id+"</td><td>"+x.playing+"</td></tr>";
			});
		table += "</tbody></table>";
		return table;
	}else{
		throw "UghPlayerListError"
	}
};

var accept = function(event) {
	var game_id =  player.game_id;
	console.log(game_id);
	console.log(player.player_id);
	$.post("http://richydelaney.com:8001/accept",
				{player_id: player.player_id,
				 game_id: game_id},
				 function(response) {
					if(response){
						if(response.status_code === 1){
							clearInterval(playerTicker);
							player.turn = 1;
							checkBoard();
							wait();
							user_notice("");
						}else{
							throw "CouldNotAcceptGame";
						}
					}else{
						alert(response.message);
					}
				 },"json");
}

var checkPlayerState = function() {
	$.post("http://richydelaney.com:8001/playercurrent",
			{player_id: player.player_id},
			function(response) {
				if(response) {
					if(response.status_code === 1){
						var state = (JSON.parse(response.state))[0];
						if(state){
							if(state.incoming.length >= 1) {
								for(var i=0;i<state.incoming.length;i++){
									var game = state.incoming[i];
									player.game_id = game.game_id;
									var str ="<p>"+game.player+" has requested a game.<p>"
									str += "<button id='accept'>Accept</button>"
									user_notice(
										str
										);
								}
							}
						}
					}else{
						alert(response.message);
					}
				}else{
					throw "UghPlayerStateError"
				}
			},"json");
}

var checkBoard = function() {
	/*player.game_id = $("#game_id").val();*/
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
			if(response.state.status.toLowerCase()!=="running"){
				user_notice(response.state.status);
				//End Game Code Here
			}
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

var user_notice = function(str) {
	$("#message_board").html(
			str
		);
};

