ig.module(
    'game.entities.enemy'
)

.requires(
    'impact.entity',
    'game.system.eventChain'
)

.defines(function () {
    EntityEnemy = ig.Entity.extend({
        name: 'enemy',
        collides: ig.Entity.COLLIDES.ACTIVE,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.B,

        animSheet: new ig.AnimationSheet('media/vamps/vamp.png', 16, 16),
        size: {x: 12, y: 15},
        offset: {x: 2, y: 1},
        flip: false,

        maxVel: {x: 100, y: 100},
        friction: {x: 600, y: 600},
        accelGround: 400,
        accelAir: 400,

        isDead: false,
        pathTimer: null,
        pathRefreshTime: 0.5,
        pathFindingSpeed: 75,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.isDead = false;
            this.currentAnim = this.anims.idle;
            this.pathTimer = new ig.Timer(this.pathRefreshTime);
        },

        logAnalyticsEvent: function(message) {
            ig.global._gaq.push(['_trackEvent', 'Entity', message]);
        },

        stopMovingEntity: function() {
            this.accel.x = 0;
            this.accel.y = 0;
        },

        update: function() {
            if (this.pathTimer.delta() > 0) {
                // If the player isn't dead, he's the target.
                // Else, pick a random (x, y) coordinate on the screen to roam too.
                var targetX = !ig.game.player._killed ? ig.game.player.pos.x : Math.floor((Math.random() * ig.game.screenWidth) + 1);
                var targetY = !ig.game.player._killed ? ig.game.player.pos.y : Math.floor((Math.random() * ig.game.screenHeight) + 1);
                this.getPath(targetX, targetY, false);
                this.pathTimer.reset();
            }

            this.followPath(this.pathFindingSpeed, true);

            this.parent();
        },

        check: function(other) {
        },

        handleMovementTrace: function(res) {
            this.parent(res);
        },

        ready: function() {
        }
    });
});