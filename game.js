let lastRenderTime = 0
const SNAKE_SPEED = 7
let score = 0
//蛇的起始点设为（11，11）
const snakeBody = [
  { x:11,y:11 },
]
let food = getRandomFoodPosition()
const EXPANSION_RATE = 3 //吃到食物后，蛇身变长多少
let newSegments = 0
var gameOver = false

function main(currentTime) {
  if(gameOver){
    return alert("Oops！You lost. Your score is "+ score)
  }

  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return
  lastRenderTime = currentTime
  updateSnake()
  drawSnake()
  updateFood()
  drawFood()
  checkDeath()
}
window.requestAnimationFrame(main)

//键盘输入方向
let inputDirection = { x:0,y:0}
let lastInputDirection = {x:0,y:0}
window.addEventListener('keydown', e =>{
  switch(e.key){
    case "ArrowUp":
      if (lastInputDirection.y!==0) break
      inputDirection = {x:0,y:-1}
      break
    case "ArrowDown":
      if (lastInputDirection.y!==0) break
      inputDirection = {x:0,y:1}
      break
    case "ArrowLeft":
      if (lastInputDirection.x!==0) break
      inputDirection = {x:-1,y:0}
      break
    case "ArrowRight":
      if (lastInputDirection.x!==0) break
      inputDirection = {x:1,y:0}
      break
  }
})
function getInputDirection(){
  lastInputDirection = inputDirection
  return inputDirection
}

//蛇的位置改变
function updateSnake(){
  addSegments();
  const inputDirection = getInputDirection()
  for(let i=snakeBody.length-2;i>=0;i--){
    snakeBody[i+1] = {...snakeBody[i] } //create a new object
  }
  snakeBody[0].x += inputDirection.x
  snakeBody[0].y += inputDirection.y
}
//蛇的绘制
function drawSnake(){
  const gameBoard = document.getElementById("game-board")
  gameBoard.innerHTML = ""; //clear the previous pieces
  snakeBody.forEach(segment =>{
    const snakeElement = document.createElement("div")
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
  })
}

//食物的位置改变
function updateFood(){
  if(onSnake(food)){
    expandSnake(EXPANSION_RATE)
    food = getRandomFoodPosition()
  }
}

//食物的绘制
function drawFood(){
  const gameBoard = document.getElementById("game-board")
  const foodElement = document.createElement("div")
  foodElement.style.gridRowStart = food.y
  foodElement.style.gridColumnStart = food.x
  foodElement.classList.add('food')
  gameBoard.appendChild(foodElement)
}

//蛇身扩展
function expandSnake(amount){
  newSegments += amount
  score+=EXPANSION_RATE;
}

//判断蛇和食物是否相遇
function onSnake(position,{ ignoreHead=false }={}){
  return snakeBody.some((segment, index)=>{
    if(ignoreHead&&index===0) return false
    // return equalPosition(segment,position)
    return (segment.x === position.x && segment.y === position.y)
  })
}

// function equalPosition(pos1,pos2){
//   return pos1.x === pos2.x && pos1.y === pos2.y
 
// }

function addSegments(){
  for(let i = 0;i<newSegments;i++){
    snakeBody.push({...snakeBody[snakeBody.length-1]})
  }
  newSegments = 0;
}

//食物出现位置随机
function getRandomFoodPosition() {
  let newFoodPosition;
  while(newFoodPosition == null || onSnake(newFoodPosition)){
    newFoodPosition = randomGridPosition()
  }
  return newFoodPosition;
}

function randomGridPosition(){
  return{
    x: Math.floor(Math.random()*21)+1,
    y: Math.floor(Math.random()*21)+1,
  }
}

//蛇出界或碰到自己的身体，则游戏结束
function checkDeath(){
  gameOver = outsideGrid(snakeBody[0]) || snakeIntersection()
}

function outsideGrid(position){
  return (
    position.x < 1 || position.x >21 || position.y <1 || position.y >21
  )
}


function snakeIntersection(){
  return onSnake(snakeBody[0],{ ignoreHead: true })
}