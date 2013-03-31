ig.module(
    'game.entities.player'
)

.requires(
    'impact.entity',
    'game.system.eventChain'
)

.defines(function () {
    EntityPlayer = ig.Entity.extend({
        name: 'player',
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,

        animSheet: new ig.AnimationSheet('media/player/player.png', 16, 16),
        size: {x: 20, y: 28},
        offset: {x: 5, y: 2},
        flip: false,

        maxVel: {x: 100, y: 150},
        friction: {x: 600, y: 0},
        accelGround: 400,

        isDead: false,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [5]);
            // Give the player a z-index of 1 so that he draws infront of all other entities.
            this.zIndex = 1;
            this.isDead = false;
        },

        logAnalyticsEvent: function(message) {
            ig.global._gaq.push(['_trackEvent', 'Player', message]);
        },

        movePlayer: function() {
            var accel = this.standing ? this.accelGround : this.accelAir;

            if (ig.input.state('left')) {
                this.accel.x = -accel;
                this.flip = true;
            } else if (ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }
        },

        stopMovingPlayer: function() {
            this.accel.x = 0;
            this.accel.y = 0;
        },

        update: function() {
            this.movePlayer();
            this.parent();
        },

        check: function (other) {
        },

        handleMovementTrace: function(res) {
            // Continue resolving the collision as normal
            this.parent(res);
        },

        ready: function() {
        }
    });
});