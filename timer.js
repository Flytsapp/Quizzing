class Timer{

    startTime = 1;
    isRunning = false;
    minutesElement = null;
    secondsElement = null;
    minutes = 0;
    seconds = 1;
    interval = null;
    onTimeUp = [];
    paused = false;

    constructor(startTime, minutesId, secondsId){
        this.startTime = startTime >=1 ? startTime : 60;
        this.minutesElement = document.getElementById(minutesId);
        this.secondsElement = document.getElementById(secondsId);
    }
    
    setStartTime(startTime){
        this.startTime = startTime >=1 ? startTime : 60;
    }
    
    start(){

        if(this.isRunning) this.stop();
        
        this.paused = false;

        this.minutes = parseInt(this.startTime/60);
        this.seconds = this.startTime%60;

        this.interval = setInterval(()=>{
            if(!this.paused){
                this.seconds--;
                if (this.seconds<0){
                    this.minutes--;
                    if(this.minutes<0){
                        this.timeup();
                        this.minutes = 0;
                        this.seconds = 0;
                    } else this.seconds = 59;
                }
    
                this.minutesElement.innerText = `${this.minutes}`;
                this.secondsElement.innerText = `${this.seconds}`;
            }

        }, 1000);
        this.isRunning = true;
    }
    
    timeup(){

        this.stop();
        
        for(var callback of this.onTimeUp){
            callback();
        }

    }
    
    stop(){
        if(this.interval) clearInterval(this.interval);

        this.isRunning = false;
    }

    pause(){
        this.paused = true;
    }
    resume(){
        this.paused = false;
    }
    toggle(){
        if(this.paused)
            this.resume()
        else
            this.pause();
    }

}