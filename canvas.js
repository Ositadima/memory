var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

const colours = ["green", "grey", "red", "black"]
function block(x, y, size_x, size_y){
    this.x = x;
    this.y = y;
    this.size_x = size_x;
    this.size_y = size_y;
    this.chosen = false;
    this.clicked = false;
    this.hidden = true;
    this.colour = undefined;
    this.updateColour = function()
    {
        if(this.hidden)
        {
            if(this.clicked)
            {
                this.colour = colours[0];
            }
            else
            {
                this.colour = colours[1];
            }
        }
        else
        {
            if(this.chosen)
            {
                this.colour = colours[2];
            }
            else
            {
                this.colour = colours[3];
            }
        }
    }
    this.draw = function()
    {
        c.beginPath();
        c.fillStyle = this.colour;
        c.fillRect(this.x, this.y, this.size_x, this.size_y)
    }
    this.checkIfClicked = function(mouse_x, mouse_y)
    {
        if(this.x < mouse_x && 
            this.x + this.size_x > mouse_x &&
            this.y < mouse_y+20 && 
            this.y + this.size_y > mouse_y+20)
            {
                this.clicked = !this.clicked;
            }
    }
}

function gridOfBlocks(x, y, size_x, size_y, ncol, nrow, gap)
{
    this.x = x;
    this.y = y;
    this.size_x = size_x;
    this.size_y = size_y;
    this.ncol = ncol;
    this.nrow = nrow;
    this.gap = gap;
    this.blocks = [];
    for(var i = 0; i < this.nrow*this.ncol; i++)
    {
        var blck_x = this.x + (i % ncol)*(size_x+this.gap);
        var blck_y = this.y + (Math.floor(i / ncol)*(size_y+gap));
        blck = new block(blck_x, blck_y, size_x, size_y);
        this.blocks.push(blck);
    }
    this.drawBlocks = function()
    {
        for(var i = 0; i < this.nrow*this.ncol; i++)
        {
            this.blocks[i].updateColour();
            this.blocks[i].draw();
        }
    }
    this.update = function(mx, my)
    {
        for(var i = 0; i < this.nrow*this.ncol; i++)
        {
            this.blocks[i].checkIfClicked(mx, my);
        }
    }
    this.hide = function()
    {
        for(var i = 0; i < this.nrow*this.ncol; i++)
        {
            this.blocks[i].hidden = !this.blocks[i].hidden;
        }
    }
    this.ranomize = function(k){
        var chosen = choose(nArray(this.ncol*this.nrow), k)
        console.log();
        for(var i = 0; i < k; i++)
        {
            this.blocks[chosen[i]].chosen = true;
        }
    }
    this.checkIfCorrect = function(){
        var correct = true;
        for(var i = 0; i < this.ncol*this.ncol; i++){
            if(this.blocks[i].clicked && !this.blocks[i].chosen)
            {
                correct = false;
            }
        }
        return correct;
    }

    this.numberOfClicked = function(){
        var clicked = 0;
        for(var i = 0; i < this.ncol*this.ncol; i++){
            if(this.blocks[i].clicked)
            {
                clicked++;
            }
        }
        return clicked;
    }

    this.unclick = function(){
        for(var i = 0; i < this.nrow*this.ncol; i++)
        {
            this.blocks[i].clicked = false;
        }
    }

    this.unchose = function(){
        for(var i = 0; i < this.nrow*this.ncol; i++)
        {
            this.blocks[i].chosen = false;
        }
    }
}


function nArray(n){
    arr = [];
    for(var i =0; i < n; i++)
    {
        arr.push(i);
    }
    return arr;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function choose(array, k){
    var choise = shuffleArray(array).slice(0,k)
    return choise;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

var preset = {
    x:100, 
    y:50, 
    size_x:70, 
    size_y:70, 
    ncol:5, 
    nrow:5, 
    gap:10,
    nOfChosen:5
}
preset.size_x = (Math.min(innerWidth, innerHeight)-100)/preset.ncol
preset.size_y = (Math.min(innerWidth, innerHeight)-100)/preset.nrow
preset.x = innerWidth / 2 - (preset.size_x+preset.gap)*preset.ncol/2


trygrid = new gridOfBlocks(preset.x, preset.y, preset.size_x, preset.size_y, preset.ncol, preset.nrow, preset.gap)
trygrid.ranomize(preset.nOfChosen);

window.addEventListener('mousedown', function(event){
    if(!visible && !makenew){trygrid.update(event.x, event.y);}
})

window.addEventListener('keydown', function(event){
    if(makenew)
    {
        trygrid.unchose();
        trygrid.ranomize(preset.nOfChosen);
        trygrid.unclick();
        makenew = false;

        visible = true;
        trygrid.hide();
        setTimeout(() => { trygrid.hide(); 
        visible = false;
        }, 2000);}
})


var makenew = false;

var visible = true;
trygrid.hide();
setTimeout(() => { trygrid.hide(); 
visible = false;
}, 2000);


function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    if(!trygrid.checkIfCorrect())
    {
        c.fillStyle = "red";
        c.fillRect(0, 0, innerWidth, innerHeight);
    }
    else{
        if(trygrid.numberOfClicked() ==preset.nOfChosen )
        {
            c.fillStyle = "green";
            c.fillRect(0, 0, innerWidth, innerHeight);
            makenew = true;
        }
    }

    if(makenew)
    {
        setTimeout(() => { 
            trygrid.unchose();
        trygrid.ranomize(preset.nOfChosen);
        trygrid.unclick();
        makenew = false;

        visible = true;
        trygrid.hide();
        setTimeout(() => { trygrid.hide(); 
        visible = false;
        }, 1000);
            }, 1000);
    }



    trygrid.drawBlocks();
}

animate()
