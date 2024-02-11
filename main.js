const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth;
canvas.height = innerHeight;
const dpi = Math.PI * 2
const sw = 10 // scene width 
const sh = 10 // scene height
const bd = 40 // block dimension 
const pi = Math.PI
const anv =20 // angle of view 
let scene = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
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
  c.arc(point.x, point.y, 2, 0, dpi)
  c.stroke()
}

function entersaction(angle) {
  let dx, dy, ddx, ddy, dd_temp

  let i = Math.floor(me.y / bd)
  let j = Math.floor(me.x / bd)
  let vx = me.x,
    vy = me.y,
    dd = 0

  while (true) {

    if (angle >= pi && angle < dpi) {
      dy = i * bd - vy
    } else {
      dy = (i + 1) * bd - vy
    }
    if (angle >= pi / 2 && angle < 3 / 2 * pi) {
      dx = j * bd - vx
    } else {
      dx = (j + 1) * bd - vx
    }

    ddy = Math.abs(dy / Math.sin(angle)) + 1
    ddx = Math.abs(dx / Math.cos(angle)) + 1

    dd_temp = (ddx < ddy) ? ddx : ddy
    vx += Math.cos(angle) * dd_temp
    vy += Math.sin(angle) * dd_temp
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
  if (dx > 0 && dy < 0) me.d = dpi + me.d
})


function frames() {
  c.clearRect(0, 0, canvas.width, canvas.height)
  drawScene()
  me.draw()
  for (let i = -anv; i < anv; i++) {
    drawRay(entersaction(me.d + 0.02 * i))
  }
  requestAnimationFrame(frames)
}

frames()