/**
 * a farming spot entity
 */
game.FarmEntity = me.Entity.extend({
  /**
   * constructor
   */
  init : function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);
    this.body.collisionType = me.collision.types.ACTION_OBJECT;
    this.alwaysUpdate = true;
    /*
    // define a basic walking animation
    this.renderable.addAnimation("walkDown",  [0, 1, 2, 3]);
    this.renderable.addAnimation("walkLeft", [4,5,6,7]);
    this.renderable.addAnimation("walkRight", [8,9,10,11]);
    this.renderable.addAnimation("walkUp", [12,13,14,15]);
    console.log(this.renderable)

    // define a standing animation (using the first frame)
    this.renderable.addAnimation("faceDown", [0]);
    this.renderable.addAnimation("faceLeft", [4]);
    this.renderable.addAnimation("faceRight", [8]);
    this.renderable.addAnimation("faceUp", [12]);

    // set the standing animation as default
    this.renderable.setCurrentAnimation("faceDown");
    */
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // Make all other objects solid
    return false;
  }
});
