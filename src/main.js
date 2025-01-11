const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 800,
    maxWidth: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT, // Ensures the game fits within the parent container
        //autoCenter: Phaser.Scale.CENTER_BOTH // Centers the game in the container
    },
};

let cup;
let score = 0;
let scoreText;
let objects;
let timerText;
let pointerMoveHandler;

let prizeElementsScore60_70 =
    ['Знижка на любу каву 50% :)', 'Печиво з передбаченням :)', 'Міні шоколадка :)'];

let prizeElementsScoreHigher70 = ['Безкоштовна кава'];

const game = new Phaser.Game(config);

function preload() {
    this.load.image('cup', 'assets/cup.png');
    this.load.image('coffeeBean', 'assets/coffeeBean.png');
    this.load.image('cherry', 'assets/cherry.png');
    this.load.image('sugar', 'assets/sugar.png');
    this.load.image('background', 'assets/background.png');
}

function create() {

    // Create background
    const bg = this.add.image(300, 400, 'background')
    bg.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    // Create cup
    cup = this.physics.add.image(300, 700, 'cup')
        .setDisplaySize(100,100)
        .setImmovable(true);
    cup.body.allowGravity = false;

    // Create score text
    scoreText = this.add.text(14, 14, 'Очки: 0',
        {
            fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma'
        });

    // Create a group for the objects
    objects = this.physics.add.group();

    // Create a timer text indicator
    timerText = this.add.text(320, 14, 'Часу залишилось: 30', {
        fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma'
    });

    // Set up a timer event to create objects every second
    this.time.addEvent({
        delay: 1000, // Delay in milliseconds (1 second)
        callback: spawnObject,
        callbackScope: this,
        loop: true, // Keep looping until manually stopped
    });

    this.time.addEvent({
        delay: 1000, // 1 second interval
        callback: updateTimer,
        callbackScope: this,
        loop: true // Continue updating every second
    });

    // Timer duration (e.g., 30 seconds)
    this.time.delayedCall(30000, function() {
        // Stop the timer after 30 seconds
        this.time.removeAllEvents();
    }, [], this);



    // Collision detection
    this.physics.add.overlap(cup, objects, collectObject, null, this);

    // Input handling
    pointerMoveHandler = function (pointer) {
        cup.x = pointer.x;
    };
    this.input.on('pointermove', pointerMoveHandler, this);
}

function spawnObject() {
    // Randomly choose between coffeeBean and sugar
    const key = Phaser.Math.RND.pick(['coffeeBean', 'sugar', 'cherry']);

    // Create the object and add it to the group
    const obj = objects.create(Phaser.Math.Between(0, 600), 0, key);

    // Set a random velocity for the object
    obj.setVelocityY(Phaser.Math.Between(150, 200));
}

function updateTimer() {
    let currentTime = parseInt(timerText.text.split(': ')[1]); // Get the current time from the text
    currentTime--; // Decrease the time by 1
    timerText.setText('Часу залишилось: ' + currentTime); // Update the timer text

    if (currentTime === 0) {
        this.input.off('pointermove', pointerMoveHandler, this);

        let messageBlock = this.add.graphics();
        messageBlock.fillStyle(0x000000, 0.7);  // Black background with opacity
        messageBlock.fillRect(0, 0, 600, 800);  // Position and size of the block

        if (score > 60) {
            messageText = this.add.text(50, 400, 'Чудова Робота, крути коло:', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
            setTimeout(() => {
                game.destroy(true);
                showWheel();
            }, 2000);

        } else {
            messageText = this.add.text(50, 400, 'Недостатньо очок, щоб отримати приз :(', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
            messageText = this.add.text(50, 450, 'Спробуй ще раз!', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        }
        // if (score > 60 && score < 70) {
        //     messageText = this.add.text(50, 400, 'Чудова Робота, твій приз:', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        //
        //     let prizeIndex = Math.floor(Math.random() * prizeElementsScore60_70.length);
        //     messageText = this.add.text(50, 450, prizeElementsScore60_70[prizeIndex], { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        // } else if (score >= 70) {
        //     messageText = this.add.text(50, 450, prizeElementsScoreHigher70[0], { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        // } else {
        //     messageText = this.add.text(50, 400, 'Недостатньо очок, щоб отримати приз :(', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        //     messageText = this.add.text(50, 450, 'Спробуй ще раз!', { fontSize: '28px', fill: '#FFFFFF',  fontFamily: 'Tahoma' });
        // }

    }
}

function update() {
    // Restrict cup within bounds
    if (cup.x < 0) {
        cup.x = 0;
    } else if (cup.x > 800) {
        cup.x = 800;
    }
}

function collectObject(cup, object) {
    object.disableBody(true, true);

    // Update score
    score += 1;
    scoreText.setText('Очки: ' + score);

    // Recycle objects
    object.enableBody(true, Phaser.Math.Between(0, 800), 0, true, true);
    object.setVelocityY(Phaser.Math.Between(100, 200));
}
