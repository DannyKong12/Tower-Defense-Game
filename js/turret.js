var TURRET_RANGE = 400;
var ATTACK_SPEED = 1000;
var SPEED = Phaser.Math.GetSpeed(1500, 1);


var Turret = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Turret (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
            this.nextTic = 0;
        },
        place: function(i, j) {
            this.y = i * 64 + 64/2;
            this.x = j * 64 + 64/2;
            map[i][j] = 1;
        },
        fire: function() {
            var enemy = getEnemy(this.x, this.y, TURRET_RANGE);
            if(enemy) {
                // var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                var length = Math.sqrt((this.x - enemy.x)*(this.x - enemy.x) + (this.y - enemy.y)*(this.y - enemy.y))/1.5;
                var newpos = leading(enemy, length);
                var newlength = Math.sqrt((this.x - newpos[0])*(this.x - newpos[0]) + (this.y - newpos[1])*(this.y - newpos[1]))/1.5;
                if (newlength - length > 40) {
                  var newpos = leading(enemy, newlength);
                }
                var angle = Phaser.Math.Angle.Between(this.x, this.y, newpos[0], newpos[1]);
                addBullet(this.x, this.y, angle);
                this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
            }
        },
        update: function (time, delta)
        {
            if (time > this.nextTic) {
                this.fire();
                this.nextTic = time + ATTACK_SPEED;
            }
            if (playerHP <= 0) {
                this.setVisible(false);
                this.setActive(false);
            }
        }
});

function canPlaceTurret(i, j) {
    return map[i][j] === 0;
}

function placeTurret(pointer) {
    if (money >= 100) {
        var i = Math.floor(pointer.y/64);
        var j = Math.floor(pointer.x/64);
        if(canPlaceTurret(i, j)) {
            money -= 100;
            var turret = turrets.get();
            if (turret)
            {
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
            }
        }
    }
}

function addBullet(x, y, angle) {
    var bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle);
    }
}

function getEnemy(x, y, distance) {
    var enemyUnits = enemies.getChildren();
    enemyUnits = enemyUnits.filter(enemy => {
      return enemy.active;
    }).filter(enemy => {
      return Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) < distance;
    }).sort((a, b) => {
      return b.follower.t - a.follower.t;
    });
    if (enemyUnits) return enemyUnits[0];
    return false;

}
