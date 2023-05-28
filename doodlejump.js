//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width : doodlerWidth,
    height : doodlerHeight,
}

//physics
let velocityX = 0;
let velocityY = 0; //doodler jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let Gameover = false;

window.onload = function () {
    board = document.getElementById ("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw doodler
    // context.fillStyle = "green";
    // context.fillRect (doodler.x, doodler.y, doodler.width, doodler.height);

    //load images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./purin-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage (doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./purin-left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;

    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);

    if (Gameover) {
        return;
    }

    context.clearRect (0, 0, board.width, board.height);

    // draw doodler over and over again
    doodler.x += velocityX;
    if (doodler.x > boardWidth) doodler.x = 0;
    if (doodler.x + doodler.width<0) doodler.x = boardWidth;

    velocityY += gravity;
    doodler.y += velocityY;

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    if (doodler.y > board.height) {
        Gameover = true;
    }

    //platforms
    for (let i=0;i<platformArray.length;i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight * 3/4) {
            platform.y -= initialVelocityY;
            // platform.y -= velocityY;
        }
        if (detectCollision(doodler,platform) && velocityY>=0) {
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    //clear platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlatform();
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText (score, 5, 20);

    if (Gameover) {
        context.fillText ("game Over: Press 'Space' to Restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveDoodler (e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 4;
        // doodler.x += velocityX;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = -4;
        // doodler.x += velocityX;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && Gameover) {
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width : doodlerWidth,
            height : doodlerHeight,
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        Gameover = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = []; 

    //starting plateforms
    let platform = {
        img : platformImg,
        x : boardWidth / 2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight,
    }

    platformArray.push(platform);

    for (let i=0;i<6;i++) {
        let randomX = Math.floor (Math.random() * boardWidth*3/4);

        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight,
        }
    
        platformArray.push(platform);
    }
}

function newPlatform () {
    let randomX = Math.floor (Math.random() * boardWidth*3/4);

    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight,
    }

    platformArray.push(platform);
}

function detectCollision (a, b) {
    return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;
}

function updateScore () {
    let points = Math.floor (50 * Math.random());
    if (velocityY < 0) {
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}
