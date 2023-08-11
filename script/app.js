'use strict';

const snakeboard = document.getElementById("snakeboard");
const snakeboardCtx = snakeboard.getContext("2d");

const elementScore = document.getElementById('score');

const music = new Audio('../sound/Snake Music.mp3');

const dictionary = {
    'board': {
        'border': 'black',
        'background': 'white'
    },
    'snake': {
        'color': '#74c69d',
        'border': '#1b4332'
    }
}

let playGame = false;

let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
]

let score = 0;
let changingDirection = false;

let food = {
    x: 0,
    y: 0
}

let directionMove = {
    x: 10,
    y: 0
}

const playAudio = (name) => {
    const audio = new Audio(`../sound/${name}.webm`);
    audio.play();
}

const setScore = () => {
    score += 10;
    return score;
}

const saveScore = () => {
    let arrayScore = []
    if(!localStorage.getItem('score')){
        arrayScore[0] = score;
        localStorage.setItem('score', JSON.stringify(arrayScore));
    }else{
        arrayScore = JSON.parse(localStorage.getItem('score'));
        arrayScore.push(score);
        localStorage.setItem('score',JSON.stringify(arrayScore) );
    }

};

const getScore = () => {
    let bestScores = JSON.parse(localStorage.getItem('score'));
    bestScores.sort();
    return bestScores.reverse();
};

const main = () => {
    if (gameOver()){
        saveScore();
        music.pause();
        return playAudio('gameover')
    }
    

    changingDirection = false;

    clearBoard();
    drawFood();
    moveSnake();
    drawSnake();

    setTimeout(main, 100)
}


const clearBoard = () => {
    snakeboardCtx.fillStyle = dictionary['board']['background'];
    snakeboardCtx.strokestyle = dictionary['board']['border'];
    snakeboardCtx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboardCtx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

const drawSnake = () => snake.forEach(drawSnakePart)

const drawFood = () => {
    snakeboardCtx.fillStyle = '#ef233c';
    snakeboardCtx.strokestyle = '#d90429';
    snakeboardCtx.fillRect(food['x'], food['y'], 10, 10);
    snakeboardCtx.strokeRect(food['x'], food['y'], 10, 10);
}

const drawSnakePart = (snakePart) => {
    snakeboardCtx.fillStyle = dictionary['snake']['color'];
    snakeboardCtx.strokestyle = dictionary['snake']['border'];
    snakeboardCtx.fillRect(snakePart['x'], snakePart['y'], 10, 10);
    snakeboardCtx.strokeRect(snakePart['x'], snakePart['y'], 10, 10);
}

const gameOver = () => {
    for (let i = 4; i < snake.length; i++) 
        if (snake[i]['x'] === snake[0]['x'] && snake[i]['y'] === snake[0]['y']) return true
    
    const hitLeftWall = snake[0]['x'] < 0;
    const hitRightWall = snake[0]['x'] > snakeboard.width - 10;
    const hitToptWall = snake[0]['y'] < 0;
    const hitBottomWall = snake[0]['y'] > snakeboard.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

const randomFood = (min, max) => Math.round((Math.random() * (max - min) + min) / 10) * 10;

const generationFood = () => {
    food['x'] = randomFood(0, snakeboard.width - 10);
    food['y'] = randomFood(0, snakeboard.height - 10);

    snake.forEach(part => part['x'] == food['x'] && part['y'] == food['y'] ? generationFood() : '');
}

const changeDirection = (event) => {
    if (changingDirection) return;

    changingDirection = true;

    const x = directionMove['x'];
    const y = directionMove['y'];

    const goingUp = directionMove['y'] === -10;
    const goingDown = directionMove['y'] === 10;
    const goingRight = directionMove['x'] === 10;
    const goingLeft = directionMove['x'] === -10;

    

    if (event === 'ArrowLeft' && !goingRight) {
        directionMove['x'] = -10;
        directionMove['y'] = 0;
    }
    if (event === 'ArrowUp' && !goingDown) {
        directionMove['x'] = 0;
        directionMove['y'] = -10;
    }
    if (event === 'ArrowRight' && !goingLeft) {
        directionMove['x'] = 10;
        directionMove['y'] = 0;
    }
    if (event === 'ArrowDown' && !goingUp) {
        directionMove['x'] = 0;
        directionMove['y'] = 10;
    }

    if(x !=  directionMove['x'] && y != directionMove['y']) playAudio('move');
}

const moveSnake = () => {
    const head = { x: snake[0]['x'] + directionMove['x'], y: snake[0]['y'] + directionMove['y'] };

    snake.unshift(head);
    if (snake[0]['x'] === food['x'] && snake[0]['y'] === food['y']) {
        elementScore.innerHTML = setScore();

        playAudio('food');

        generationFood();
    } else snake.pop();
}




document.addEventListener('DOMContentLoaded', () => {
    music.loop = true;
    music.play();
    
    document.addEventListener("keydown", ({key}) => changeDirection(key));
    document.querySelector('#play').addEventListener('click', () => {
        document.querySelector('.cover').style.display = 'none';

        
        main();
        generationFood();
    });

        
    
});



