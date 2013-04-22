ig.module(
    'game.system.objectPool'
)

.requires(
    'impact.impact',
    'impact.game'
)

.defines((function (global) {
    'use strict';

    global.ObjectPool = function () {
        var pool;

        pool = [];

        this.createEntity = function(entityType, x, y, settings) {
            var entity;
            for (var i = 0; i < pool.length; ++i) {
                // TODO: Duck that check!
                if (pool[i] instanceof entityType) {
                    console.log("entity found in pool");
                    entity = pool.splice(i, 1)[0];
                    entity.pos.x = x || Math.floor((Math.random() * ig.game.screenWidth) + 1);
                    entity.pos.y = y || ig.game.screenHeight + 50;
                    break;
                }
            }
            // We didn't find an entity of the requested type in the pool,
            // so we should spawn a new entity.
            if (!entity) {
                console.log("entity not found in pool, spawning new entity");
                entity = ig.game.spawnEntity(entityType,
                    x || Math.floor((Math.random() * ig.game.screenWidth) + 1),
                    y || ig.game.screenHeight + 50,
                    settings || undefined);
            }

            return entity;
        };

        this.push = function(entity) {
            if (entity) {
                pool.push(entity);
            }
        };
    };
}).bind(this, this));