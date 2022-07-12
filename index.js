//Basic environment setup.......................................
const canvas = document.createElement("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
document.querySelector(".myGame").appendChild(canvas);
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

//basic Functions...............................................
//Event Listeners for difficulty form...........................
document.querySelector("input").addEventListener("click",(e) =>{
    e.preventDefault();//form submit krne pr vaapis reload nhi hoga

    form.style.display = "none";
    // making form invisible
    scoreBoard.style.display = "block";
    // making scoreboard visible
    const userValue = document.getElementById("difficulty").value; 
    //getting difficulty selected by user
    if(userValue==="Easy"){
        setInterval(spawnEnemy,2000);
        return (difficulty=5);
    }
    if(userValue==="Medium"){
        setInterval(spawnEnemy,1400);
        return (difficulty=8);
    }
    if(userValue==="Hard"){
        setInterval(spawnEnemy,1000);
        return (difficulty=10);
    }
    if(userValue==="Insane"){
        setInterval(spawnEnemy,700);
        return (difficulty=12); 
    }
})


//.................creating Player, Enemy, Weapon, Etc classes...............
//setting player position to center....................
playerPosition={
    x : canvas.width/2,
    y : canvas.height/2
}

//creating Player class.............................
class Player{
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x, 
            this.y, 
            this.radius, 
            Math.PI / 180 * 0, 
            Math.PI / 180 * 360, 
            false
        );
        context.fillStyle = this.color;
        context.fill(); 
    }
}

//................//creating Player class.......................
class Weapon{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x, 
            this.y, 
            this.radius, 
            Math.PI / 180 * 0, 
            Math.PI / 180 * 360, 
            false
        );
        context.fillStyle = this.color;
        context.fill(); 
    }

    update(){
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

//.............creating Enemy class............................

class Enemy{
    constructor(x,y,radius,color,velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        context.beginPath();
        context.arc(
            this.x, 
            this.y, 
            this.radius, 
            Math.PI / 180 * 0, 
            Math.PI / 180 * 360, 
            false
        );
        context.fillStyle = this.color;
        context.fill(); 
    }

    update(){
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

//...........main logic start from here........................


//creating Player object weapon's array, enmey's array
const suthar = new Player(playerPosition.x ,playerPosition.y,10, "white");
const weapons =  [];
const enemies = [];

//.........function to create spawn enemy at random location..

const spawnEnemy = () => {
    // generating random size for enemy
    const enemySize = Math.random() * (40 - 5) + 5;
    // generating random color for enemy
    const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;
  
    // random is Enemy Spawn position
    let random;
  
    // Making Enemy Location Random but only from outsize of screen
    if (Math.random() < 0.5) {
      // Making X equal to very left off of screen or very right off of screen and setting Y to any where vertically
      random = {
        x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
        y: Math.random() * canvas.height,
      };
    } else {
      // Making Y equal to very up off of screen or very down off of screen and setting X to any where horizontally
      random = {
        x: Math.random() * canvas.width,
        y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
      };
    }
  
    // Finding Angle between center (means Player Position) and enemy position
    const myAngle = Math.atan2(
      canvas.height / 2 - random.y,
      canvas.width / 2 - random.x
    );
  
    // Making velocity or speed of enemy by multipling chosen difficulty to radian
    const velocity = {
      x: Math.cos(myAngle) * difficulty,
      y: Math.sin(myAngle) * difficulty
    };
  
    // Adding enemy to enemies array
    enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};



//..............creating animation function.............................................
function animation(){
    //making Recursion
    requestAnimationFrame(animation);

    //clearing canvas on each frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    suthar.draw();//draw the player(in middle)
    
    //generating weapons
    weapons.forEach(weapon=>{
        weapon.update();
    })
    //generating enemies
    enemies.forEach((enemy,enemyIndex)=>{
        enemy.update();

        weapons.forEach((weapon,weaponIndex)=>{
            const distanceBetweenweaponAndEnemy = Math.hypot(weapon.x-enemy.x,
            weapon.y-enemy.y);

            if(distanceBetweenweaponAndEnemy - weapon.radius -enemy.radius<1){
                console.log("Kill Enemy");
            }
        });
    });
}


//..............adding event listeners....................
//event listener for light weapon  (left click)
canvas.addEventListener("click",(e)=>{
    //myangle m (y,x) is treeke se attributes jaate h
    const myAngle = Math.atan2(
        e.clientY - canvas.height/2,
        e.clientX - canvas.width/2
    );

    //making const speed for bulllets 
    const velocity = {
        x: Math.cos(myAngle)*6,
        y: Math.sin(myAngle)*6,
    };

    //adding light weapon bullets in array
    weapons.push(new Weapon(
        canvas.width/2,
        canvas.height/2,
        4,
        "white",
        velocity
        ))
});


animation();