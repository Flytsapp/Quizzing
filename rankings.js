class Rankings{

    teams = [];
    scores = [];
    rankIndecies = [];
    parent = null;

    constructor(parentId, teams, scores=null){
        this.setParent(parentId);
        this.setTeams(teams, scores);
    }
    
    setParent(parentId){
        this.parent = document.getElementById(parentId);
    }

    setTeams(teams, scores=null){

        if(scores==null){
            scores = [];
            for(var _ in teams){
                scores.push(0);
            }
        } else if(scores.length != teams.length){
            return;
        }

        this.teams = teams;
        this.scores = scores;
        this.rankTeams();
        this.createTeamElements();

    }

    rankTeams(){

        let scoreDuplicate = [];
        for(var s of this.scores){
            scoreDuplicate.push(s);
        }
        
        this.rankIndecies = [];

        var max = 0, maxi = 0;
        while(maxi!=-1){
            max = -Infinity, maxi = -1;

            for (var i in scoreDuplicate){
                if (scoreDuplicate[i]!=null){
                    if(max < scoreDuplicate[i]){
                        max = scoreDuplicate[i];
                        maxi = i;
                    }
                }
            }

            if(maxi!=-1) {
                this.rankIndecies.push(maxi);
                scoreDuplicate[maxi] = null;
            }

        }

    }

    createTeamElements(){
        this.parent.innerHTML = `<div class="ranking-title">Rankings</div>`;

        for(var i of this.rankIndecies){

            this.parent.innerHTML+=`<div class="ranked-team">
    <div class="ranked-team-name">${this.teams[i]}</div>
    <div class="ranked-team-score">${this.scores[i]}</div>
</div>
`;
        }

    }

    updateTeamElements(){
        this.createTeamElements();
    }

    updateScore(team, score){
        if(this.scores[team]==score) return;

        this.scores[team] = score;
        this.rankTeams();
        this.updateTeamElements();
    }
    incrementScore(team, inc){
        if(inc==0) return;
        this.updateScore(team, this.scores[team]+inc);
    }

}