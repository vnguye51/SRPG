function Character(ref,name,hp,ap,cp,acc,dodge,mspd,exp,ally,active,pos) {
    this.ref = ref;
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.cp = cp;
    this.acc = acc;
    this.dodge = dodge;
    this.mspd = mspd;
    this.moves = null;
    this.exp = exp;
    this.ally = ally;
    
    this.active = active;
    this.pos = pos;


    this.attack = function(target){
        var hitroll = Math.floor(Math.random()*100) 
        var enemyroll = Math.floor(Math.random()*100)

        if (this.acc > hitroll){
            target.hp = Math.max(target.hp-this.ap,0)
            if (target.hp <= 0) {
                $(target.ref).empty()
                phase = 'ChooseOpponent'
                enemies.splice(enemies.indexOf(target),1)
                if (enemies.length == 0){
                }
                else{
            }
            }
        }

        else {
        }

        if ((target.acc > enemyroll) && (target.hp > 0)) {
            this.hp = Math.max(this.hp-target.cp,0)
            if (this.hp <= 0) {

                $(this.ref).empty()
                phase = 'GameOver'
            }
        }
        else if (target.hp > 0){
        }

        statupdate(target)
        statupdate(this)

    };

    this.moveto = function(targetrow,targetcol){ 
        this.ref.detach()
        this.pos = [targetrow,targetcol]
        $('#'+targetrow+'\\,'+targetcol).append(this.ref)
        this.ref.data(this)
    };
}

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
var Lucina = new Character($('#lucina'),'Lucina',100,20,10,20,20,4,0,false, false, [0,0])
var Ryoma = new Character($('#ryoma'),'Ryoma',100,20,10,20,20,4,0,false, false, [1,0])
var Hector = new Character($('#hector'),'Hector',100,10,20,20,20,4,0,false, false, [2,0])
var Leona = new Character($('#leona'),'Leona',100,20,10,100,20,4,0,true, true, [3,0])

var enemies = [Lucina, Ryoma, Hector]
var allies = [Leona]

var tileweights =  [[[-1,-1],99],[[-1,0],99],[[-1,1],99],[[-1,2],99],[[-1,3],99],[[-1,4],99],[[-1,5],99],[[-1,6],99],[[-1,7],99],[[-1,8],99],[[-1,9],99],[[-1,10],99],
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

var basemap = {}
tileweights.forEach(function (r){ //create map of the amount of steps to move into a tile
    r.forEach(function (c){
        basemap[r[0]] = r[1] 
    })
})


function findPath(start,mspd){ //Need to optimize to include shortest path. Works okay for now.
    function Path(stepsLeft,pathTaken){
        this.stepsLeft = stepsLeft;
        this.pathTaken = pathTaken;
    }
    var travelmap = {}
    travelmap[start] = new Path(mspd,[])
    var openset = []
    openset.push(start)
    var closedset = []
    while (openset.length > 0){
        
        curr = openset[0]
        openset.splice(0,1)
        closedset.push(curr)
        

        var neighbors = [[curr[0] + 1,curr[1]],[curr[0],curr[1]+1],[curr[0]-1,curr[1]],[curr[0],curr[1]-1] ]
        neighbors.forEach(function(neighbor){
            tentativeStepsLeft = travelmap[curr].stepsLeft - basemap[neighbor]
            if (neighbor in travelmap){
                if (tentativeStepsLeft > travelmap[neighbor].stepsLeft){
                    travelmap[neighbor].stepsLeft = tentativeStepsLeft
                }
            }
            else if (travelmap[curr].stepsLeft - basemap[neighbor] < 0){
            }
            else if (travelmap[curr].stepsLeft - basemap[neighbor] == 0){
                travelmap[neighbor] = new Path(travelmap[curr].stepsLeft - basemap[neighbor], travelmap[curr].pathTaken.concat(neighbor))
                closedset.push(neighbor)
            }
            else{
                openset.push(neighbor)
                travelmap[neighbor] = new Path(travelmap[curr].stepsLeft - basemap[neighbor], travelmap[curr].pathTaken.concat(neighbor))
            }
        })
    }

    return travelmap
}

function showMoves(character){
    var possiblemoves = (findPath(character.pos,character.mspd))
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

for (var i = 0; i<enemies.length;i++){
    enemies[i].ref.data(enemies[i])
    enemies[i].moveto(i,0)
}

Leona.ref.data(Leona)
Leona.moveto(5,5)

function statupdate(object){
    if (object.ally == true){


        $('#statbox').empty()
        $('#statbox').append('<br>' + object.name + '<br>')
        $('#statbox').append('<br> HP: ' + object.hp + '<br>')
        $('#statbox').append('<br> ATP: ' + object.ap + '<br>')
        $('#statbox').append('<br> %Hit: ' + object.acc + '<br>')
    }
    else{
        $('#messagebox').empty()
        $('#messagebox').append('<br>' + object.name + '<br>')
        $('#messagebox').append('<br> HP: ' + object.hp + '<br>')
        $('#messagebox').append('<br> ATP: ' + object.ap + '<br>')
        $('#messagebox').append('<br> %Hit: ' + object.acc + '<br>')
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


var showingMoves = false



$(".character").on('click',function(){
    if (phase === 'ChooseCharacter'){
        player = $(this).data()
        showMoves(player)
        showingMoves = true
        if (player.ally == true){
            phase = 'Move'
            statupdate(player)
            
        }
    }
            
    else if (phase === 'ChooseOpponent'){
        phase = 'TargetSelect'
        target = $(this).data()
        target.active = true
        target.moveto(3,5)
        statupdate(target)
    }

    // else if (phase === 'PlayerSelect'){
    //     player = $(this).data()
    //     phase = 'TargetSelect'
    //     $('#messagebox').text("Click to attack!")
    // }


    else if (phase === 'TargetSelect'){
        //phase = 'PlayerSelect'
        target = $(this).data()
        if ((target.ally == false) && (target.active == true)){
            player.attack(target)
            
        }
        

    }

        
    
});

$(".col").on('click',function(){ 
    //Stop showing movement if player clicks off a character
    if ((showingMoves == true) && (!this.firstChild)){ 
        removeMoves(player)
        showingMoves = false
    }
    //In order to move it must be during the 'move', the the target block must be empty, and the player must be active(has not moved or attacked)
    if ((phase == 'Move') && ((!this.firstChild)) && (player.active)){
        var movetarget = parseID($(this).attr('id'), ',')
        if (player.moves[movetarget] != undefined){
            player.moveto(movetarget[0],movetarget[1])
            player.active = false
            $(player.ref).find('img').attr('src','assets/images/Sprites/LeonaGrayed.png')
        }
        else{
            phase = 'ChooseCharacter'
        }
    }
})

