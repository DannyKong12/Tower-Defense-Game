var MACHINETURRET_RANGE = 200;
var MACHINETURRET_ATTACK_SPEED = 100;

var MachineTurret = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function MachineTurret (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'machineTurret');
            this.nextTic = 0;
        },
        place: function(i, j) {            
            this.y = i * 64 + 64/2;
            this.x = j * 64 + 64/2;
            map[i][j] = 1;            
        },
        fire: function() {
            var enemy = getEnemy(this.x, this.y, MACHINETURRET_RANGE);
            if(enemy) {
                var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                addMachineBullet(this.x, this.y, angle);
                this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
            }
        },
        update: function (time, delta)
        {
            if (time > this.nextTic) {
                this.fire();
                this.nextTic = time + MACHINETURRET_ATTACK_SPEED;
            }
            if (playerHP <= 0) {
                this.setVisible(false);
                this.setActive(false);
            }
        }
});

function canPlaceMachineTurret(i, j) {
    return map[i][j] === 0;
}

function placeMachineTurret(pointer) {
    if (money >= 300) {
        var i = Math.floor(pointer.y/64);
        var j = Math.floor(pointer.x/64);
        if(canPlaceMachineTurret(i, j)) {
            money -= 300;
            var machineTurret = machineTurrets.get();
            if (machineTurret)
            {
                machineTurret.setActive(true);
                machineTurret.setVisible(true);
                machineTurret.place(i, j);
            }   
        }
    }
}

function addMachineBullet(x, y, angle) {
    var machineBullet = machineBullets.get();
    if (machineBullet) {
        machineBullet.fire(x, y, angle);
    }
}

function getEnemy(x, y, distance) {
    var enemyUnits = enemies.getChildren();
    for(var i = 0; i < enemyUnits.length; i++) {       
        if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
            return enemyUnits[i];
    }
    return false;
} 

