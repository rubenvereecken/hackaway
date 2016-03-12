game.Button = me.GUI_Object.extend({
    init: function(x, y, type) {
        settings = {
            name: type,
            image: type,
            framewidth: 250,
            frameheight: 100
        };
        this.type = type
        this.playing = false;
        console.log('created button')
        this.z = 1000;

        this._super(me.GUI_Object, 'init', [x, y, settings]);
    },

    onClick: function() {
        console.log('onclick', this.type)
        if(this.type === "join") {
            if (!this.playing) {
                var data = {
                    join: null,
                    name: "guest"
                };
                global.network.socket.send(data);
                this.playing = true;
                me.state.change(me.state.PLAY);
            }
        } else {
            // throw error
        }

        return false;
    }
});
