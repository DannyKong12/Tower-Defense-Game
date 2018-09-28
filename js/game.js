var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 768,
    height: 576,
    physics: {
        default: 'arcade'
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var enemyModifier = 1.0;

var enemyCount = 0;
var enemiesToSpawn = 0;
var shouldStartWave = false;
var shouldConfiguredEnemies = false;
var wave = 0;
var money = 300;
var playerHP = 100;
var SPAWN_TIME = 1000;

var path;
var turrets;
var enemies;

var useMachineTurret = false;

var map =   [[ 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
            [ 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
            [ 0, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, -1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, -1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, -1],
            [ 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, -1, -1],
            [ 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, -1 , -1],
            [ 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1],];

function preload() {    
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('machineTurret', 'assets/machineTurret.png');
    this.load.image('machineBullet', 'assets/machineBullet.png');
}

function create() {
    var graphics = this.add.graphics();    
    drawGrid(graphics);
    path = this.add.path(96, -32);
    path.lineTo(96, 164);
    path.lineTo(544, 164);
    path.lineTo(544, 480);
    path.lineTo(160, 480);
    path.lineTo(160, 512);
    
    graphics.lineStyle(2, 0xffffff, 1);
    path.draw(graphics);
    
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });

    machineTurrets = this.add.group({ classType: MachineTurret, runChildUpdate: true });
    
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    machineBullets = this.physics.add.group({ classType: MachineBullet, runChildUpdate: true });
    
    this.nextEnemy = 0;

    this.physics.add.overlap(enemies, bullets, damageEnemyWithBullet);
    this.physics.add.overlap(enemies, machineBullets, damageEnemyWithMachineBullet);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.moneyText = this.add.text(650, 16, '', { fontSize: '16px', fill: '#0000FF'});
    this.waveText = this.add.text(650, 38, '', { fontSize: '16px', fill: '#0000FF'});
    this.hpText = this.add.text(650, 60, '', { fontSize: '16px', fill: '#0000FF'});
    this.gameOverText = this.add.text(200, 250, '', { fontSize: '50px', fill: '#0000FF'});
}

function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(var i = 0; i < 9; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(var j = 0; j < 11; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}

function update(time, delta) {
    TurretSelector(this.input);
    if (playerHP <= 0) {
        gameOverManager(this.gameOverText, this.cursors);
    }
    this.moneyText.setText('Money: ' + money);
    this.waveText.setText('Wave: ' + wave);
    this.hpText.setText('HP: ' + playerHP);
    upgradesManager(this.cursors);
    
    this.input.keyboard.on('keydown_LEFT', function (event) {
        shouldStartWave = true;
    });
    if (isWaveCompleted()) {
        configureNextWave();
    }
    if (shouldStartWave) {
        configureEnemies();
        if (time > this.nextEnemy) {
            var enemy = enemies.get();
            if (enemy) {
                enemy.setActive(true);
                enemy.setVisible(true);
                enemy.startOnPath();
                this.nextEnemy = time + SPAWN_TIME;
                enemyCount += 1;
            }
        }
    }
}

function TurretSelector(input, pointer) {
    input.keyboard.on('keydown_A', function (event) {
        input.on('pointerdown', placeMachineTurret);
        input.off('pointerdown', placeTurret);
    });

    input.keyboard.on('keydown_B', function (event) {
        input.on('pointerdown', placeTurret);
        input.off('pointerdown', placeMachineTurret);
    });
}

function configureNextWave() {
    shouldStartWave = false;
    enemyCount = 0;
    wave += 1;
    shouldConfiguredEnemies = true;
    money += 100;
}

function isWaveCompleted() {
     return enemyCount >= enemiesToSpawn;
}

function resetEnemies() {
    SPAWN_TIME = 1000;
    enemiesToSpawn = wave + 5;
    ENEMY_SPEED = 1/10000;
    ENEMY_HP = 400;
}

function configureEnemies() {
    if (shouldConfiguredEnemies) {
        enemyModifier *= 1.1;
        resetEnemies();
        buffSelector = 5;//Math.floor((Math.random() * 5) + 1);

        switch(buffSelector) {
            case 1: 
                ENEMY_HP *= enemyModifier;
                break;
            case 2:
                ENEMY_SPEED *= enemyModifier;
                break;
            case 3:
                SPAWN_TIME /= (enemyModifier * Math.floor((Math.random() * 5) + 1));
                break;
            case 4: 
                var modFactor = enemyModifier * Math.floor((Math.random() * 5) + 1);
                ENEMY_HP *= modFactor
                ENEMY_SPEED /= (modFactor * 1.5);
                break;
            case 5: 
                enemiesToSpawn = 1;
                ENEMY_HP *= (enemyModifier * 10);
                ENEMY_SPEED /= (enemyModifier * 1.5);
                break;
        }
        shouldConfiguredEnemies = false;
    }
 }

 function gameOverManager(gameOverText, cursors) {
    gameOverText.setText('Game Over!');
    if (cursors.left.isDown) {
        enemyCount = 0;
        shouldStartWave = false;
        shouldConfiguredEnemies = false;
        wave = 0;
        money = 300;
        playerHP = 100;
        gameOverText.setText('');

    }
 }

 function upgradesManager(cursors) {
     if (cursors.up.isDown && money > 200) {
         BULLET_DAMAGE *= 1.25;
         money -= 200;
     }
     if (cursors.right.isDown && money > 150) {
        TURRET_RANGE *= 1.25;
        money -= 150;
    }
 }
