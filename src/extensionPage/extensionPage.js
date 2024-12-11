// JavaScript for extensionPage.html
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("background-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Bubble {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.dx = Math.random() - 0.5;
            this.dy = Math.random() - 0.5;
            this.speed = Math.random() * 5 + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy = -this.dy;
            }
            this.x += this.dx * this.speed;
            this.y += this.dy * this.speed;
        }
    }

    const bubbles = [];

    function init() {
        for (let i = 0; i < 50; i++) {
            const radius = Math.random() * 50 + 10;
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const color = `hsla(${Math.random() * 360}, 100%, 50%, 0.7)`;
            bubbles.push(new Bubble(x, y, radius, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach((bubble) => {
            bubble.draw();
            bubble.update();
        });
    }

    init();
    animate();
});


// Button event listeners
document.getElementById('forum-btn').addEventListener('click', function() {
    window.open('https://forum.example.com', '_blank');
});

document.getElementById('history-btn').addEventListener('click', function() {
    window.location.href = 'chrome://history/';
});

document.getElementById('bookmarks-btn').addEventListener('click', function() {
    window.location.href = 'chrome://bookmarks/';
});

document.getElementById('code-helper-btn').addEventListener('click', function() {
    window.open('https://code-helper.example.com', '_blank');
});

document.getElementById('new-conversation-btn').addEventListener('click', function() {
    // 在这里添加创建新对话的逻辑
    alert('New conversation created!');
});

// Show sidebar on hover
document.getElementById('sidebar-btn').addEventListener('mouseover', function() {
    document.getElementById('sidebar').style.display = 'block';
});

// Show sidebar on click
document.getElementById('sidebar-btn').addEventListener('click', function() {
    document.getElementById('sidebar').style.display = 'block';
});

// Hide sidebar when mouse leaves
document.getElementById('sidebar').addEventListener('mouseleave', function() {
    document.getElementById('sidebar').style.display = 'none';
});

const hoverZone = document.getElementById('hover-zone');
const sidebar = document.getElementById('sidebar');

// 鼠标悬停左侧边缘时显示侧边栏
hoverZone.addEventListener('mouseover', () => {
  sidebar.style.display = 'block';
});

// 鼠标移出侧边栏时隐藏
sidebar.addEventListener('mouseleave', () => {
  sidebar.style.display = 'none';
});