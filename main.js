const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')

const canvas2 = document.getElementById('canvas2')
const c2 = canvas2.getContext('2d')

const b_go = document.getElementById('go')
const b_left = document.getElementById('left')
const b_right = document.getElementById('right')

const dpi = Math.PI * 2
const pi = Math.PI
const hpi = Math.PI / 2
const sw = 10 // scene width 
const sh = 10 // scene height
const bd = 32 // block dimension 
const f = 300
let t = 0
let img = new Image()
img.src ='img.png'
canvas.width =
  canvas.height =
  canvas2.width =
  canvas2.height = bd * 10
const center = canvas2.height / 2
let scene = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
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
  let dx, dy, ddx, ddy, dd_temp, d, xs, db
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

    if (scene[i][j] == 1) {
      d = Math.hypot(vx - me.x - 1, vy - me.y - 1)
      if (angle == me.d) {
        drawRay(vx, vy)
        if (d < 4) {
          me.go = false
          b_go.innerText = 'Go'
        }
      }
      let by = vy % bd
      let bx = vx % bd
      if (Math.floor(by) == 0 || Math.ceil(by) == bd) {
        xs = true
        db = bx
      }
      else {
        xs = false
        db = by
      }
      return { d: d, xs: xs, db: db }
    }
  }
}

function drawView() {

  let dg, dh, da, d, dt, xs
  for (var i = -center; i < center; i++) {
    dt = Math.atan2(i, f)
    da = me.d + dt
    d = entersaction(da)
   //  if (d.xs) c2.strokeStyle = `green`
    // else c2.strokeStyle = `rgb(0 200 0)`
    dh = 0.5 * bd * (f / (d.d * Math.sin(dt + hpi)))
    c2.drawImage(img, d.db, 0, 1,64, center + i, center - dh, 1, 2 * dh)
    /* 
    c2.beginPath()
    c2.moveTo(center + i, center - dh)
    c2.lineTo(center + i, center + dh)
    c2.stroke()
        */
  }
}

function drawScene() {
  for (var i = 0; i < sh; i++) {
    for (var j = 0; j < sw; j++) {
      if (scene[i][j] == 1) {
        c.fillStyle = 'green'
        c.fillRect(j * bd, i * bd, bd - 1, bd - 1)
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
//let ot = Date.now()
//let nt, dt

function frames() {
  //let nt = Date.now()
  //dt = nt - ot
  //ot = nt

  c.clearRect(0, 0, canvas.width, canvas.height)
  c2.clearRect(0, 0, canvas2.width, canvas2.height)
  drawScene()
  me.draw()
  drawView()
  //c.fillStyle = 'white'
  //c.fillText(`vps: ${Math.floor(dt)}`, 35, 280)
  requestAnimationFrame(frames)
}

frames()