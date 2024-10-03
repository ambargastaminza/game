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


window.addEventListener("click", () => {
    if(game.sound.context,state === "suspended") {
        game.sound.context.resume();
    };
})

var game = new Phaser.Game(config);

var platforms;

var player_1;

var enemy_1;

var playerHealth = 100;

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
    this.load.spritesheet("enemy_1", "Assets/Goblin/Goblin.png", {
        frameWidth:
        frameHeight:
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
    player_1 = this.physics.add.sprite(100, 350, "player").setScale(2);
    player_1.setCollideWorldBounds(true);
    player_1.setBounce(0.2);
    this.physics.add.collider(player_1, platforms);
    player_1.body.setSize(22, 35, true);

    //enemigos


    this.anims.create({
        key: "stand",
        frames: this.anims.generateFrameNumbers("player", {start: 0, end: 5}),
        frameRate: 6,
        repeat: -1
    });


    this.anims.create({
        key: "run",
        frames: this.anims.generateFrameNumbers("player", {start: 6, end: 14}),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: "attack",
        frames: this.anims.generateFrameNumbers("player", {start: 15, end: 25}),
        frameRate: 10,
        repeat: 0
    })


    this.anims.create({
        key: "die",
        frames: this.anims.generateFrameNumbers("player", {start: 26, end: 29}),
        frameRate: 10,
        repeat: -1
    })


    cursors = this.input.keyboard.createCursorKeys();


    player_1.anims.play("stand");
    player_1.setVelocityX(0)


    player_1.body.setGravityY(300);

    this.input.keyboard.on('keydown-ENTER', function (event) {
        player_1.anims.play('attack', true);
        player_1.setVelocityX(0);
    });
    

};


function update(){


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