class ImagesManager{

    images = [];
    inpElement = null;

    constructor(){}

    attachInput(inpId){
        this.inpElement = document.getElementById(inpId);
        this.inpElement.onchange = e =>{
            this.processFiles(e.target.files)
        };
    }

    processFiles(filesObject){

        for (var file of filesObject){
            let filename = file.name.split(".")[0];
            let hyphenSplit = filename.split("-");
            if(hyphenSplit.length==2){
                try{
                    let round = parseInt(hyphenSplit[0])-1;
                    let team = parseInt(hyphenSplit[1])-1;
                    this.images.push({round: round, team: team, file: file});
                } catch {}
            }
        }

    }

    getImageFile(round, team){
        for(var image of this.images){
            if(image.round == round && image.team == team) return image.file;
        }
        return null;
    }

    fileToImage(file, task){
        let reader = new FileReader();
        reader.onload = e => {
            let url = e.target.result;
            let img = new Image();
            img.src = url;
            img.onload = () => {
                task(img);
            }
        }
        reader.readAsDataURL(file);
    }


}