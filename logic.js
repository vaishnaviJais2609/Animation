
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const input = document.getElementById("arrayInput");
const createBtn = document.getElementById("createBtn");
const message = document.getElementById("message");

canvas.width = 1000; 
canvas.height = 500;

const sprite = new Image();
sprite.src = "character.png";
const frameWidth = 1024 / 3;
const frameHeight = 1024 / 2;

const spriteCanvas = document.createElement("canvas");
const spriteCtx = spriteCanvas.getContext("2d");

spriteCanvas.width = frameWidth;
spriteCanvas.height = frameHeight;

const boy = {
    x: 30,
    y: 285,
    width: 150,
    height: 135,
    speed: 3,
    targetX: 30,
    moving: false
};
let walkFrame = 0;
let frameTimer = 0;
const frameDelay = 120;
const boxWidth = 100;
const boxHeight = 70;
const boxGap = 20;
const boxStartX = 120;
const boxY = 205;
let boxes = [];
let numbers = [];
let pass = 0;
let compare = 0;
let sorting = false;
let action = "idle";
let waitTimer = 0;

createBtn.addEventListener("click", function () {
    const text = input.value.trim();
        if (text === "") {
            message.textContent = "Enter numbers first.";
            return;
    }

      numbers = text
        .split(/[\s,]+/)
        .map(Number)
        .filter(n => !isNaN(n));

    if (numbers.length < 2) {
          message.textContent = "Enter at least 2 numbers.";
          return;
    }
    if (numbers.length > 7) {
          message.textContent ="Maximum 7 numbers.";
          return;
    }
    boxes = [];

    for (let i = 0; i < numbers.length; i++) {
          boxes.push({
            value: numbers[i],
            x: getBoxX(i),
            targetX: getBoxX(i)
         });
}
    pass = 0;
    compare = 0;
    sorting = true;

    boy.x = 30;
    boy.targetX = getBoyTarget(0);
    boy.moving = true;
    action = "goToPair";
    message.textContent = "Pass 1 / " + (numbers.length - 1);
});

function getBoxX(index) {
        return boxStartX +
        index * (boxWidth + boxGap);
}

function getBoyTarget(index) {
    const firstBox = getBoxX(index);
    const secondBox = getBoxX(index + 1);

    return (
        (firstBox + secondBox + boxWidth) / 2
    ) - boy.width / 2;
}
function moveBoy() {

    const distance =
        boy.targetX - boy.x;


    if (Math.abs(distance) <= 1) {

        boy.x = boy.targetX;

        boy.moving = false;

        return true;

    }


    if (distance > 0) {

        boy.x += Math.min(
            boy.speed,
            distance
        );

    } else {

        boy.x -= Math.min(
            boy.speed,
            -distance
        );

    }


    return false;

}

function moveBoxes() {

    let finished = true;


    for (const box of boxes) {

        const distance =
            box.targetX - box.x;


        if (Math.abs(distance) > 0.5) {

            finished = false;


            if (distance > 0) {

                box.x += Math.min(
                    5,
                    distance
                );

            } else {

                box.x -= Math.min(
                    5,
                    -distance
                );

            }

        } else {

            box.x = box.targetX;

        }

    }


    return finished;

}

function updateBoxTargets() {

    for (let i = 0; i < boxes.length; i++) {

        boxes[i].targetX =
            getBoxX(i);

    }

}

function swapBoxes() {

    const temp = boxes[compare];

    boxes[compare] =
        boxes[compare + 1];

    boxes[compare + 1] =
        temp;


    updateBoxTargets();

}
function nextComparison() {
    if (
        compare >=
        numbers.length - pass - 1
    ) {

        pass++;

        compare = 0;
        if (pass >= numbers.length - 1) {

            sorting = false;

            action = "finished";

            boy.moving = false;

            message.textContent =
                "✓ Bubble Sort Complete!";

            return;

        }
        boy.x = 30;

        boy.targetX =
            getBoyTarget(0);

        boy.moving = true;

        action = "goToPair";


        message.textContent =
            "Pass " +
            (pass + 1) +
            " / " +
            (numbers.length - 1);

        return;

    }

    boy.targetX =
        getBoyTarget(compare);

    boy.moving = true;

    action = "goToPair";

}
function updateSorting(delta) {

    if (!sorting) {
        return;
    }
    if (action === "goToPair") {

        if (moveBoy()) {

            waitTimer = 450;

            action = "compare";

        }

        return;

    }
    if (action === "compare") {

        waitTimer -= delta;


        if (waitTimer <= 0) {

            const a =
                boxes[compare].value;

            const b =
                boxes[compare + 1].value;


            if (a > b) {

                message.textContent =
                    "Comparing " +
                    a +
                    " and " +
                    b +
                    " → SWAP";

                action = "swap";

            } else {

                message.textContent =
                    "Comparing " +
                    a +
                    " and " +
                    b +
                    " → No Swap";

                waitTimer = 500;

                action = "next";

            }

        }

        return;

    }
    if (action === "swap") {

        swapBoxes();

        action = "moveBoxes";

        return;

    }

    if (action === "moveBoxes") {

        if (moveBoxes()) {

            waitTimer = 400;

            action = "next";

        }

        return;

    }

    if (action === "next") {

        waitTimer -= delta;


        if (waitTimer <= 0) {

            compare++;

            nextComparison();

        }

    }

}
function createTransparentFrame(frame) {

    spriteCtx.clearRect(
        0,
        0,
        spriteCanvas.width,
        spriteCanvas.height
    );
const fw = sprite.width / 3;
const fh = sprite.height / 2;

const cropLeft = 25;

const sx = Math.round(frame * fw) + cropLeft;
const sx2 = Math.round((frame + 1) * fw);

spriteCtx.drawImage(
    sprite,
    sx,
    0,
    sx2 - sx,
    fh,
    0,
    0,
    spriteCanvas.width,
    spriteCanvas.height
);

    const imageData =
        spriteCtx.getImageData(
            0,
            0,
            spriteCanvas.width,
            spriteCanvas.height
        );


    const data =
        imageData.data;

    for (let i = 0; i < data.length; i += 4) {

        const red = data[i];

        const green = data[i + 1];

        const blue = data[i + 2];

        if (
            blue > red * 1.20 &&
            blue > green * 1.05
        ) {

            data[i + 3] = 0;

        }

    }


    spriteCtx.putImageData(
        imageData,
        0,
        0
    );


    return spriteCanvas;

}

function drawBoy() {

    if (!sprite.complete) {
        return;
    }


    const frameImage =
        createTransparentFrame(walkFrame);


    ctx.drawImage(

        frameImage,

        boy.x,
        boy.y,

        boy.width,
        boy.height

    );

}

function drawBox(box) {

    const x = box.x;

    const y = boxY;

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";

    ctx.fillRect(

        x + 5,
        y + 7,

        boxWidth,
        boxHeight

    );

    ctx.fillStyle =
        "#fffdf0";

    ctx.fillRect(

        x,
        y,

        boxWidth,
        boxHeight

    );

    ctx.strokeStyle =
        "#172033";

    ctx.lineWidth = 4;

    ctx.strokeRect(

        x,
        y,

        boxWidth,
        boxHeight

    );

    ctx.fillStyle =
        "#111827";

    ctx.font =
        "bold 30px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(

        box.value,

        x + boxWidth / 2,
        y + boxHeight / 2

    );

}


function drawBoxes() {

    for (const box of boxes) {

        drawBox(box);

    }

}

function drawFloor() {

    ctx.fillStyle =
        "#0797c7";

    ctx.fillRect(

        0,
        420,

        canvas.width,
        3

    );

}

function drawInfo() {

    if (boxes.length === 0) {
        return;
    }


    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.fillRect(
        20,
        20,
        330,
        52
    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "bold 19px Arial";

    ctx.textAlign =
        "left";


    if (sorting) {

        ctx.fillText(

            "Bubble Sort | Pass " +
            (pass + 1) +
            " / " +
            (numbers.length - 1),

            35,
            52

        );

    } else {

        ctx.fillText(
            "SORTING COMPLETE ✓",
            35,
            52
        );

    }

}

let lastTime = 0;


function animate(time) {

    const delta =
        time - lastTime;

    lastTime = time;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
        "#08a9d9";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawFloor();
    if (boy.moving) {

        frameTimer += delta;


        if (frameTimer >= frameDelay) {

            frameTimer = 0;

            walkFrame++;


            if (walkFrame >= 3) {

                walkFrame = 0;

            }

        }

    } else {

        walkFrame = 0;

        frameTimer = 0;

    }
    updateSorting(delta);

    moveBoxes();
    drawInfo();

    drawBoxes();


    drawBoy();


    requestAnimationFrame(animate);

}

sprite.onload = function () {

    requestAnimationFrame(animate);

};