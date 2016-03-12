game.LobbyScreen = me.ScreenObject.extend({
    init: function() {
        // This is so we can draw
        // this.parent(true);
        this._super(me.ScreenObject, 'init', [true])
        console.log(this)
    },

    onResetEvent: function() {
        // Connect to server and set global reference to the socket that's connected
        // global.network.socket  = io.connect(global.network.host, {port: global.network.port, transports: ["websocket"]});
        global.network.socket = new WebSocket('ws://localhost:' + 9000);

        // Set up buttons and fonts
        // this.font = new me.Font("Verdana", 12, "#fff", "center");
        this.joinbutton = new game.Button(480, 250, "join");

        // Set up initial, basic socket handlers
        // global.network.socket.on("connect", this.onSocketConnected(this.joinbutton));
        console.log(global.network.socket);
        global.network.socket.onopen = this.onSocketConnected(this.joinbutton);

        // Add our renderable features to the screen
        me.game.world.addChild(new me.ColorLayer("background", "#000", 1));
        me.game.world.addChild(this.joinbutton);
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

    onSocketConnected: function(joinbutton) {
        console.log('connected');

        // Activate our buttons so that we can join or create new game rooms
        // On click: takes us to a game "Room"
        joinbutton.image = me.loader.getImage("join");
    }
});
