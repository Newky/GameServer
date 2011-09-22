var sha1_hash = require("./hash.js").sha1_hash;

var Player = function(player_name, player_number) {
	this.player_number = player_name;
	this.player_id = sha1_hash(player_name +""+ player_number);
	this.player_name = player_name;
	this.playing = false;
	this.games = [];
	this.requestsPending = [];
	this.requestsIncoming = [];
};

exports.Player = Player;


