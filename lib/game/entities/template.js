ig.module(
    // Change me to proper entity name.
    'game.entities.template'
)

.requires(
    'impact.entity',
    'game.system.eventChain'
)

.defines(function () {
    EntityTemplate = ig.Entity.extend({
        name: 'template',
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,

        //animSheet: new ig.AnimationSheet('media/sheet.png', 16, 16),
        size: {x: 12, y: 15},
        offset: {x: 2, y: 1},
        flip: false,

        maxVel: {x: 100, y: 100},
        friction: {x: 600, y: 600},
        accelGround: 400,
        accelAir: 400,

        isDead: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.isDead = false;
            this.currentAnim = this.anims.idle;
        },

        logAnalyticsEvent: function(message) {
            ig.global._gaq.push(['_trackEvent', 'Entity', message]);
        },

        stopMovingEntity: function() {
            this.accel.x = 0;
            this.accel.y = 0;
        },

        update: function() {
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