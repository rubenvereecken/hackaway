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
    this.body.setVelocity(3, 15);

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
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkLeft")) {
        this.renderable.setCurrentAnimation("walkLeft");
      }
    }
    else if (me.input.isKeyPressed('right')) {
      // update the entity velocity
      this.body.vel.x += this.body.accel.x * me.timer.tick;

      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("walkRight")) {
        this.renderable.setCurrentAnimation("walkRight");
      }
    }
    else {
      this.body.vel.x = 0;
      this.body.vel.y = 0;

      // change to the standing animation
      this.renderable.setCurrentAnimation("faceDown");
    }

    if (me.input.isKeyPressed('jump')) {
      // make sure we are not already jumping or falling
      if (!this.body.jumping && !this.body.falling) {
        // set current vel to the maximum defined value
        // gravity will then do the rest
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;

        // set the jumping flag
        this.body.jumping = true;
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
  }}
);

/**
 * a Coin entity
 */
game.CoinEntity = me.CollectableEntity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.CollectableEntity, 'init', [x, y , settings]);

  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
    // do something when collected

    // make sure it cannot be collected "again"
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);

    // remove it
    me.game.world.removeChild(this);

    return false
  }
});

/**
 * an enemy Entity
 */
game.EnemyEntity = me.Entity.extend({
  init: function (x, y, settings) {
    // define this here instead of tiled
    settings.image = "wheelie_right";

    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.framewidth = settings.width = 64;
    settings.frameheight = settings.height = 64;

    // redefine the default shape (used to define path) with a shape matching the renderable
    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // set start/end position based on the initial area size
    x = this.pos.x;
    this.startX = x;
    this.endX   = x + width - settings.framewidth
    this.pos.x  = x + width - settings.framewidth;

    // to remember which side we were walking
    this.walkLeft = false;

    // walking & jumping speed
    this.body.setVelocity(4, 6);

  },

  /**
   * update the enemy pos
   */
  update : function (dt) {

    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      }
      else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      }

      // make it walk
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    }
    else {
      this.body.vel.x = 0;
    }

    // update the body movement
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
    if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
      // res.y >0 means touched by something on the bottom
      // which mean at top position for this one
      if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
        this.renderable.flicker(750);
      }
      return false;
    }
    // Make all other objects solid
    return true;
  }
});
