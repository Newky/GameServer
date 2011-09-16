Game Server in Node
===================

My plan is to build a server layer which can act as a RESTFUL interface for any turn based, board game.
It currently supports the following:

1. 1 or 2 player games
2. managing up to the amount of games a server can use before it runs out of memory
3. managing interactions with each of these game using their unique id
4. A generic move request which takes options for a game specific move
5. It is a layer between user and game logic, errors are caught but not thrown at server level

Each game file must create a game object (can be named anything you like) with the following defined:

Constructor

@params
     * board - *a representation of the board in array form*
     * turn - *a single integer value stating who has the starting turn, 0(player1), 1(player2)*
     * player1 - Player 1's name
     * player2 (optional) - Player 2's name(if null will presume its a one player game)

setBoard - a function to change the boards contents

@params
    * board - *a representation of the board in array form*

getState - a function to return the state of the board in the appropriate format

@params
    * none

output:
* a json object with the following fields
* board: json representation of the board
* turn: who's turn it is, (0 or 1)
* status: A line which reveals the game's state

requestMove - a function which the client can affect the internal state of the game

**note**: This is quite a dangerous function, the user can pass anything in as options and this must be vetted by the game logic. It also must be
parsed using the game logic. This may change, I have to think about it.

@params
	* gameid - the current games hash to uniquely identify it
	* options - this is a json object which can be parsed by JSON.parse
          
output:   
	* In the default return json object the returncode will be 1 on valid move any error messages will be logged in message.

Example game using the server
=============================

I decided to write a game to show the power of this server.
When writing a game for this server, the most important part will be the game logic which sits behind the server. This game logic must do a lot, it must provide the above functions in this generic way, while also working out its individuals needs and quirks.

I made an XO game for example as it seemed easy to write a good XO game which would demonstrate the power.

Heres the commands above abstracted to the server level.

### Creating a game

Lets set up a game between Alice and Bob

    curl -d "player1=alice&player2=bob&type=xo" http://server:port/game

This will return a json object:

    {"game_id":"a04fccfeb23e3f28140e8f96b8114de0da732691","status_code":1,"message":"Game Successfully added!"}

### Setting a board

Perhaps we want to set up the board so that it we are midway through a game

    curl -d 'game_id=a04fccfeb23e3f28140e8f96b8114de0da732691&board=[["1", "1", "-1"], ["0", "0", "-1"] , ["1", "0", "-1"]]' http://server:port/change

Responds with a json object

    {"game_id":"a04fccfeb23e3f28140e8f96b8114de0da732691","status_code":1,"message":"Board change successful"}

### Getting the state of the game

This will be different depending on the game logic you are modelling but let me demonstrate how it works in my game.

    curl -d 'game_id=a04fccfeb23e3f28140e8f96b8114de0da732691' http://richydelaney.com:8001/

Responds with the default return json object along with some other valuable additions

    {"game_id":"a04fccfeb23e3f28140e8f96b8114de0da732691","status_code":1,"message":"Retrieved state.","state":{"board":"[[\"X\",\"X\",\"-\"],[\"O\",\"O\",\"-\"],[\"X\",\"O\",\"-\"]]","turn":0,"status":"Running"}}

### Making a move

This is the area where most damage can be done and its the one I'm least happy with, as the server should support all game logic, it makes no sense for the server to do a check on the game so all checks on the JSON object needs to be done. Lets do a demo request:

    curl -d 'game_id=a04fccfeb23e3f28140e8f96b8114de0da732691&options={"x":0, "y":2}' http://richydelaney.com:8001/move

Responds (on a valid move with)

    {"game_id":"a04fccfeb23e3f28140e8f96b8114de0da732691","status_code":1,"message":"Valid Move"}



