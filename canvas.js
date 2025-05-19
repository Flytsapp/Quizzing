const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");
const cnvCont = document.getElementById("canvas-cont");

const ccColor = document.getElementById("cc-color");
const ccSize = document.getElementById("cc-size");
const ccClear = document.getElementById("cc-clear");
const ccEraser = document.getElementById("cc-eraser");
const colorInp = document.getElementById("color-inp");


cnvCont.appendChild(cnv);

cnv.width = cnvCont.clientWidth;
cnv.height = cnvCont.clientHeight;

let vw = innerWidth/100;
let vh = innerHeight/100;
let cw = cnv.width/100;
let ch = cnv.height/100;

let lineThickness = 1;
let lineThicknessFactor = .25*vh;
let maxLineThickness = 8;

let backgroundColor = "#fefefe";
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,100*cw,100*ch);

addEventListener("resize", ()=> {
    cnv.width = cnvCont.clientWidth;
    cnv.height = cnvCont.clientHeight;
    vw = innerWidth/100;
    vh = innerHeight/100;
    cw = cnv.width/100;
    ch = cnv.height/100;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0,0,100*cw,100*ch);
});


function windowToCanvasCords(x, y){
    return [x-cnv.offsetLeft, y-cnv.offsetTop];
}

const w2c = windowToCanvasCords;

// Drawing Mechanism

let px = 0, py = 0;

cnv.onmousedown = emd => {
    let cnvCords = w2c(emd.clientX, emd.clientY);
    px = cnvCords[0], py = cnvCords[1];
    
    ctx.beginPath();
    ctx.moveTo(px, py);
    
    onmousemove = emm => {
        let cnvCords = w2c(emm.clientX, emm.clientY);
        let x = cnvCords[0], y = cnvCords[1];

        if(x==px && y==py) return;

        ctx.lineTo(x, y);
        ctx.stroke();
    }

    onmouseup = () => {
        onmousemove = ()=>{}
        onmouseup = ()=>{}
    }

}

cnv.ontouchstart = emd => {
    let cnvCords = w2c(emd.touches[0].clientX, emd.touches[0].clientY);
    px = cnvCords[0], py = cnvCords[1];
    
    ctx.beginPath();
    ctx.moveTo(px, py);

    ontouchmove = emm => {
        let cnvCords = w2c(emm.touches[0].clientX, emm.touches[0].clientY);
        let x = cnvCords[0], y = cnvCords[1];

        if(x==px && y==py) return;

        ctx.lineTo(x, y);
        ctx.stroke();
    }

    ontouchend = () => {
        ontouchmove = ()=>{}
        ontouchend = ()=>{}
    }

}

// clear canvas
ccClear.onclick = () => ctx.fillRect(0, 0, 100*cw, 100*ch);


// Color changing

ccColor.onclick = () => {
    ctx.strokeStyle = colorInp.value;
    colorInp.click();
}

colorInp.onchange = () => {
    ctx.strokeStyle = colorInp.value;
    ccColor.style.backgroundColor = colorInp.value;
}

// Brush Size
ccSize.onclick = () => {

    lineThickness++;
    if(lineThickness>maxLineThickness) lineThickness = 1;

    ctx.lineWidth = Math.round(lineThickness*lineThicknessFactor);
    ccSize.innerText = String(lineThickness);

}

//Eraser
ccEraser.onclick = () => {
    ctx.strokeStyle = backgroundColor;
}