Game Server in Node
===================

This is a server I've created in the interest of having a client server model for any game. The idea is that the game would be a seperate JS file which is loaded in as the game that the user wants to play but that the management system would do the rest. It provides an interface which any application can post to the server.

As a demo the first game I've created is a simple X and O game.

I'll run through the different steps and different possibilities:

For these example I'll use curl but any application which handles post requests and its params will work fine

### Initialise Game

    curl -d 'player1=richy&player2=testplayer' http://serveraddress:wherenoderesides/

The server then spits out some json with a game_id:

   { game_id: "5090d29b62366c00a2e261cae5f1f344fa199670" }

For now this is set to the hash of the two players. The game_id is then used from here on out to control any aspects of the game.
Its important to note that the server communications should be done client side by other code, and the client side should either have its own game representation or else use the server for everything.

### Making a Move

To make a move in the XO game, we need to request a move, 

**note:** The concept of a turn in stored in the server model, so when it recieves a message notifying it of a move it assumes that it is from the person's who's turn it is. This may seem badly designed but in fact, if there is client side cooperation using this, the game_id secures it to the two persons while the client side should take a time to wait until its their turn, using long polling or websockets if I make that an option.

    curl -d 'game_id=5090d29b62366c00a2e261cae5f1f344fa199670&options={"x":0, "y":0}' http://serveraddress:wherenoderesides/

This will return some similar json with game_id again and the status of the operation

### Getting Board State

To check what the board looks like at any stage we do the following

    curl -d 'game_id=5090d29b62366c00a2e261cae5f1f344fa199670' http://serveraddress:wherenoderesides/

### On Game End

If the game ends or the game is drawn then when the user makes the final move the status will appear as ValidMove and either the winner or else that the match has been drawn

### To Do

1. Game state after the game is done needs to be looked at, the design is bad.
2. Need a quick lookup which tells u who's turn and also the state of the game (Won (By whom?) ), Drawn, Open, Invalid)
3. Add a more generic management system, currently, its not directly game pluggable. A game object is needed which can be inherited from and played directly regardless of the game.
4. Lots More
