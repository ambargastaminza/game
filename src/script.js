var config = {
    type: Phaser.AUTO,
    //Tamaño de pantalla que usará Phaser:
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300},
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var gameOver = false;

var playerHealth = 1000;

var healthText;

var score = 0;

var scoreText;

function preload() {
    //fondo
    this.load.image("layer1", "Assets/background/background_layer_1.png");
    this.load.image("layer2", "Assets/background/background_layer_2.png");
    this.load.image("layer3", "Assets/background/background_layer_3.png");
    //jugador
    this.load.spritesheet("player_1", "Assets/Player2/Warrior.png", {
        frameWidth: 69,
        frameHeight: 44
    });

    //enemigo
    this.load.spritesheet("goblin", "Assets/Goblin/Goblin.png", {
        frameWidth: 151,
        frameHeight: 119
    });


    //decoraciones
    this.load.image("lamp", "Assets/decorations/lamp.png");
    this.load.image("shop", "Assets/decorations/shop_anim.png", {frameWidth: 130, frameHeight: 128});


    //plataformas
    this.load.image("platform1", "Assets/Platforms/0.png");
    this.load.image("platform2", "Assets/Platforms/1.png");
    this.load.image("platform3", "Assets/Platforms/2.png");
    this.load.image("ground1", "Assets/Platforms/3.png");
    this.load.image("ground2", "Assets/Platforms/4.png");
    this.load.image("ground3", "Assets/Platforms/5.png");
    this.load.image("ground4", "Assets/Platforms/6.png");

    //slimes
    this.load.spritesheet("slimes", "Assets/Slime/Slime.png", {
        frameWidth: 32,
        frameHeight: 32,
    });

    //Ojo volador
    this.load.spritesheet("eyeUp", "Assets/Eye/Eye.png", {
        frameWidth: 150,
        frameHeight: 78,
    });
};


function create(){
    //fondo
    this.add.image(400, 230, "layer1").setScale(2.6,2.6);
    this.add.image(400, 230, "layer2").setScale(2.6,2.6);
    this.add.image(400, 230, "layer3").setScale(2.6,2.6);


    platforms = this.physics.add.staticGroup();
   
    //plataformas
    platforms.create(280, 320, "platform1").setScale(2,2).refreshBody();
    platforms.create(300, 150, "platform1").setScale(2,2).refreshBody();
    platforms.create(500, 370, "platform1").setScale(2,2).refreshBody();
    platforms.create(500, 200, "platform1").setScale(2,2).refreshBody();
    platforms.create(100, 230, "platform1").setScale(2,2).refreshBody();


    platforms.create(700, 300, "platform2").setScale(2.5,2).refreshBody();
    
    //piso
    platforms.create(65, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(200, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(330, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(460, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(590, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(720, 520, "platform3").setScale(2,2).refreshBody();
    platforms.create(850, 520, "platform3").setScale(2,2).refreshBody();


    //jugador
    player_1 = this.physics.add.sprite(100, 350, "player_1").setScale(2);
    player_1.setCollideWorldBounds(true);
    player_1.setBounce(0.2);
    this.physics.add.collider(player_1, platforms);
    player_1.body.setSize(22, 35, true);
    
    this.anims.create({
        key: "stand",
        frames: this.anims.generateFrameNumbers("player_1", {start: 0, end: 5}),
        frameRate: 6,
        repeat: -1
    });


    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player_1", {start: 6, end: 14}),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: "attack",
        frames: this.anims.generateFrameNumbers("player_1", {start: 15, end: 25}),
        frameRate: 10,
        repeat: 0
    })


    this.anims.create({
        key: "die",
        frames: this.anims.generateFrameNumbers("player_1", {start: 26, end: 29}),
        frameRate: 10,
        repeat: -1
    })


    cursors = this.input.keyboard.createCursorKeys();

    player_1.body.setGravityY(300);

    this.input.keyboard.on('keydown-ENTER', function (event) {
        player_1.anims.play('attack', true);
        player_1.setVelocityX(0);
    });
    

    //slimes
    slimes = this.physics.add.group({
        key: "slimes",
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers("slimes", {start: 21, end: 26}),
        frameRate: 10,
        repeat: -1
    });

    slimes.children.iterate(function(child) {
        child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        child.body.setSize(16, 22, true);
        child.anims.play("jump", true);
    });

    this.physics.add.collider(slimes, platforms);

    this.physics.add.overlap(player_1, slimes, collectSlimes, null, true);

        //Textos
        scoreText = this.add.text(16, 16, "puntuación: 0", {fill: "white"});

        healthText = this.add.text(16, 32, "salud: 1000"), {fill: "white"};

        //Enemigos
        enemy = this.physics.add.group();

        this.physics.add.collider(enemy, platforms);

        this.physics.add.collider(player_1, enemy, hit, null, this);


        //Eye
        this.anims.create({
            key: "eyeFly",
            frames: this.anims.generateFrameNumbers("eyeUp", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        //Goblin
        this.anims.create({
            key: "goblinWalk",
            frames: this.anims.generateFrameNumbers("goblin", { start: 24, end: 31 }),
            frameRate: 6,
            repeat: -1
        });
        
        this.anims.create({
            key: "goblinAttack",
            frames: this.anims.generateFrameNumbers("goblin", { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        })
};


function update(){

    if (gameOver) {
        return;
    }

//jugador
if (cursors.left.isDown) {
player_1.setVelocityX(-160)
player_1.anims.play("run", true);
player_1.flipX = true;
} else if (cursors.right.isDown) {
player_1.setVelocityX(160);
player_1.anims.play("run", true);
player_1.flipX = false;
} else {
player_1.setVelocityX(0)
player_1.anims.play("stand", true);
}

if (cursors.up.isDown && player_1.body.touching.down) {
    player_1.setVelocityY(-350);
};

};

function collectSlimes(player_1, slime) {
    slime.disableBody(true,true);
    score += 10;
    scoreText.setText("puntuación: " + score);

    if (slimes.countActive(true) === 0) {
        slimes.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
            var genEnemy = (Math.random(0,1));
        });
    };

    var x = (player_1.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    if (Math.random < 0.5) {
    var eyeUp = enemy.create(x, 16, "eyeUp");
    eyeUp.setBounce(0.5);
    eyeUp.setCollideWorldBounds(true);
    eyeUp.setVelocity(Phaser.Math.Between(-200, 200), 20);
    eyeUp.body.setSize(42, 36, true);
    eyeUp.anims.play("eyeFly");
    } else {
        var goblin = enemy.create(x, 400, "goblin");
    goblin.setBounce(0);
    goblin.setCollideWorldBounds(true);
    goblin.setGravityY(300);
    goblin.setVelocity(Phaser.Math.Between(-200, 200), 20);
    goblin.body.setSize(33, 36, true);
    goblin.anims.play("goblinWalk");
    }

    if (eyeUp) {
        if (player_1.x < eyeUp.x) {
            eyeUp.setVelocityX(-50);
            eyeUp.anims.play("eyeFly", true);
            eyeUp.flipX = true;
        } else if (player_1.x > eyeUp.x) {
            eyeUp.setVelocityX(50);
            eyeUp.anims.play("eyeFly", true);
            eyeUp.flipX = false;
        };
    };
    
    if (goblin) {
        if (player_1.x < goblin.x) {
            goblin.setVelocityX(-50);
            goblin.anims.play("goblinWalk", true);
            goblin.flipX = true;
        } else if (player_1.x > goblin.x) {
            goblin.setVelocityX(50);
            goblin.anims.play("goblinWalk", true);
            goblin.flipX = false;
        };
    };
};

function hit(player_1, enemy) {
    player_1.setTint("0xff0000");
    setTimeout(() => {
        player_1.clearTint();
    }, 1000);
    
    playerHealth -= 20;
    healthText.setText("salud :" + playerHealth);
}

if (playerHealth === 0){
    gameOver = true;
}