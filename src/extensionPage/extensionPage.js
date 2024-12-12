// JavaScript for extensionPage.html

// Button event listeners

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