let canv= document.querySelector(".can");
let dr= canv.getContext("2d");

function resizecanv(){
    canv.width= window.innerWidth;
    canv.height= window.innerHeight;
}
resizecanv();
window.addEventListener("resize", resizecanv);

const tom={
    x: 120,
    y: canv.height-170,
    walking: true,
    walkspeed: 2.5,
    walktime:0,
    scale: 1,
    legangle: 0,
    armangle: 0,
    bounce: 0
};
function walk(){
    if(!tom.walking) return;
    tom.x+=tom.walkspeed;
    tom.walktime+=0.15;
    tom.legangle= Math.sin(tom.walktime)*0.5;
    tom.armangle= Math.sin(tom.walktime)*0.4;
    tom.bounce=Math.abs(Math.sin(tom.walktime))*3;
}
function draw(){
    dr.save();
    dr.translate(tom.x, tom.y+tom.bounce);
    dr.scale(tom.scale, tom.scale);

    dr.strokeStyle="white";
    dr.lineWidth=13;
    dr.lineCap="round";
    dr.beginPath();
    dr.moveTo(-13, 85);
    dr.lineTo(-20+tom.legangle*25, 130);
    dr.stroke();
    dr.beginPath();
    dr.moveTo(13, 85);
    dr.lineTo(20-tom.legangle*25, 130);
    dr.stroke();

    dr.fillStyle="blue";
    dr.beginPath();
    dr.roundRect(-35,5,70,90,18);
    dr.fill();

    dr.strokeStyle="white";
    dr.lineWidth=14;
    dr.lineCap="round";
    dr.beginPath();
    dr.moveTo(-32, 20);
    dr.lineTo(-52-tom.armangle*20, 65);
    dr.stroke();
    dr.beginPath();
    dr.moveTo(32, 20);
    dr.lineTo(52+tom.armangle*20, 65);
    dr.stroke();

    dr.fillStyle="white";
    dr.fillRect(-10,-5,20,18);

    dr.beginPath();
    dr.arc(0,-35,40,0, Math.PI * 2);
    dr.fill();
    dr.restore();
}

function animate(){
    dr.clearRect(0,0,canv.width,canv.height);
    tom.y= canv.height-170;
    walk();
    draw();
    requestAnimationFrame(animate);
}
    animate();

