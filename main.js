const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')
canvas.width = 350;
canvas.height = 350;

const canvas2 = document.getElementById('canvas2')
const c2 = canvas2.getContext('2d')
canvas2.width = 350;
canvas2.height = 350;

const b_go = document.getElementById('go')
const b_left = document.getElementById('left')
const b_right = document.getElementById('right')

const dpi = Math.PI * 2
const sw = 10 // scene width 
const sh = 10 // scene height
const bd = 35 // block dimension 
const pi = Math.PI
const anv = 30// angle of view 
const bh = canvas2.height/2// height of block
// const cd = bh * 2 // camera distans
const center = canvas2.height / 2
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
  x: 5 * bd + 20,
  y: 5 * bd + 15,
  d: 1, // direction
  v: 0.2, // speed
  go: false, // go or stop
  draw: function() {
    c.fillStyle = 'blue'
    if (this.go) {
      this.x += this.v * Math.cos(this.d)
      this.y += this.v * Math.sin(this.d)
    }
    c.fillRect(this.x - 2, this.y - 2, 4, 4)
  }
}

function drawRay(x, y) {
  c.beginPath()
  c.strokeStyle = 'white'
  c.moveTo(me.x, me.y)
  c.lineTo(x, y)
  c.stroke()
  c.beginPath()
  c.strokeStyle = 'red'
  c.arc(x, y, 2, 0, dpi)
  c.stroke()
}

function entersaction(angle) {
  let dx, dy, ddx, ddy, dd_temp

  let i = Math.floor(me.y / bd)
  let j = Math.floor(me.x / bd)
  let vx = me.x,
    vy = me.y,
    dd=0

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
    if (scene[i][j] == 1) {
      if ((angle == me.d) && (dd_temp < 5)) {
        me.go = false
        b_go.innerText = 'Go'
      }

      return { x: vx, y: vy}
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

canvas.addEventListener('click', e => {
  let dx = e.clientX - me.x
  let dy = e.clientY - me.y
  me.d = Math.atan(dy / dx)

  if (dx < 0 && dy < 0) me.d += pi
  if (dx < 0 && dy > 0) me.d += pi
  if (dx > 0 && dy < 0) me.d = dpi + me.d
})

b_left.addEventListener('click', () => {
  if ((me.d -= 0.1) < 0) me.d = dpi - me.d
})

b_right.addEventListener('click', () => {
  if ((me.d += 0.1) > dpi) me.d = me.d - dpi
})

b_go.addEventListener('click', e => {
  me.go = !me.go
  if (me.go) e.target.innerText = "Stop"
  else e.target.innerText = "Go"
})

addEventListener('keydown', e => {
  switch (e.key) {
    case "ArrowUp":
      me.go = true
      b_go.innerText = "Stop"
      break;
    case "ArrowDown":
      me.go = false
      b_go.innerText = "Go"
      break;
    case "ArrowLeft":
      if ((me.d -= 0.1) < 0) me.d = dpi - me.d
      break;
    case "ArrowRight":
      if ((me.d += 0.1) > dpi) me.d = me.d - dpi
      break;
    default:
      break;
  }
})

function drawView(x,y, a) {
  let dx=x-me.x
  let dy=y-me.y
  let d=Math.sqrt(dx*dx+dy*dy)
  let dh = 3000 /d
  let dg = 300 * Math.tan(a)

  c2.beginPath()
  c2.moveTo(center + dg, center + dh)
  c2.lineTo(center + dg, center - dh)
  c2.strokeStyle = 'blue'
  c2.stroke()
}
function fillReg(){
  
}

function frames() {
  c.clearRect(0, 0, canvas.width, canvas.height)
  c2.clearRect(0, 0, canvas2.width, canvas2.height)
  drawScene()
  me.draw()
  // for (let i = -anv; i < anv; i++) {
   //  let a = me.d + 0.03 * i
    let p = entersaction(me.d)
    drawRay(p.x, p.y)
    drawView(p.x, p.y ,0)
  // }

  requestAnimationFrame(frames)
}

frames()