function Character(ref,name,hp,ap,cp,ally,pos) {
    this.ref = ref;
    this.name = name;
    this.hp = hp;
    this.ap = ap;
    this.cp = cp;
    this.ally = ally;
    this.pos = pos;

    this.attack = function(target){
        target.hp -= this.ap;
        this.hp -= target.cp;
        console.log(this.name + this.hp);
        console.log(target.name + target.hp);
    };

    this.moveto = function(targetrow,targetcol){ //target should be in format '3.2' in coordinate system
        this.ref.detach()
        $('#'+targetrow+'\\.'+targetcol).append(this.ref)

    };
}

var gamegrid = [] // I might use this
for (var i = 0; i<10;i++){
    var row = []
    var rowref = $('<div>')
    rowref.addClass('row')
    for (var j = 0; j<10;j++){
        row.push(j)
        var colref = $('<div>')
        colref.addClass('col')
        rowref.append(colref)
        colref.attr('id',i+'.'+j)
    }
    gamegrid.push(row)
    $('#container').append(rowref)
}


var player = null
var target = null
var phase = 'PlayerSelect'


//Can probably move this section directly into the one below later
var Lucina = new Character($('#lucina'),'Lucina',100,20,20,true, [0,0])
var Ryoma = new Character($('#ryoma'),'Ryoma',100,20,20,true, [1,0])
var Hector = new Character($('#hector'),'Hector',100,20,20,true, [2,0])
var Lyn = new Character($('#lyn'),'Lyn',100,20,20,true, [3,0])

var characters = [Lucina, Ryoma, Hector, Lyn]

for (var i = 0; i<characters.length;i++){
    characters[i].ref.data(characters[i])
    characters[i].ref.find('.label').text('HP: ' + characters[i].hp)
    characters[i].moveto(i,0)
}



$(".character").on('click',function(){
    if (phase === 'PlayerSelect'){
        player = $(this).data()
        phase = 'TargetSelect'
        console.log(player.name + 'selected')
    }


    else if (phase === 'TargetSelect'){
        phase = 'PlayerSelect'
        target = $(this).data()
        player.attack(target)
        $(player.ref).find('.label').text('HP: ' + player.hp)
        $(target.ref).find('.label').text('HP: ' + target.hp)
        $('#messagebox').text(player.name + ' dealt ' + player.ap + ' damage to ' + target.name +'.')
    }

        
    
});



