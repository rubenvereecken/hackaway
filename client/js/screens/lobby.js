game.LobbyScreen = me.ScreenObject.extend({
    init: function() {
        // This is so we can draw
        // this.parent(true);
    },

    onResetEvent: function() {
        // Connect to server and set global reference to the socket that's connected
        global.network.socket  = io.connect(global.network.host, {port: global.network.port, transports: ["websocket"]});

        // Set up buttons and fonts
        this.font = new me.Font("Verdana", 12, "#fff", "center");
        this.joinbutton = new game.Button(600, 480, "joinbuttonde");

        // Set up initial, basic socket handlers
        global.network.socket.on("connect", this.onSocketConnected(this.joinbutton));

        // Add our renderable features to the screen
        me.game.add(new me.ColorLayer("background", "#333333", 1));
        me.game.add(this.joinbutton, 4);
        me.game.sort();
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
    },

    // Error handler; is called when the server fires off an error message
    handleError: function(error){
        console.log(error);
    },

    // When we connect...
    onSocketConnected: function(joinbutton, createbutton) {

        // Activate our buttons so that we can join or create new game rooms
        // On click: takes us to a game "Room"
        joinbutton.type = "joinbutton";
        joinbutton.image = me.loader.getImage("join");
    }
});
