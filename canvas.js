const cnv = document.createElement("canvas");
const ctx = cnv.getContext("2d");
const cnvCont = document.getElementById("canvas-cont");

const ccColor = document.getElementById("cc-color");
const ccSize = document.getElementById("cc-size");
const ccClear = document.getElementById("cc-clear");
const ccEraser = document.getElementById("cc-eraser");
const ccImg = document.getElementById("cc-img");
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

cnv.onpointerdown = emd => {
    let cnvCords = w2c(emd.clientX, emd.clientY);
    px = cnvCords[0], py = cnvCords[1];
    
    ctx.beginPath();
    ctx.moveTo(px, py);
    
    onpointermove = emm => {
        let cnvCords = w2c(emm.clientX, emm.clientY);
        let x = cnvCords[0], y = cnvCords[1];

        if(x==px && y==py) return;
        // console.log(x, y);

        ctx.lineTo(x, y);
        ctx.stroke();
    }

    onpointerup = () => {
        onpointermove = ()=>{}
        onpointerup = ()=>{}
    }

}


// clear canvas
function clearCanvas(){
    ctx.fillRect(0, 0, 100*cw, 100*ch);
}
ccClear.onclick = clearCanvas;


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

//refresh Image
ccImg.onclick = loadCurrentQuestionImage;


//image funtions
function drawCentralImg(img){
    let iw = img.width, ih = img.height; // orighinal wh
    let rw = 0, rh = 0; //required wh

    // width stretch
    rw = 100 * cw;
    rh = ih * rw / iw;    
    if(rh > 100 * ch) {
        //height stretch
        rh = 100 * ch;
        rw = iw * rh / ih;
    }
    
    let x = 100 * cw/2 - rw/2;
    let y = 100 * ch/2 - rh/2;

    ctx.drawImage(img, x, y, rw, rh);
}