game.Button = me.GUI_Object.extend({
    init: function(x, y, type) {
        settings = {
            name: type,
            image: type,
            spritewidth: 380,
            spriteheight: 100
        };
        this.type = type
        this.playing = false;

        this.parent(x,y,settings);
    },

    onClick: function() {
        else if(this.type === "playbutton") {
            if(!this.playing) {
                var data = {
                    name: "guest"
                };
                global.network.socket.emit("join", data);
                this.playing = true;
            }
        }else {
            // throw error
        }

        return false;
    }
});
