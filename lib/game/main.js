ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
    'impact.debug.debug',
    'game.system.eventChain',
    'plugins.preloader',
    'game.levels.test'
)
.defines(function(){

MyGame = ig.Game.extend({
	player: null,
	font: new ig.Font('media/big-font.png'),

    gravity: 0,

    playerRespawnX: 29,
    playerRespawnY: 542,

    gameOver: false,

    playTime: 0.0,

	init: function() {
        this.logAnalyticsEvent('Start');

        // According to ImpactJS doc, it's best to turn off sound for mobile.
        if (ig.ua.mobile) {
            ig.Sound.enabled = false;
        }

        this.bindKeys();

        this.player = this.getEntityByName('player');
        this.loadLevel(LevelTest);
    },

    bindKeys: function() {
        ig.input.bind(ig.KEY.A, 'left');
        ig.input.bind(ig.KEY.D, 'right');
        ig.input.bind(ig.KEY.W, 'up');
        ig.input.bind(ig.KEY.S, 'down');

        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
    },

    respawnPlayer: function() {
        var settings = {isDead: false};
        this.player = this.spawnEntity(EntityPlayer, this.playerRespawnX, this.playerRespawnY, settings);
    },

    keepPlayerWithinScreen: function () {
        if (this.player) {
            // Top bounds
            if (this.player.pos.y < this.screen.y) {
                this.player.pos.y = this.screen.y;
            }
            // Left bounds
            if (this.player.pos.x < this.screen.x) {
                this.player.pos.x = this.screen.x;
            }
            // Right bounds
            if (this.player.pos.x > ig.system.width - this.collisionMap.tilesize) {
                this.player.pos.x = ig.system.width - this.collisionMap.tilesize;
            }
        }
    },

    logAnalyticsEvent: function(message) {
        ig.global._gaq.push(['_trackEvent', 'Game', message]);
    },

    update: function() {
		this.parent();

        this.playTime += ig.system.tick;

        this.keepPlayerWithinScreen();
    },
	
	draw: function() {
		this.parent();
	}
});

ig.main('#canvas', MyGame, 60, 720, 480, 1.5, MyLoader);

});
