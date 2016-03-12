/**
 * a player entity
 */
game.PlayerEntity = me.Entity.extend({
  /**
   * constructor
   */
  init : function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y, settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(3, 3);

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

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
  },

  /*
   * update the player pos
   */
  update : function (dt) {
    if (me.input.isKeyPressed('left')) {
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      this.body.vel.y = 0;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkLeft")) {
        this.renderable.setCurrentAnimation("walkLeft");
      }
    }
    else if (me.input.isKeyPressed('right')) {
      // update the entity velocity
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      this.body.vel.y = 0;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkRight")) {
        this.renderable.setCurrentAnimation("walkRight");
      }
    }
    else if (me.input.isKeyPressed('down')) {
      // update the entity velocity
      this.body.vel.y += this.body.accel.y * me.timer.tick;
      this.body.vel.x = 0;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkDown")) {
        this.renderable.setCurrentAnimation("walkDown");
      }
    }
    else if (me.input.isKeyPressed('up')) {
      // update the entity velocity
      this.body.vel.y -= this.body.accel.y * me.timer.tick;
      this.body.vel.x = 0;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkUp")) {
        this.renderable.setCurrentAnimation("walkUp");
      }
    }
    else {
      this.body.vel.x = 0;
      this.body.vel.y = 0;
      // change to the standing animation
      if (this.renderable.isCurrentAnimation("walkUp")) {
        this.renderable.setCurrentAnimation("faceUp");
      }
      else if (this.renderable.isCurrentAnimation("walkDown")) {
        this.renderable.setCurrentAnimation("faceDown");
      }
      else if (this.renderable.isCurrentAnimation("walkUp")) {
        this.renderable.setCurrentAnimation("faceLeft");
      }
      else if (this.renderable.isCurrentAnimation("walkRight")) {
        this.renderable.setCurrentAnimation("faceRight");
      }
      else {
        this.renderable.setCurrentAnimation("faceDown");
      }
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // Make all other objects solid
    return true;
  }
});
