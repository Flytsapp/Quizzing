class Quiz{
    
    data = [];
    EOL = "\n";
    onQuizLoaded = [];
    totalRounds = 0;
    totalTeams = 0;

    questionElement = null;
    optionElements = [null, null, null, null];
    skipBtn = null;

    currentRound = 0;
    currentQuestion = 0;

    teams = [];
    pageTitle = 'Quiz - Flytsapp';
    pageTitleElement = null;
    roundNumberElement = null;
    teamNameElement = null;

    timerStartTime = 0;


    correctIncrement = 0;
    wrongDecrement = 0;
    skipDecrement = 0;

    correct = 0;
    selected = -1;

    quizEnded = false;


    setQuestionElement(id){
        this.questionElement = document.getElementById(id);
    }
    setOptionElements(id1, id2, id3, id4, skipId){
        this.optionElements[0] = document.getElementById(id1);
        this.optionElements[1] = document.getElementById(id2);
        this.optionElements[2] = document.getElementById(id3);
        this.optionElements[3] = document.getElementById(id4);
        this.skipBtn = document.getElementById(skipId);
    }
    setPageTitleElement(id){
        this.pageTitleElement = document.getElementById(id);
        if(this.pageTitleElement)
            this.pageTitleElement.innerText = this.pageTitle;
    }
    setTopBarElements(rnId, tnId){
        this.roundNumberElement = document.getElementById(rnId);
        this.teamNameElement = document.getElementById(tnId);
        if(this.teams.length!=0){
            this.roundNumberElement.innerText = `${this.currentRound+1}`;
            this.teamNameElement.innerText = `${this.teams[this.currentQuestion]}`;
        }
    }

    initializeOptionsHover(){
        for(var ope of this.optionElements){
            ope.parentElement.onclick = e => {
                if(this.selected!=-1 && this.selected!=4){
                    this.optionElements[this.selected]
                        .parentElement.classList.remove("selected");
                } else if  (this.selected == 4){
                    this.skipBtn.classList.remove("selected");
                }
                e.currentTarget.classList.add("selected");
                this.selected = parseInt(e.currentTarget.getAttribute("index"));
            }
        }
        this.skipBtn.onclick = () => {
            this.skipSelected();
            this.skipBtn.classList.add("selected");
        }
    }

    skipSelected(){
        if(this.selected!=-1 && this.selected!=4){
            this.optionElements[this.selected]
                .parentElement.classList.remove("selected");
        }
        this.selected = 4;
    }

    removeSelection(){
        if(this.selected!=-1 && this.selected!=4){
            this.optionElements[this.selected]
                .parentElement.classList.remove("selected");
        } else if  (this.selected == 4){
            this.skipBtn.classList.remove("selected");
        }
        this.selected = -1;
    }

    removeReveal(){
        for(var opt of this.optionElements){
            opt.parentElement.classList.remove("correct");
            opt.parentElement.classList.remove("wrong");
        }
    }


    canContinue(){
        return this.selected!=-1;
    }

    answerResult(){
        if (this.selected==this.correct) return 1;
        else if (this.selected==4) return 0;
        else return -1;
    }

    getCurrentTeam(){
        return this.currentQuestion;
    }

    getCurrentRound(){
        return this.currentRound;
    }



    loadQuizFile(content=""){
        content = content.replaceAll("\r\n", "\n");
        content = content.trimEnd();

        this.data = [];
        this.quizEnded = false;

        let rounds_split = content.split(`${this.EOL}~${this.EOL}`);
        
        let header = rounds_split[0].split("\n");
        
        rounds_split = rounds_split.slice(1);
        
        this.totalRounds = parseInt(header[0]);
        this.totalTeams = parseInt(header[1]);
        this.pageTitle = header[2];
        this.teams = header[3].split(",");
        
        let pointsIncDec = header[4].split(" ");
        this.correctIncrement = parseInt(pointsIncDec[0]);
        this.wrongDecrement = parseInt(pointsIncDec[1]);
        this.skipDecrement = parseInt(pointsIncDec[2]);

        this.timerStartTime = parseInt(header[5]);


        if(this.pageTitleElement)
            this.pageTitleElement.innerText = this.pageTitle;

        if(this.teams.length!=0){
            this.roundNumberElement.innerText = `${this.currentRound+1}`;
            this.teamNameElement.innerText = `${this.teams[this.currentQuestion]}`;
        }

        
        //question parsing
    
        for (var round of rounds_split){
    
            this.data.push([]);
    
            let questions = round.split(`${this.EOL}${this.EOL}`);
            for(var question of questions){
                
                let question_split = question.split(`${this.EOL}`);
                let questitle = question_split[0];
                let options = question_split.slice(1);
                let correct = 0;
    
                for (var i in options){
                    if(options[i].startsWith(">")){
                        correct = parseInt(i);
                        options[i] = options[i].slice(1);
                        break;
                    }
                }
    
                let question_obj = {
                    title: questitle,
                    options: options,
                    correct: correct
                }
    
                this.data[this.data.length-1].push(question_obj);
    
            }
    
        }

        for (var callback of this.onQuizLoaded){
            callback();
        }
        
    }

    attachFileInput(fileInput){
        fileInput.onchange = ()=>{

            let file = fileInput.files[0];
            let reader = new FileReader();
        
            reader.onload = () => {
                this.loadQuizFile(reader.result);
            }

            reader.readAsText(file);
        
        }
    }

    showQuestion(){
        let question =
            this.data[this.currentRound][this.currentQuestion];
        this.questionElement.innerText = question.title;

        for(var i in question.options){
            this.optionElements[i].innerText = question.options[i];
        }

        this.correct = question.correct;

        this.roundNumberElement.innerText = `${this.currentRound+1}`;
        this.teamNameElement.innerText = `${this.teams[this.currentQuestion]}`;

        MathJax.typeset();
    }

    nextQuestion(){
        if(!this.quizEnded){
            this.currentQuestion++;
            if(this.currentQuestion>=this.totalTeams){
                this.currentQuestion = 0;
                this.currentRound++;
                if(this.currentRound>=this.totalRounds){
                    this.currentRound = 0;
                    this.quizEnded = true;
                    return false;
                }
            }
            this.showQuestion();
            this.removeSelection();
    
            return true;
        }
        return false;
    }

    revealAnswer(){ 
        if(this.selected!=-1 && this.selected!=4)
            this.optionElements[this.selected]
                .parentElement.classList.add("wrong");
        this.optionElements[this.correct]
            .parentElement.classList.remove("wrong");
        this.optionElements[this.correct]
            .parentElement.classList.add("correct");
    }

}
