var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

const colours = ["green", "grey", "red", "grey"]
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
            this.y < mouse_y && 
            this.y + this.size_y > mouse_y)
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

}

// tryBlock = new block(100, 100, 100, 100);
// tryBlock.updateColour();
// tryBlock.draw();

trygrid = new gridOfBlocks(50, 50, 50, 50, 3, 3, 10)
// trygrid.drawBlocks();


var mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', function(event){
    console.log(event)
    mouse.x = event.x;
    mouse.y = event.y;

});

window.addEventListener('mousedown', function(event){
    trygrid.update(mouse.x, mouse.y);
})

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    trygrid.drawBlocks();
}

animate()