const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let width, height;
const particles = [];
const particleCount = 400;

function resizeCanvas() {
  const oldWidth = width;
  const oldHeight = height;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight + 200;

  const scaleX = width / oldWidth;
  const scaleY = height / oldHeight;

  particles.forEach(p => {
    p.x *= scaleX;
    p.y *= scaleY;
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("orientationchange", resizeCanvas);
resizeCanvas();

for (let i = 0; i < particleCount; i++) {
  const baseRadius = Math.random() * 0.5 + 0.35;
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    baseRadius: baseRadius,
    radius: baseRadius,
    speedX: 0.3 * Math.random() - 0.15,
    speedY: 0.3 * Math.random() - 0.15,
    alpha: Math.random(),
    alphaDirection: Math.random() > 0.5 ? 1 : -1,
    alphaSpeed: Math.random() * 0.005 + 0.002,
  });
}

let gradientShift = 0;

function animate() {
  gradientShift += 0.002;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(
    0,
    `hsl(${220 + 20 * Math.sin(gradientShift)}, 50%, 10%)`
  );
  gradient.addColorStop(
    1,
    `hsl(${280 + 20 * Math.sin(gradientShift)}, 25%, 10%)`
  );

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;

    p.alpha += p.alphaDirection * p.alphaSpeed;

    if (p.alpha <= 0) {
      p.alpha = 0;
      p.alphaDirection = 1;
    }

    if (p.alpha >= 1) {
      p.alpha = 1;
      p.alphaDirection = -1;
    }

    p.radius = p.baseRadius * p.alpha;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();
