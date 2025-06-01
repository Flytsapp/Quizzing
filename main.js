const quiz = new Quiz();
const rankings = new Rankings("ranking-cont", []);
const timer = new Timer(60, "timer-minutes", "timer-seconds");
const imagesManager = new ImagesManager();
const timerElement = document.getElementById("timer");
const uploadFileBtn = document.getElementById("upload-file");
const startQuizBtn = document.getElementById("start-quiz");
const createQuizBtn = document.getElementById("create-quiz-btn");
const uploadImagesBtn = document.getElementById("upload-images");
const fileInp = document.getElementById("file-inp");
const imageInp = document.getElementById("image-inp");
const startupScreen = document.getElementById("startup-screen");
const greetsElement = document.getElementById("greets");

const continueBtn = document.getElementById("continue-btn");
const skipBtn = document.getElementById("skip");

const touchDisabler = document.getElementById("touchdisabler");

const fullScrBtn = document.getElementById("fullscr-btn");
const exitfullScrBtn = document.getElementById("exitfullscr-btn");

let questionImg = null;


// Misc functions

function greet(){
    let hrs = (new Date()).getHours();
    if(hrs<12){
        greetsElement.innerText = "Good Morning!";
    } else if (hrs < 18){
        greetsElement.innerText = "Good Afternoon!";
    } else {
        greetsElement.innerText = "Good Evening!";
    }
}

function disableTouch(){
    touchDisabler.style.display = "block";
}
function enableTouch(){
    touchDisabler.style.display = "none";
}


//timer setup
timer.onTimeUp.push(()=>{

    let beep = new Audio("audio/beep.mp3");
    beep.play();

});

timerElement.onclick = () => {
    timer.toggle();
}

//Image manager
imagesManager.attachInput("image-inp");
imagesManager.attachLog("upload-images");
uploadImagesBtn.onclick = () => {
    imageInp.click();
}

function setQuestionImage(img){
    questionImg = img;
    drawCentralImg(img);
}

function loadCurrentQuestionImage(){
    clearCanvas();
    let imgFile = imagesManager.getImageFile(
        quiz.getCurrentRound(),
        quiz.getCurrentTeam()
    );
    if(!imgFile) return;
    imagesManager.fileToImage(imgFile, setQuestionImage);
}


//File upload
uploadFileBtn.onclick = () => {
    fileInp.click();
}

quiz.attachFileInput(fileInp);
quiz.onQuizLoaded.push(()=>{
    uploadFileBtn.style.display = "none";
    startQuizBtn.style.display = "block";
    createQuizBtn.style.display = "none";
    uploadImagesBtn.style.display = "block";

    rankingsInit();
    timer.setStartTime(quiz.timerStartTime);
});

startQuizBtn.onclick = () => {
    startupScreen.style.display = "none";
    timer.start();
    quiz.showQuestion();
    
    loadCurrentQuestionImage();
}

greet();


//Initialize quiz
quiz.setPageTitleElement("header-title");
quiz.setTopBarElements("round-number", "team-name");
quiz.setQuestionElement("question-text");
quiz.setOptionElements("option1", "option2", "option3", "option4", "skip");


//Options hover
quiz.initializeOptionsHover();


//submit answer
continueBtn.onclick = ()=>{
    
    if(quiz.canContinue() && !quiz.quizEnded){
        quiz.revealAnswer();
        timer.stop();
        disableTouch();

        let answerRes = quiz.answerResult();
        if(answerRes==1){
            rankings.incrementScore(quiz.getCurrentTeam(), quiz.correctIncrement);
        } else if (answerRes==-1){
            rankings.incrementScore(quiz.getCurrentTeam(), -quiz.wrongDecrement);
        } else {
            rankings.incrementScore(quiz.getCurrentRound(), -quiz.skipDecrement);
        }

        let pcbtnClick = continueBtn.onclick;

        continueBtn.onclick = ()=>{
            continueBtn.onclick = pcbtnClick;
            
            if(!quiz.nextQuestion()){
                console.log("last question");
            } else{
                quiz.removeReveal();
                timer.start();
                enableTouch();
                
                loadCurrentQuestionImage();
            }
        };
    
    }

};


//Rankings

function rankingsInit(){

    rankings.setTeams(quiz.teams);

}

//Fullscreen

function fullScreen(){

    if(document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
    else if(document.documentElement.webkitRequestFullscreen)
        document.documentElement.webkitRequestFullscreen();
    else if(document.documentElement.msRequestFullscreen)
        document.documentElement.msRequestFullscreen();

    fullScrBtn.style.display = "none";
    exitfullScrBtn.style.display = "inline";

}
function restoreScreen(){

    if(document.exitFullscreen)
        document.exitFullscreen();
    else if(document.webkitExitFullscreen)
        document.webkitExitFullscreen();
    else if(document.msExitFullscreen)
        document.msExitFullscreen();
    
    exitfullScrBtn.style.display = "none";
    fullScrBtn.style.display = "inline";

}

fullScrBtn.onclick = fullScreen;
exitfullScrBtn.onclick = restoreScreen;

//Getting started button
createQuizBtn.onclick = () => {
    location.href = createQuizBtn.getAttribute("href");
}