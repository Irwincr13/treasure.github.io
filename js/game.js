class GameScene extends Phaser.Scene {
  //Initiate params on scene
  init() {
    this.hunterSpeed = 1.5;
    this.wildDogSpeed = 1;
    this.wildDogMaxY = 280;
    this.wildDogMinY = 80;
  }

  //Asset preloading
  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("hunter", "assets/hunter.png");
    this.load.image("wildDog", "assets/dog.png"); 
    this.load.image("treasure", "assets/treasure.png");
  }

  //Create sprites and display on screen
  create() {
    //reset FX upon creation
    this.cameras.main.resetFX();

    //dimensions of screen
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    //background sprite location
    const bg = this.add.sprite(0, 0, "background");
    bg.setPosition(gameWidth / 2, gameHeight / 2);

    //hunter sprite location
    this.hunter = this.add.sprite(40, gameHeight / 2, "hunter");
    this.hunter.setScale(0.5);

    //treasure sprite location
    this.treasure = this.add.sprite(gameWidth - 80, gameHeight / 2, "treasure");
    this.treasure.setScale(0.6);

    //group of wild dogs location
    //total of 6 wild dogs as per requirement
    this.wildDogs = this.add.group({
      key: "wildDog",
      repeat: 5,
      setXY: {
        x: 110,
        y: 100,
        stepX: 80,
        stepY: 20,
      },
    });
    Phaser.Actions.ScaleXY(this.wildDogs.getChildren(), -0.5, -0.5);

    //speed of wild dogs
    Phaser.Actions.Call(
      this.wildDogs.getChildren(),
      function (wildDog) {
        wildDog.speed = Math.random() * 1;
      },
      this
    );
  }

  //update each frame
  update() {
    //set alive state
    this.hunter.isAlive = true;

    if (!this.hunter.isAlive) {
      return;
    }

    //move hunter
    if (this.input.activePointer.isDown) {
      this.hunter.x += this.hunterSpeed;
    }

    //hunter collects treasure
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.hunter.getBounds(),
        this.treasure.getBounds()
      )
    ) {
      this.win();
    }

    //movement of wild dogs
    const wildDogs = this.wildDogs.getChildren();
    const wildDogCount = wildDogs.length;

    for (let i = 0; i < wildDogCount; i++) {
      wildDogs[i].y += wildDogs[i].speed;

      //reverse direction of wild dogs
      if (wildDogs[i].y >= this.wildDogMaxY && wildDogs[i].speed > 0) {
        wildDogs[i].speed *= -1;
      } else if (wildDogs[i].y <= this.wildDogMinY && wildDogs[i].speed < 0) {
        wildDogs[i].speed *= -1;
      }

      //hunter collides with wildDog
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.hunter.getBounds(),
          wildDogs[i].getBounds()
        )
      ) {
        this.collision();
        break;
      }
    }
  }

  win() {
    //hunter has died
    this.hunter.isAlive = false;

    //shake camera
    this.cameras.main.shake(0.1, 500);

    //fade camera
    this.time.delayedCall(
      250,
      function () {
        this.cameras.main.fade(250);
      },
      [],
      this
    );

    //restart game
    this.time.delayedCall(
      500,
      function () {
        this.scene.restart();
      },
      [],
      this
    );
  }

  collision() {
    //hunter has died
    this.hunter.isAlive = false;

    //shake camera
    this.cameras.main.shake(500);

    //fade camera
    this.time.delayedCall(
      250,
      function () {
        this.cameras.main.fade(250);
      },
      [],
      this
    );

    //restart game
    this.time.delayedCall(
      500,
      function () {
        this.scene.restart();
      },
      [],
      this
    );
  }
}

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: GameScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

//add config to game
const game = new Phaser.Game(config);
