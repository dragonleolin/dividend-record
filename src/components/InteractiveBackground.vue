<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import p5 from 'p5'

const containerRef = ref(null)
let p5Instance = null

const sketch = (p) => {
  let particles = []
  const particleCount = 60
  
  // Theme Colors (Slate-900 based palette)
  const colors = [
    '#facc15', // yellow-400 (Coins)
    '#4ade80', // green-400 (Health/Gain)
    '#3b82f6', // blue-500 (Mana/Action)
    '#94a3b8'  // slate-400 (Dust)
  ]

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight)
    p.noStroke()
    
    // Initial Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(p))
    }
  }

  p.draw = () => {
    p.background(15, 23, 42) // Slate-900 equivalent (hex #0f172a)
    
    // Draw Grid Lines (Retro Effect)
    drawGrid(p)

    // Update & Draw Particles
    particles.forEach(pt => {
        pt.update(p.mouseX, p.mouseY)
        pt.display()
    })
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // --- Helper Functions ---
  
  function drawGrid(p) {
    p.stroke(30, 41, 59) // slate-800
    p.strokeWeight(1)
    const step = 50
    
    // Vertical
    for (let x = 0; x < p.width; x += step) {
        p.line(x, 0, x, p.height)
    }
    // Horizontal
    for (let y = 0; y < p.height; y += step) {
        p.line(0, y, p.width, y)
    }
    p.noStroke()
  }

  class Particle {
    constructor(p) {
        this.p = p
        this.reset()
    }

    reset() {
        this.x = Math.random() * this.p.width
        this.y = Math.random() * this.p.height
        this.size = Math.random() * 8 + 4 // Pixel size
        this.speedX = (Math.random() - 0.5) * 1
        this.speedY = (Math.random() - 0.5) * 1
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.alpha = Math.random() * 150 + 50
    }

    update(mx, my) {
        this.x += this.speedX
        this.y += this.speedY

        // Mouse Interaction: Flee
        let d = this.p.dist(this.x, this.y, mx, my)
        if (d < 100) {
            let angle = this.p.atan2(this.y - my, this.x - mx)
            this.x += this.p.cos(angle) * 2
            this.y += this.p.sin(angle) * 2
        }

        // Return to screen wrap
        if (this.x < 0) this.x = this.p.width
        if (this.x > this.p.width) this.x = 0
        if (this.y < 0) this.y = this.p.height
        if (this.y > this.p.height) this.y = 0
    }

    display() {
        this.p.fill(this.color) // p5 handles hex string?? Yes usually.
        // Actually p5 color requires correct parsing or just color()
        // But fill(string) works in modern p5.
        // Let's add alpha manually?
        let c = this.p.color(this.color)
        c.setAlpha(this.alpha)
        this.p.fill(c)
        this.p.rect(this.x, this.y, this.size, this.size)
    }
  }
}

onMounted(() => {
  p5Instance = new p5(sketch, containerRef.value)
})

onUnmounted(() => {
  if (p5Instance) {
    p5Instance.remove()
  }
})
</script>

<template>
  <div ref="containerRef" class="interactive-bg"></div>
</template>

<style scoped>
.interactive-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none; /* Let clicks pass through, p5 canvas will still capture mouse via global listeners if needed, but we used p.mouseX which works */
  /* Actually p5 canvas captures pointer events by default if we aren't careful? 
     pointer-events: none on the CONTAINER ensures we can click buttons BEHIND (or rather in front of) it.
     But wait, if pointer-events is none, will p5 get mouse positions?
     p5 gets mouse from window/document usually unless targeted.
     Testing needed. Usually p.mouseX works fine with pointer-events:none on canvas container.
  */
}
</style>
