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
              var length = Math.sqrt((this.x - enemy.x)*(this.x - enemy.x) + (this.y - enemy.y)*(this.y - enemy.y))/0.5;
              var newpos = leading(enemy, length);
              var newlength = Math.sqrt((this.x - newpos[0])*(this.x - newpos[0]) + (this.y - newpos[1])*(this.y - newpos[1]))/0.5;
              if (newlength - length > 40) {
                var newpos = leading(enemy, newlength);
              }
              var angle = Phaser.Math.Angle.Between(this.x, this.y, newpos[0], newpos[1]);
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
