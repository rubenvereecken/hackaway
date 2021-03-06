
var global = {
  network: {
    socket: undefined,
    host: 'localhost',
    port: 9000
  },
  state: {
    localPlayer: undefined,
    remotePlayers: []
  },
  playerById: function(id) {
    
  }
}

/* Game namespace */
var game = {
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "flex-width"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
        // me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.LOBBY, new game.LobbyScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.transition("fade", "#FFFFFF", 250);

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("coinEntity", game.CoinEntity);
        me.pool.register("enemyEntity", game.EnemyEntity);
        me.pool.register("farmEntity", game.FarmEntity);

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.ENTER, "action");
        console.log(me.input)

        // gravity has to be disabled
        me.sys.gravity = 0;

        // display the menu title
        // me.state.change(me.state.MENU);

        // // Start the game.
        me.state.change(me.state.LOBBY);
    }
};
