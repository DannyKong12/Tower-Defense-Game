var ENEMY_SPEED = 1/10000;
var ENEMY_HP = 400;

var Enemy = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Enemy (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            this.hp = 0;
        },

        startOnPath: function ()
        {
            this.follower.t = 0;
            this.hp = ENEMY_HP;
            
            path.getPoint(this.follower.t, this.follower.vec);
            
            this.setPosition(this.follower.vec.x, this.follower.vec.y);            
        },
        receiveDamage: function(damage) {
            this.hp -= damage;           
            
            if(this.hp <= 0) {
                this.setActive(false);
                this.setVisible(false);    
                money += 10;
            }
        },
        update: function (time, delta)
        {
            this.follower.t += ENEMY_SPEED * delta;
            path.getPoint(this.follower.t, this.follower.vec);
            
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

            if (this.follower.t >= 1) {
                this.setActive(false);
                this.setVisible(false);
                playerHP -= 10;
            }

            if (playerHP <= 0) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
});

function damageEnemyWithBullet(enemy, bullet) {
    if (enemy.active === true && bullet.active === true) {
        bullet.setActive(false);
        bullet.setVisible(false);    
        enemy.receiveDamage(BULLET_DAMAGE);
    } 
}

function damageEnemyWithMachineBullet(enemy, machineBullet) {  

    if (enemy.active === true && machineBullet.active === true) {
        machineBullet.setActive(false);
        machineBullet.setVisible(false);    
        enemy.receiveDamage(MACHINEBULLET_DAMAGE);
    }
}