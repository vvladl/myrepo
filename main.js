const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth;
canvas.height = innerHeight;
const DPI = Math.PI * 2
const sw = 10 // scene width 
const sh = 10 // scene height
const bd = 40 // block dimension 
const pi = Math.PI

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
  x: 5 * bd + 30,
  y: 5 * bd + 15,
  d: 1,
  draw: function drawMe() {
    c.fillStyle = 'blue'
    c.fillRect(this.x - 2, this.y - 2, 4, 4)
  }
}

function drawRay(point) {
  c.beginPath()
  c.strokeStyle = 'white'
  c.moveTo(me.x, me.y)
  c.lineTo(point.x, point.y)
  c.stroke()
  c.beginPath()
  c.strokeStyle = 'red'
  c.arc(point.x, point.y, 2, 0, 6.28)
  c.stroke()
}

function entersaction() {
  let dx, dy, ddx, ddy, dd_temp

  let i = Math.floor(me.y / bd)
  let j = Math.floor(me.x / bd)
  let vx = me.x, vy = me.y, dd = 0

  while (true) {

    if (me.d >= pi && me.d < 2 * pi) {
      dy = i * bd - vy
    } else {
      dy = (i + 1) * bd - vy
    }
    if (me.d >= pi / 2 && me.d < 3 / 2 * pi) {
      dx = j * bd - vx
    } else {
      dx = (j + 1) * bd - vx
    }

    ddy = Math.abs(dy / Math.sin(me.d)) + 1
    ddx = Math.abs(dx / Math.cos(me.d)) + 1

    dd_temp = (ddx < ddy) ? ddx : ddy
    vx += Math.cos(me.d) * dd_temp
    vy += Math.sin(me.d) * dd_temp
    i = Math.floor(vy / bd)
    j = Math.floor(vx / bd)
    dd += dd_temp
    if (scene[i][j] == 1) {
      return { x: vx, y: vy }
    }
  }
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
