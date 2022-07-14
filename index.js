//importing sound effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/music_shoooting.mp3");
const killEnemySound = new Audio("./music/music_killEnemy.mp3");
const gameOverSound = new Audio("./music/music_gameOver.mp3");
const heavyWeaponSound = new Audio("./music/music_heavyWeapon.mp3");
const hugeWeaponSound = new Audio("./music/music_hugeWeapon.mp3");

introMusic.play();

//stopping music
document.querySelector("input").addEventListener
("click",(e)=>{
    e.preventDefault();
    introMusic.pause();
    
})
//Basic environment setup.......................................
const canvas = document.createElement("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const lightweapondamage = 10;
const heavyweapondamage = 20;
const hugeweapondamage = 50;
let playerScore = 0;
document.querySelector(".myGame").appendChild(canvas);
const context = canvas.getContext("2d");

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");

//basic Functions...............................................
//Event Listeners for difficulty form...........................
document.querySelector("input").addEventListener("click", (e) => {
    e.preventDefault();//form submit krne pr vaapis reload nhi hoga

    form.style.display = "none";
    // making form invisible
    scoreBoard.style.display = "block";
    // making scoreboard visible
    const userValue = document.getElementById("difficulty").value;
    //getting difficulty selected by user
    if (userValue === "Easy") {
        setInterval(spawnEnemy, 2000);
        return (difficulty = 5);
    }
    if (userValue === "Medium") {
        setInterval(spawnEnemy, 1400);
        return (difficulty = 8);
    }
    if (userValue === "Hard") {
        setInterval(spawnEnemy, 1000);
        return (difficulty = 10);
    }
    if (userValue === "Insane") {
        setInterval(spawnEnemy, 700);
        return (difficulty = 12);
    }
})


//End screen

const gameoverLoader = ()=>{
    const gameOverBanner = document.createElement("div");
    const gameOverBtn = document.createElement("button");
    const highScore = document.createElement("div");

    gameOverBtn.innerText = "Play Again";
    highScore.innerText = `High Score : ${
        localStorage.getItem("highScore") 
        ? localStorage.getItem("highScore") 
        : playerScore
    }`;

    const oldHighScore = localStorage.getItem("highScore")&&localStorage.getItem("highScore");

    if(oldHighScore <playerScore){
        localStorage.setItem("highScore",playerScore);
    }

    gameOverBanner.appendChild(highScore);
    gameOverBanner.appendChild(gameOverBtn);

    gameOverBtn.onclick = ()=>{
        window.location.reload();
    };
    highScore.classList.add("highScore")
    gameOverBanner.classList.add("gameover");

    document.querySelector("body").appendChild(gameOverBanner);
};
//.................creating Player, Enemy, Weapon, Etc classes...............
//setting player position to center....................
playerPosition = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

//creating Player class.............................
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
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

//................//creating Weapon class.......................
class Weapon {
    constructor(x, y, radius, color, velocity, damage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.damage = damage;
    }

    draw() {
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

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}
//creating HUGE weapon class..........................
class HugeWeapon {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.color = "rgba(47,255,0,1";
        this.damage = damage;
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, 100,canvas.height);   
    }

    update() {
        this.draw();
        this.x += 20;
    }
}
//.............creating Enemy class............................

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
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

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}


//.............creating particles class............................
const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        context.save;

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
        context.restore;
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

//...........main logic start from here........................


//creating Player object weapon's array, enmey's array
const suthar = new Player(playerPosition.x, playerPosition.y, 10, "white");
const weapons = [];
const hugeWeapons = [];
const enemies = [];
const particles = [];

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

let animationId;
function animation() {
    
    //making Recursion
    animationId = requestAnimationFrame(animation);

    //clearing canvas on each frame'
    context.fillStyle = "rgba(49,49,49,0.3)";

    context.fillRect(0, 0, canvas.width, canvas.height);

    suthar.draw();//draw the player(in middle)

    //generating particles
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        }
        else {
            particle.update();
        }
    });

    //generating hugeWeapon .............
    hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
        if (hugeWeapon.x > canvas.width) {
          hugeWeapons.splice(hugeWeaponIndex, 1);
        } else {
          hugeWeapon.update();
        }
      });
    //generating weapons
    weapons.forEach((weapon, weaponIndex) => {
        weapon.update();

        //removing bullets from weapon array when they go outside of canvas
        if (weapon.x - weapon.radius < 1 ||
            weapon.y - weapon.radius < 1 ||
            weapon.y + weapon.radius > canvas.width ||
            weapon.y + weapon.radius > canvas.height) {
            weapons.splice(weaponIndex, 1);
        }
    });
    //generating enemies
    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();
        //finding distance between Player & enemy
        const distanceBetweenPlayerandEnemy = Math.hypot(
            suthar.x - enemy.x,
            suthar.y - enemy.y);

            
        //gamestop if enemy hits the player;
        if (distanceBetweenPlayerandEnemy - suthar.radius - enemy.radius < 1) {
            cancelAnimationFrame(animationId);
            gameOverSound.play();
            return gameoverLoader();
        }

        hugeWeapons.forEach((hugeWeapon) => {
            // Finding Distance between Huge weapon and enemy
            const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;
            if (
              distanceBetweenHugeWeaponAndEnemy <= 200 &&
              distanceBetweenHugeWeaponAndEnemy >= -200
            ) {
              // increasing player Score when killing one enemy
              playerScore += 10;
              scoreBoard.innerHTML = `Score : ${playerScore}`;
              setTimeout(() => {
                // killEnemySound.play();
                killEnemySound.play();
                enemies.splice(enemyIndex, 1);
              }, 0);
            }
        });
        weapons.forEach((weapon, weaponIndex) => {
            const distanceBetweenweaponAndEnemy = Math.hypot(weapon.x - enemy.x,
            weapon.y - enemy.y
            );

            //reducing the size of enemy on hitting.
            if (distanceBetweenweaponAndEnemy - weapon.radius - enemy.radius < 1) {
                if (enemy.radius > weapon.damage + 5) {
                    enemy.radius -= weapon.damage;
                    setTimeout(() => {
                        weapons.splice(weaponIndex, 1);
                    }, 1);
                }
                else {
                    for (let i = 0; i < enemy.radius * 2; i++) {
                        particles.push(new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 7),
                            y: (Math.random() - 0.5) * (Math.random() * 7)
                        }));

                    }
                    playerScore += 10;
                    // rendering player score in scoreboard html element.
                    scoreBoard.innerHTML = `Score : ${playerScore}`;
                    
                    setTimeout(() => {
                        killEnemySound.play();
                        enemies.splice(enemyIndex, 1);
                        weapons.splice(weaponIndex, 1);
                    }, 0);
                }
            }
        });
    });
}


//..............adding event listeners....................
//event listener for light weapon  (left click)
canvas.addEventListener("click", (e) => {
    shootingSound.play();
    //atan m (y,x) is treeke se attributes jaate h
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    //making const speed for bulllets 
    const velocity = {
        x: Math.cos(myAngle) * 8,
        y: Math.sin(myAngle) * 8,
    };

    //adding light weapon bullets in array
    weapons.push(new Weapon(
        canvas.width / 2,
        canvas.height / 2,
        4,
        "white",
        velocity,
        lightweapondamage
    ))
});


//event listener for rightclick for heavy weapon
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if(playerScore<2) return;
    heavyWeaponSound.play();
    playerScore -=2;
    scoreBoard.innerHTML = `Score : ${playerScore}`;
    //atan m (y,x) is treeke se attributes jaate h
    const myAngle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    //making const speed for bulllets 
    const velocity = {
        x: Math.cos(myAngle) * 5,
        y: Math.sin(myAngle) * 5,
    };

    //adding light weapon bullets in array
    weapons.push(new Weapon(
        canvas.width / 2,
        canvas.height / 2,
        12,
        "yellow",
        velocity,
        heavyweapondamage
    ));
});

addEventListener("keypress",(e)=>{
    if(e.key===" "){
        if(playerScore<20) return;
        hugeWeaponSound.play();
    playerScore -=20;
    scoreBoard.innerHTML = `Score : ${playerScore}`;
        hugeWeapons.push(new HugeWeapon(
            0,
            0,
        ));
    }

})

addEventListener("resize",(e)=>{
    window.location.reload();
});
animation();
