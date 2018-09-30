var MACHINEBULLET_SPEED = 0.5;
var MACHINEBULLET_DAMAGE = 50;

var MachineBullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function MachineBullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'machineBullet');

        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;

        this.speed = Phaser.Math.GetSpeed(500, 1);
    },

    fire: function (x, y, angle)
    {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);

        this.lifespan = 1000;
    },

    update: function (time, delta)
    {
        this.lifespan -= delta;

        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});
