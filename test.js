var Manager = require("./xo.js").Manager;
var assert = require("assert");
var Manager = require("./manager.js").Manager;
var xo = require("./xo.js").xo;

var gamesmaster = new Manager();

gamesmaster.addType("xo", xo);

var game_id = gamesmaster.addGame("a", "bc", "xo");

//Test Hash Function
assert.ok(game_id == "a9993e364706816aba3e25717850c26c9cd0d89d", "Hash function not working");
//Test Valid Move
assert.ok(gamesmaster.requestMove(game_id, {x:0,y:0}) == 1, "Valid Moves Break it");
//Test Invalid Move
assert.ok(gamesmaster.requestMove(game_id, {x:0,y:0}) == 0, "Invalid Moves Break it");

/*//Do some moves and win game*/
gamesmaster.requestMove(game_id, {x:0, y:1});
gamesmaster.requestMove(game_id, {x:1, y:1});
gamesmaster.requestMove(game_id, {x:2, y:1});

/*//Match Win Works*/
assert.ok(gamesmaster.requestMove(game_id, {x:2,y:2}) === "a", "GameOver DoesntWork");

var game_id = gamesmaster.addGame("Test1", "Test2", "xo");

gamesmaster.requestMove(game_id, {x:0, y:0}); //0
gamesmaster.requestMove(game_id, {x:0, y:1}); //X
gamesmaster.requestMove(game_id, {x:1, y:2}); //0
gamesmaster.requestMove(game_id, {x:1, y:1}); //X
gamesmaster.requestMove(game_id, {x:2, y:1}); //O
gamesmaster.requestMove(game_id, {x:2, y:2}); //X
gamesmaster.requestMove(game_id, {x:2, y:0}); //0
gamesmaster.requestMove(game_id, {x:1, y:0}); //X

assert.ok(gamesmaster.requestBoard(game_id).toString() === ([["O","X","-"],["X","X","O"],["O","O","X"]]).toString(), "get Board Doesnt Work");

assert.ok(gamesmaster.requestMove(game_id, {x:0, y:2}) === "DrawnGame", "Draw Doesn't Work");

console.log("If you've got to here, you're golden ;)");

