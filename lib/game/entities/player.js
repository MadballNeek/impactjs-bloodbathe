ig.module(
    'game.entities.player'
)

.requires(
    'game.entities.baseEntity',
    'game.system.eventChain'
)

.defines(function () {
    EntityPlayer = BaseEntity.extend({
        name: 'player',
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,

        animSheet: new ig.AnimationSheet('media/player/player.png', 16, 16),
        size: {x: 12, y: 15},
        offset: {x: 2, y: 1},
        flip: false,

        maxVel: {x: 100, y: 100},
        friction: {x: 600, y: 600},
        accelGround: 400,
        accelAir: 400,

        health: 100,
        isDead: false,

        deathEventChain: null,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.isDead = false;
            this.currentAnim = this.anims.idle;
            this.deathEventChain = EventChain(this)
                .then(function() {
                    this.isDead = true;
                    this.kill();
                })
                .repeat();
        },

        logAnalyticsEvent: function(message) {
            ig.global._gaq.push(['_trackEvent', 'Player', message]);
        },

        movePlayer: function() {
            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left')) {
                this.accel.x = -accel;
                // Set Y to 0 to prevent diagonal movement.
                this.accel.y = 0;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                // Set Y to 0 to prevent diagonal movement.
                this.accel.y = 0;
            } else if (ig.input.state('up')) {
                this.accel.y = -accel;
                // Set X to 0 to prevent diagonal movement.
                this.accel.x = 0;
            } else if (ig.input.state('down')) {
                this.accel.y = accel;
                // Set X to 0 to prevent diagonal movement.
                this.accel.x = 0;
            } else {
                this.stopMovingPlayer();
            }
        },

        stopMovingPlayer: function() {
            this.accel.x = 0;
            this.accel.y = 0;
        },

        update: function() {
            this.movePlayer();
            if (this.health <= 0) {
                this.deathEventChain();
            }
            this.parent();
        },

        check: function (other) {
        },
        // TODO: We may want to do distanceTo instead...
        collideWith: function (other) {
          if (other.name == 'enemy') {
              // Temporarily in god mode as I test some enemy respawning stuff.
              //this.health -= 10;
          }
        },

        handleMovementTrace: function(res) {
            // Continue resolving the collision as normal
            this.parent(res);
        },

        ready: function() {
        }
    });
});