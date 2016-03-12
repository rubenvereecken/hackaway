/**
 * a farming spot entity
 */
game.FarmEntity = me.Entity.extend({

  /**
   * constructor
   */
  init : function (x, y, settings) {
    settings.image = 'wheat_alive'; 
    settings.framewidth = 100;
    this._super(me.Entity, 'init', [x, y, settings]);
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // Make all other objects solid
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    return false;
  }
});
