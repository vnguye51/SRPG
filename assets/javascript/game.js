function Character(ref,name,hp,ap,cp,acc,dodge,mspd,exp,ally,active,pos,index) {
    this.ref = ref;
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.cp = cp;
    this.acc = acc;
    this.dodge = dodge;
    this.mspd = mspd;
    this.moves = null;
    this.validattacks = null;
    this.exp = exp;
    this.ally = ally;
    
    this.active = active;
    this.pos = pos;

    this.index = index;


    this.attack = function(target){

        console.log(this.name + ' attacks '+  target.name)
        var hitroll = Math.floor(Math.random()*100) 
        var enemyroll = Math.floor(Math.random()*100)

        if (this.acc > hitroll){
            hitSound.play()
            target.hp = Math.max(target.hp-this.ap,0)
            if (target.hp <= 0) {
                
                removeChar(target)
                
                
                if (target.ally == false){ //Ally  killed enemy

                    if (enemies.length == 0){
                        phase = 'Victory'
                        $('#victory').removeAttr('hidden')
                        console.log('You win!')
                    }
                }

                else{
                    allies.splice(allies.indexOf(target.ref),1)
                    if (enemies.length == 0){
                        phase = 'GameOver'
                        $('#defeat').removeAttr('hidden')
                        console.log('You lose!')
                    }
                }
               
                
            }
        }

        else {
            missSound.play()
        }

        if ((target.acc > enemyroll) && (target.hp > 0)) {
            this.hp = Math.max(this.hp-target.cp,0)
            if (this.hp <= 0) {
                removeChar(this)
                if (this.ally == false){ //Ally  killed enemy
                    if (enemies.length == 0){
                        phase = 'Victory'
                        console.log('You win!')
                    }
                }

                else{
                    if (enemies.length == 0){
                        phase = 'GameOver'
                        console.log('You lose!')
                    }
                }
            }
        }
    

        statupdate(target)
        statupdate(this)

        if (allies.every(function(char){return (!char.data().active)})){
                phase = 'Enemy'
                enemyTurn()
        }

    };

    this.moveto = function(targetrow,targetcol){ 
        this.ref.detach()
        this.pos = [targetrow,targetcol]
        $('#'+targetrow+'\\,'+targetcol).append(this.ref)
        this.ref.data(this)
    };
}

var hitSound = document.createElement('audio')
hitSound.src = 'assets/SFX/Hit.wav'
hitSound.volume = 0.3
var missSound = document.createElement('audio')
missSound.src = 'assets/SFX/Miss.wav'
missSound.volume = 0.5

var gamegrid = [] // I might use this
//Create gamegrid
for (var i = 0; i<10;i++){
    var row = []
    var rowref = $('<div>')
    rowref.addClass('row')
    for (var j = 0; j<10;j++){
        row.push(j)
        var colref = $('<div>')
        colref.addClass('col')
        rowref.append(colref)
        colref.attr('id',i+','+j)
    }
    gamegrid.push(row)
    $('#container').append(rowref)
}


var player = null
var target = null
var phase = 'ChooseCharacter'


//Can probably move this section directly into the one below later
var Lucina = new Character($('#lucina'),'Lucina',100,20,10,100,20,3,0,false, false, [0,2])
var Ryoma = new Character($('#ryoma'),'Ryoma',100,20,10,20,100,3,0,false, false, [1,1])
var Hector = new Character($('#hector'),'Hector',100,20,20,100,20,3,0,false, false, [2,0])
var Chamomile = new Character($('#chamomile'),'Chamomile',100,100,10,100,20,5,0,true, true, [8,8])
var Earl = new Character($('#earl'),'Earl',100,100,10,0,100,5,0,true, true, [9,7])
var Ceylon = new Character($('#ceylon'),'Ceylon',100,100,10,100,20,5,0,true, true, [7,9])


var enemies = [Lucina, Ryoma, Hector]
var allies = [Chamomile,Earl,Ceylon]

//Initialize position of allies and store their object reference in the tile
enemies.forEach(function(char){
    char.ref.data(char)
    char.moveto(char.pos[0],char.pos[1])
    
})

//Initialize position of allies
allies.forEach(function(char){
    char.ref.data(char)
    char.moveto(char.pos[0],char.pos[1])
    
})

//Replace the allies variable with the jquery references after initialization
allies = [$('#chamomile'),$('#earl'),$('#ceylon')]
enemies = [$('#lucina'),$('#ryoma'),$('#hector')]

var originalTileWeights =  [[[-1,-1],99],[[-1,0],99],[[-1,1],99],[[-1,2],99],[[-1,3],99],[[-1,4],99],[[-1,5],99],[[-1,6],99],[[-1,7],99],[[-1,8],99],[[-1,9],99],[[-1,10],99],
                    [[0,-1],99],[[0,0],1],[[0,1],1],[[0,2],1],[[0,3],1],[[0,4],1],[[0,5],1],[[0,6],1],[[0,7],1],[[0,8],1],[[0,9],1],[[0,10],99],
                    [[1,-1],99],[[1,0],1],[[1,1],1],[[1,2],1],[[1,3],1],[[1,4],1],[[1,5],1],[[1,6],1],[[1,7],1],[[1,8],1],[[1,9],1],[[1,10],99],
                    [[2,-1],99],[[2,0],1],[[2,1],1],[[2,2],1],[[2,3],1],[[2,4],1],[[2,5],1],[[2,6],1],[[2,7],1],[[2,8],1],[[2,9],1],[[2,10],99],
                    [[3,-1],99],[[3,0],1],[[3,1],1],[[3,2],1],[[3,3],1],[[3,4],1],[[3,5],1],[[3,6],1],[[3,7],1],[[3,8],1],[[3,9],1],[[3,10],99],
                    [[4,-1],99],[[4,0],1],[[4,1],1],[[4,2],1],[[4,3],1],[[4,4],1],[[4,5],1],[[4,6],1],[[4,7],1],[[4,8],1],[[4,9],1],[[4,10],99],
                    [[5,-1],99],[[5,0],1],[[5,1],1],[[5,2],1],[[5,3],1],[[5,4],1],[[5,5],1],[[5,6],1],[[5,7],1],[[5,8],1],[[5,9],1],[[5,10],99],
                    [[6,-1],99],[[6,0],1],[[6,1],1],[[6,2],1],[[6,3],1],[[6,4],1],[[6,5],1],[[6,6],1],[[6,7],1],[[6,8],1],[[6,9],1],[[6,10],99],
                    [[7,-1],99],[[7,0],1],[[7,1],1],[[7,2],1],[[7,3],1],[[7,4],1],[[7,5],1],[[7,6],1],[[7,7],1],[[7,8],1],[[7,9],1],[[7,10],99],
                    [[8,-1],99],[[8,0],1],[[8,1],1],[[8,2],1],[[8,3],1],[[8,4],1],[[8,5],1],[[8,6],1],[[8,7],1],[[8,8],1],[[8,9],1],[[8,10],99],
                    [[9,-1],99],[[9,0],1],[[9,1],1],[[9,2],1],[[9,3],1],[[9,4],1],[[9,5],1],[[9,6],1],[[9,7],1],[[9,8],1],[[9,9],1],[[9,10],99],
                    [[10,-1],99],[[10,0],99],[[10,1],99],[[10,2],99],[[10,3],99],[[10,4],99],[[10,5],99],[[10,6],99],[[10,7],99],[[10,8],99],[[10,9],99],[[10,10],99],]

var allymovemap = {} //Store the tileweights in a map
var enemymovemap = {}

//Use in between each turn. 
function updateAllyTileWeights(){
    //Recreate original weightmap
    originalTileWeights.forEach(function (r){ 
        r.forEach(function (c){
            allymovemap[r[0]] = r[1] 
        })
    })
    
    var tileWeights = originalTileWeights.slice()  //Make a copy of the array
    enemies.forEach(function(char){
        allymovemap[char.data().pos] = 99    
        
    
    })   
}

function removeChar(char){
    index = null
    $(char.ref).parent().empty()
    char.pos = [-50,-50]
    if (char.ally == true){

        for (var i = 0;i < allies.length;i++){
            if (allies[i].data().name == char.name){
                index = i
                
            }
        
        }
        allies.splice(index,1)
    }

        
    else{
        for (var i = 0;i < enemies.length;i++){
            if (enemies[i].data().name == char.name){
                index = i
                
            }
        
        }
        enemies.splice(index,1)
    }
    
}

function updateEnemyTileWeights(){
    originalTileWeights.forEach(function (r){ 
        r.forEach(function (c){
            enemymovemap[r[0]] = r[1] 
        })
    })
   
    var tileWeights = originalTileWeights.slice()  //Make a copy of the array
    allies.forEach(function(char){
        enemymovemap[char.data().pos] = 99    
    })
}

updateAllyTileWeights()
updateEnemyTileWeights()

function findPath(start,mspd,map){ //Need to optimize to include shortest path. Works okay for now.
    
    updateAllyTileWeights()
    function Path(stepsLeft,pathTaken){
        this.stepsLeft = stepsLeft;
        this.pathTaken = pathTaken;
    }
    var travelmap = {}
    travelmap[start] = new Path(mspd,[])
    var openset = []
    openset.push(start)
    var closedset = []
    var n = 0
    
    while ((openset.length) > 0 && (n < 100)){
        n += 1
        var curr = openset[0]
        openset.splice(0,1)
        closedset.push(curr)
        
        
        var neighbors = [[curr[0] + 1,curr[1]],[curr[0],curr[1]+1],[curr[0]-1,curr[1]],[curr[0],curr[1]-1] ]
        
        neighbors.forEach(function(neighbor){
            tentativeStepsLeft = travelmap[curr].stepsLeft - map[neighbor]
            if (neighbor in travelmap){
                if (tentativeStepsLeft > travelmap[neighbor].stepsLeft){
                    travelmap[neighbor].stepsLeft = tentativeStepsLeft
                }
            }
            else if (travelmap[curr].stepsLeft - map[neighbor] < 0){
            }
            else if (travelmap[curr].stepsLeft - map[neighbor] == 0){
                travelmap[neighbor] = new Path(travelmap[curr].stepsLeft - map[neighbor], travelmap[curr].pathTaken.concat(neighbor))
                closedset.push(neighbor)
            }
            else{
                openset.push(neighbor)
                travelmap[neighbor] = new Path(travelmap[curr].stepsLeft - map[neighbor], travelmap[curr].pathTaken.concat(neighbor))
            }
        })
    }

    return travelmap
}


function showMoves(character){
    if (character.ally){
        var possiblemoves = (findPath(character.pos,character.mspd,allymovemap))
    }
    else{
        var possiblemoves = (findPath(character.pos,character.mspd,enemymovemap))
    }
    
    for (var key in possiblemoves){
        var correctedKey = key.slice(0,key.indexOf(',')) + '\\' + key.slice(key.indexOf(','))
        if (character.ally == false){
            $('#'+correctedKey).addClass('enemyMovement')
        }
        else{
            $('#'+correctedKey).addClass('movement')
        }
    character.moves = possiblemoves
    }
}

function showAttacks(character){
    var possibleattacks = [[+character.pos[0] + 1, +character.pos[1]],[+character.pos[0] - 1, +character.pos[1]],
                        [+character.pos[0] , +character.pos[1]+1],[+character.pos[0], +character.pos[1]-1]]
    
        character.validattacks = possibleattacks
        possibleattacks.forEach(function(pos){
        correctedPos = pos.join().slice(0,pos.join().indexOf(',')) + '\\' + pos.join().slice(pos.join().indexOf(','))
        $('#'+correctedPos).addClass('attacks')
    })
    
}

function removeAttacks(character){
    var possibleattacks = [[+character.pos[0] + 1, +character.pos[1]],[+character.pos[0] - 1, +character.pos[1]],
    
    [+character.pos[0] , +character.pos[1]+1],[+character.pos[0], +character.pos[1]-1]]

    possibleattacks.forEach(function(pos){

    correctedPos = pos.join().slice(0,pos.join().indexOf(',')) + '\\' + pos.join().slice(pos.join().indexOf(','))
    $('#'+correctedPos).removeClass('attacks')
    })
}

//Should always be called after showMoves and during/before movement otherwise the positions will not be correct and 
function removeMoves(character){
    for (var key in character.moves){
        var correctedKey = key.slice(0,key.indexOf(',')) + '\\' + key.slice(key.indexOf(','))
        if (character.ally == false){
            $('#'+correctedKey).removeClass('enemyMovement')
        }
        else{
            $('#'+correctedKey).removeClass('movement')
        }
    }
}



function statupdate(object){
    if (object.ally == true){


        $('#statbox').empty()
        $('#statbox').append('<br>' + object.name + '<br>')
        $('#statbox').append('<br> HP: ' + object.hp + '<br>')
        $('#statbox').append('<br> ATT: ' + object.ap + '<br>')
        $('#statbox').append('<br> HIT: ' + object.acc + '<br>')
        $('#statbox').append('<br> EXP: ' + object.exp+ '<br>')
    }
    else{
        $('#messagebox').empty()
        $('#messagebox').append('<br>' + object.name + '<br>')
        $('#messagebox').append('<br> HP: ' + object.hp + '<br>')
        $('#messagebox').append('<br> ATT: ' + object.ap + '<br>')
        $('#messagebox').append('<br> Hit: ' + object.acc + '<br>')
        $('#statbox').append('<br> EXP: ' + object.exp+ '<br>')

    }
}

function parseID(id,delimiter){ //Parse through our custom ID tag to determine location of target box
    var row = ''
    var col = ''
    var toggle = 0
    for (var i = 0;i<id.length;i++){
        if (id[i] == delimiter){
            toggle = 1
        }
        else if(toggle == 0){
            row += id[i]
        }
        else{
            col += id[i]
        }
    }
    return [row,col]
    
}

function indexOfa2Ina1(a1,a2){
    return (a1.findIndex(function(N){
        return N.toString() == a2.toString()
    }))
}

// var showingMoves = false

function shortestPath(start,target){
    function reconstructPath(cameFrom,current,path){
        if (current in cameFrom){
            path.splice(0,0,cameFrom[current])
            return reconstructPath(cameFrom,cameFrom[current],path)
        }
        return path

    }

    function estimate(start,target){
        return (target[1]-start[1]) + (target[0]-start[0])
    }

    function findMinKey(keys){
        var min = 999
        var minKey = null

        for (var i = 0; i<keys.length; i++){
            if (estimatedCost[keys[i]] < min){
                min = estimatedCost[keys[i]]
                minKey = keys[i]
        }
            
        }
        return minKey
    }

    

    var closedSet = []
    var openSet = [start]

    var cameFrom = {} //Best Path to that tile
    var startToPos = {} //Amount of steps taken to reach tile
    startToPos[start] = 0
    var estimatedCost = {}
    estimatedCost[start] = estimate(start,target)

    var n = 0
    while ((openSet.length > 0) ){
        n += 1
        // set current to the key in openSet that corresponds to the lowest value in estimatedCost

        var current = findMinKey(openSet)

        if (indexOfa2Ina1([current],[target]) != -1){
            return reconstructPath(cameFrom,current,[current],startToPos)
            // return reconstructPath(cameFrom,current,[])
        }

        openSet.splice(openSet.indexOf(current),1)
        closedSet.push(current)

        var neighbors = [[current[0] + 1,current[1]],[current[0],current[1]+1],[current[0]-1,current[1]],[current[0],current[1]-1] ]

        
        neighbors.forEach(function(neighbor){
            if (indexOfa2Ina1(closedSet,neighbor) != -1){
                return
            }

            var score = startToPos[current] + enemymovemap[neighbor]
            if (indexOfa2Ina1(openSet,neighbor) == -1){
                openSet.push(neighbor)
            }

            else if (score >= startToPos[neighbor]){
                return
            }
            cameFrom[neighbor] = current
            startToPos[neighbor] = score
            estimatedCost[neighbor] = startToPos[neighbor] + estimate(neighbor,target)
            
        })
    }
    



}



function bestMove(enemy){
    var minDistance = 999
    var bestTile = enemy.pos
    var bestTarget = null
    for(var i = 0;i<allies.length;i++){
        var targetPos = allies[i].data().pos
        var path = shortestPath(enemy.pos,targetPos)
        var stepsTaken = 0
        var lastTile = enemy.pos
        for (var j = 0; j < path.length; j++){
            stepsTaken += enemymovemap[path[j]]
            if (stepsTaken <= enemy.mspd){
                if(enemies.every(function(enemy){return indexOfa2Ina1([enemy.data().pos],[path[j]]) == -1})){
                    lastTile = path[j]
                }
                


            }
        }
        if (stepsTaken < minDistance){
            minDistance = stepsTaken
            bestTile = lastTile
            if ((Math.abs(targetPos[0] - enemy.pos[0])+Math.abs(targetPos[1] - enemy.pos[1])) <= 1){
                bestTarget = allies[i]
            }
        }
    }
    enemy.moveto(bestTile[0],bestTile[1])
    if (bestTarget != null){
        enemy.attack(bestTarget.data())
    }
}




function enemyTurn(){
    allies.forEach(function(char){
        char.data().active = true
        $(char).find('img').attr('src','assets/images/Sprites/' + char.data().name + '.png')
    })

    updateEnemyTileWeights()
    enemies.forEach( function(enemy){
        bestMove(enemy.data())
    })
    updateAllyTileWeights()
    allyTurn()
}

function allyTurn(){
    phase = 'ChooseCharacter'
  
}

$(".character").on('click',function(){
    if (phase === 'ChooseCharacter' && ($(this).data().active)){
        player = $(this).data()
        showMoves(player)
        if (player.ally == true){
            phase = 'Move'
            statupdate(player)
            
        }
    }
            
    else if (phase === 'Attack'){
        removeAttacks(player)
        phase = 'ChooseCharacter'
        target = $(this).data()
        if (!(target.ally)){
            statupdate(target)
            if (indexOfa2Ina1(player.validattacks,target.pos) != -1){  
            player.attack(target)
            }
        }
    }


    else if (phase === 'TargetSelect'){
        target = $(this).data()
        if ((target.ally == false) && (target.active == true)){
            player.attack(target)

        }
        

    }

        
    
});

$(".col").on('click',function(){ 
    //Stop showing movement/attacks if player clicks on empty space
    if ( (!this.firstChild)){ 
        removeMoves(player)
        if (phase =='Attack'){
            removeAttacks(player)
            phase = 'ChooseCharacter'
            if (allies.every(function(char){return (!char.data().active)})){
                phase = 'Enemy'
                enemyTurn()
            }
        }
    }

    //In order to move it must be during the 'move', the the target block must be empty, and the player must be active(has not moved or attacked)
    if ((phase == 'Move') && ((!this.firstChild)) && (player.active)){
        var movetarget = parseID($(this).attr('id'), ',')
        if (player.moves[movetarget] != undefined){
            player.moveto(+movetarget[0],+movetarget[1])
            player.active = false
            $(player.ref).find('img').attr('src','assets/images/Sprites/' + player.name + 'Grayed.png')
            showAttacks(player)
            phase = 'Attack'
        }
        else{
            phase = 'ChooseCharacter'
        }
    }

})
