ig.module(
    'game.screens.gameScreen'
)

.requires(
    'impact.game',
    'game.entities.player',
    'game.entities.enemy',
    'plugins.astar-for-entities',
    'game.system.objectPool',
    'game.system.eventChain',
    'game.levels.test'
)

.defines(function() {
    GameScreen = ig.Game.extend({
        screenWidth: 720,
        screenHeight: 480,

        player: null,
        font: new ig.Font('media/big-font.png'),

        gravity: 0,

        playerRespawnX: 173,
        playerRespawnY: 62,

        gameOver: false,
        playTime: 0.0,
        enemyRespawnTime: 3.0,

        enemyObjectPool: null,
        enemyRespawnEventChain: null,

        init: function() {
            this.enemyObjectPool = new ObjectPool();
            this.enemyRespawnEventChain = EventChain(this)
                .wait(3)
                .then(function() {
                    var enemy;
                    enemy = this.enemyObjectPool.createEntity(EntityEnemy,
                        Math.floor((Math.random() * this.screenWidth) + 1),
                        500);
                    enemy.respawn();
                })
                .repeat();
            this.bindKeys();
            this.loadLevel(LevelTest);
        },

        bindKeys: function() {
            ig.input.bind(ig.KEY.MOUSE1, 'leftClick');

            ig.input.bind(ig.KEY.A, 'left');
            ig.input.bind(ig.KEY.D, 'right');
            ig.input.bind(ig.KEY.W, 'up');
            ig.input.bind(ig.KEY.S, 'down');

            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.UP_ARROW, 'up');
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down')
        },

        respawnPlayer: function(x, y, settings) {
            this.player = this.spawnEntity('EntityPlayer', x, x, settings);
        },

        respawnEnemy: function() {
            var enemy = this.enemyObjectPool.createEntity(EntityEnemy,
                Math.floor((Math.random() * this.screenWidth) + 1),
                500);
            enemy.respawn();
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

        spawnEnemies: function() {
            this.enemyObjectPool.createEntity(EntityEnemy, 34, 17);
            this.enemyObjectPool.createEntity(EntityEnemy, 534, 13);
            this.enemyObjectPool.createEntity(EntityEnemy, 66, 389);
            this.enemyObjectPool.createEntity(EntityEnemy, 354, 401);
            this.enemyObjectPool.createEntity(EntityEnemy, 734, 501);
            this.enemyObjectPool.createEntity(EntityEnemy);
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
        },

        loadLevel: function(data) {
            this.parent(data);
            var settings = {isDead: false};
            this.respawnPlayer(this.playerRespawnX, this.playerRespawnY, settings);
            this.spawnEnemies();
        }
    });
});