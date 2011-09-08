var Game = require("./xo.js").Game;
var assert = require("assert");

var instance = new Game();

instance.move(1,1);
instance.move(0,1);
instance.move(0,0);
instance.move(1, 0);
instance.move(2,2);
/*assert.ok(instance.whosTurn() === "Player 1", "Turn Logic Not Working");*/



assert.ok(instance.over() === "Player 1", "Basic Who Won Doesn't Work");

var instance2 = new Game( [ [ 0, -1, 0 ], [1, -1, -1] , [1, -1, -1] ], 0 );

instance2.move(0, 1);
assert.ok(instance2.over() === "Player 1", "ReInit Board Doesn't Work");

var instance3 = new Game( [ [0, 0, 0], [1, -1, -1], [-1, -1, -1] ]);

assert.ok(!instance3.isValidBoard(), "InvalidBoardError doesnt work");

/*
Responses:

/start?board=0,0,0,-1,-1,-1,1,1,1
or
/start?board=0,0,0,-1,-1,-1,1,1,1&Player1=Richy&Player2=Daphne
{
valid: 1,
turn: 0,
game_id : aaaaaaa,
over: 0
}

/move?x=0&y=1&game_id=aaaaaaa

{
		valid:1,
		turn:1,
		board: 
}
*/
