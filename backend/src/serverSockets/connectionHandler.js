
// This class handles all the game connections socket handlers
class connectionHandler{
	constructor(server,client){
		this.server = server;
        this.client = client;
    }

	joinGameRoom(client,data){
		// client joins room with gameid
		client.join(data.gameid);

		// if game does not exist
		if(global.data.findGame(data.gameid) === undefined){
			console.log("DATA GAMEID: "+data.gameid);
			global.data.createNewGame(data.gameid);
		}

		var game = global.data.findGame(data.gameid);
		// check that max players have not been exceeded
		if(game.getPlayersList().length < game.m_max_players){
            // add the player to the gamelist
            console.log("ADDING PLAYER " + data.name);
			game.addPlayer(client.id,data.name);

			// broadcast to all users in the room that a new player has joined
			var playersList = global.data.findGame(data.gameid).getPlayersList();
			var broadcastData = {"gameid":data.gameid,"playersList":playersList};
			global.emitters.broadcast_updateRoomPlayers(broadcastData);	

			// broadcast chat message that a new player has joined
			var chatMessage = data.name + " has joined the room!"
			var chatData = {gameid: data.gameid, from: "server", content: chatMessage, type:"serverAnnouncement"};

			global.data.mongoDB.insertChatMessage(data.gameid, "server", chatMessage, "serverAnnouncement").catch(function(err){
				console.log("Error:", err);
			}).finally(function(results){
				global.emitters.broadcast_chatUpdate(chatData);	
			});
			
		} else{
			// throw an error, max players reached in this game room
		}
	}

	leaveGameRoom(client,data){
		// client leaves the room with the gameid
		client.leave(data.gameid);

		// remove the player from the room
		global.data.findGame(data.gameid).removePlayer(data.name);

		var playersList = global.data.findGame(data.gameid).getPlayersList();

		// if that was the last user in the room, delete the room
		if(playersList.length == 0 ) {
			console.log("No one left in game id:",data.gameid,"removing game...");
			global.data.removeGame(data.gameid);
		}
		else{
			// otherwise, update the game room
			// broadcast to all users in the room that a new player has joined
			var broadcastData = {"gameid":data.gameid,"playersList":playersList};
			global.emitters.broadcast_updateRoomPlayers(broadcastData);
		}
    }
    
    getGame(client) {
		// First element is its own socket id, second element is game id
		console.log("KEYS: "+ Object.keys(client.rooms));
        return global.data.findGame(Object.keys(client.rooms)[1]);
    }

    updateGame(client,data){
        var game = this.getGame(client);
        game.update(data);
    }

    startGame(client) {
		// find game
        var game = this.getGame(client);
        game.beginGame(client.id);
    }

    rcvPunish(client, data) {
        var game = this.getGame(client);;
        game.rcvPunish(client.id, data.punishment);
    }

	eventHandlers(){
		const client = this.client;

		client.on("joinGameRoom",function(data){
			this.joinGameRoom(client,data);
		}.bind(this));

		client.on("leaveGameRoom",function(data){
			this.leaveGameRoom(client,data);
		}.bind(this));

        client.on("updateGame", function(data){
            this.updateGame(client,data);
        })
        
		client.on("dummyFunction",function(data){
			try {
				if (true) {
					console.log("WOOOO");
				}
			} catch(err) {
				console.log(err);
			}
        }.bind(this));

        client.on("startGame",function(){
			this.startGame(client);
        }.bind(this));
        
        client.on("sendPunishment",function(data){
			console.log("DATA KEY: "+Object.keys(data));
            this.rcvPunish(client,data);
        }.bind(this))
	}

}

export default connectionHandler;