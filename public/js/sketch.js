
var scoreBoard;
var gameSounds;

var score = 0;
var level = 1;
var enemySpeed = 0;
var ship;
var enemies = [];
var shots = [];


function preload() {
    soundFormats('mp3', 'wav');

    gameSounds = {
        laserSound: loadSound('/sounds/laser_gun.wav'),
        //blast: loadSound('/sounds/medium_blast.mp3'),
        blast: loadSound('/sounds/bomb.mp3'),
        song: loadSound('/sounds/background.mp3'),
    }
    
    gameImages = {
        background: loadImage('/img/invader.jpg'),
    }
    
}

function setup(){
    var canvas = createCanvas(800, 600);
    canvas.parent('sketch-holder');
    frameRate(60);

    scoreBoard = new scoreBoard();

    ship = new Ship();

    for (var i=0; i < 6; i++) {
        enemies[i] = new Enemy(i *80 +80, 60);
    }

    gameSounds.song.loop();
    gameSounds.song.setVolume(0.5);
    
    
}

function resetEnemies(){
    for (var i=0; i < 9; i++) {
        enemies[i] = new Enemy(i *80 +80, 60);
    }
}

function draw () {
    background(gameImages.background);
    checkGameStatus();
    checkShip();
    moveShots();
    checkShots();
    moveEnemies();
    checkEnemies();
}

// Updates shots positions
function moveShots(){    
    for (var i=0; i < shots.length; i++){
        shots[i].move();
        shots[i].show();
        for (var j=0; j < enemies.length; j++) {
            if (shots[i].hits(enemies[j])) {
                enemies[j].evap();
                shots[i].evaporate();
            }
        }
    }
}

// Removes shots that have collided or passed off screen
function checkShots(){   
    for (var i = shots.length-1; i >= 0; i--) {
        if (shots[i].toDelete){
            shots.splice(i,1);
        }
    }
}

// Updates enemies positions
function moveEnemies(){
    var edge = false;
    
    for (var i = 0; i < enemies.length; i++){
        enemies[i].show();
        enemies[i].move();
        if (enemies[i].x > 760 || enemies[i].x <0){
            edge = true;
        }
    }

    if (edge) {
        for (var i=0; i< enemies.length; i++){
            enemies[i].shiftDown();
        }
    }
}


// Removes dead enemies
function checkEnemies(){
    for (var i= enemies.length-1; i >= 0; i--) {
        if (enemies[i].toDelete){
            gameSounds.blast.play();
            scoreBoard.increaseScore(1);
            enemies.splice(i,1);
        }
    }
}

//check to see if any enemies are left
function checkGameStatus() {
    if (enemies.length == 0) {
        // scoreBoard.message.html('You passed a level.  Your score is : ' + scoreBoard.score);
        scoreBoard.increaseLevel(1);
        resetEnemies();
    }
}

// check to see if enemy hit the ship
// function checkEnemyHitShip (){
//     if (Enemy === ship.x) {
//         scoreBoard.message.html('Game ended! Your score was : ' + scoreBoard.score + "/n/rLevel Finished: " + scoreBoard.level);
//         gameSounds.song.stop();
//     }
// }

function checkShip(){
    if(keyIsDown(LEFT_ARROW) & keyIsDown(RIGHT_ARROW)){
        ship.setDir(0);
    } else if(keyIsDown(LEFT_ARROW)){
        ship.setDir(-1);
    } else if(keyIsDown(RIGHT_ARROW)){
        ship.setDir(1);
    } else {
        ship.setDir(0);
    }
    ship.move();
    ship.show();
}


function keyPressed () {
    if (key === " ") {
        console.log(ship.ready);
        if (ship.ready){
            ship.shoot();
            var shot = new Shot(ship.x, height);
            gameSounds.laserSound.play();
            shots.push(shot);
        }
    }
}
