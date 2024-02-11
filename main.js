const canvas = document.querySelector('canvas')
canvas.width = innerWidth;
canvas.height = innerHeight;
let centerX = innerWidth / 2
let centerY = innerHeight / 2
const DPI = Math.PI * 2
const sw = 10 // scene width 
const sh = 10 // scene height
const bd = 40 // block dimension 
const pi = Math.PI

const c = canvas.getContext('2d')
/* 

let balls = new Array(50)
let countClick = 0

function drawBalls() {
  balls.forEach((b) => {
    b.draw()
  })
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'red'
    this.l = String.fromCharCode(Math.floor(Math.random() * 94 + 33))
  }
  draw() {
    if (this.x < canvas.width && this.y < canvas.height && this.x > 0 && this.y > 0) {
      this.y -= 5
      c.fillStyle = this.color
      c.font = '48px monospace'
      c.fillText(this.l, this.x, this.y)
    }
  }
}

balls.fill(new Ball(0, 0))

addEventListener('click', (ev) => {
  balls[countClick] = new Ball(ev.clientX, ev.clientY)
  countClick += 1
  if (countClick == 50) countClick = 0
})
*/

let scene = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const me = {
  x: 145,
  y: 60,
  d: 1,
  draw: function drawMe() {
    c.fillStyle = 'blue'
    c.fillRect(this.x - 2, this.y - 2, 4, 4)
  }

}

function drawRay(l) {
  let vx = me.x + Math.cos(me.d) * l
  let vy = me.y + Math.sin(me.d) * l
  let i = Math.floor(vy/ bd)
  let j = Math.floor(vx/ bd)
  c.beginPath()
  c.strokeStyle = 'white'
  c.moveTo(me.x, me.y)
  c.lineTo(vx, vy)
  c.stroke()
  c.beginPath()
  if (scene[i][j] == 1)
    c.strokeStyle = 'red'
  else c.strokeStyle = 'white'
  c.arc(vx, vy, 2, 0, 6.28)
  c.stroke()
}

const point = {
  x: 0,
  y: 0
}

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

function sumVec(v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y)

}

function entersaction() {
  let dx, dy, ddx, ddy
  let ax = Math.floor(me.x / bd)
  let ay = Math.floor(me.y / bd)
  if (me.d >= pi && me.d < 2 * pi) {
    dy = ay * bd - me.y
  } else {
    dy = (ay + 1) * bd - me.y
  }
  if (me.d >= pi / 2 && me.d < 3 / 2 * pi) {
    dx = (ax ) * bd - me.x
  } else {
    dx = (ax+1) * bd - me.x
  }

  ddy = Math.abs(dy / Math.sin(me.d))+1
  ddx = Math.abs(dx / Math.cos(me.d))+1

  if (ddx < ddy) return ddx
  else return ddy
}

function drawScene() {
  for (var i = 0; i < sh; i++) {
    for (var j = 0; j < sw; j++) {
      if (scene[i][j] == 1) {
        c.fillStyle = 'green'
        c.fillRect(j * bd, i * bd, bd - 1, bd - 1)
      }
      else {
        c.strokeStyle = 'white'
        c.strokeRect(j * bd, i * bd, bd, bd)
      }
    }
  }
}

addEventListener('click', e => {
  let dx = e.clientX - me.x
  let dy = e.clientY - me.y
  me.d = Math.atan(dy / dx)

  if (dx < 0 && dy < 0) me.d += pi
  if (dx < 0 && dy > 0) me.d += pi
  if (dx > 0 && dy < 0) me.d = 2 * pi + me.d
})




function frames() {
  c.clearRect(0, 0, canvas.width, canvas.height)
  // drawBalls()
  drawScene()
  me.draw()
  drawRay(entersaction())
  requestAnimationFrame(frames)
}

frames()
/* drawScene()
for (let index = 0; index < 2 * pi; index += 0.05) {
  me.d = index
  drawRay(entersaction())

}
 */
 
