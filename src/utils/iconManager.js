export const showIcon = (x, y, text) => {
  const existingIcon = document.getElementById('custom-selected-icon');
  if (existingIcon) {
    existingIcon.remove();
  }

  console.log("text111: ", text);

  // 创建图标与快捷功能栏的主容器
  const container = document.createElement('div');
  container.id = 'custom-selected-icon';
  container.style.position = 'absolute';
  container.style.width = '45px'; // 初始宽度
  container.style.height = '45px';
  container.style.top = `${y}px`;
  container.style.left = `${x}px`;
  container.style.zIndex = 1000;
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'flex-start'; // 图标与功能键横向排列
  container.style.cursor = 'pointer';
  container.style.borderRadius = '12px';
  container.style.transition = 'width 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease';

  // 初始背景隐藏
  container.style.backgroundColor = 'transparent';
  container.style.boxShadow = 'none';

  // 图标本体
  const icon = document.createElement('div');
  icon.innerHTML = `
    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_414_83)">
      <rect x="2.68396" y="0.971924" width="40" height="40" rx="16.5199" fill="#F9F9F9"/>
      <rect x="3.18396" y="1.47192" width="39" height="39" rx="16.0199" stroke="url(#paint0_linear_414_83)"/>
      </g>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4798 21.3462C14.4798 16.5446 18.3903 12.648 23.2195 12.648C25.5808 12.648 27.7217 13.579 29.2948 15.0932L30.2459 14.1067C28.4272 12.356 25.9489 11.2782 23.2195 11.2782C17.6379 11.2782 13.1089 15.7834 13.1089 21.3462L14.4798 21.3462Z" fill="#FF3E80"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.2568 21.3462C17.2568 17.9685 19.9848 15.2244 23.3573 15.2244C25.0014 15.2244 26.4919 15.8761 27.5891 16.9367L28.5321 15.9432C27.1906 14.6465 25.3658 13.8487 23.3573 13.8487C19.2384 13.8487 15.8935 17.2022 15.8935 21.3462L17.2568 21.3462Z" fill="#FFC300"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.8508 21.3462C19.8508 19.509 21.3409 18.0196 23.179 18.0196C24.055 18.0196 24.8506 18.357 25.4454 18.9102L26.39 17.8954C25.5488 17.113 24.4191 16.6335 23.179 16.6335C20.575 16.6335 18.4641 18.7434 18.4641 21.3462L19.8508 21.3462Z" fill="#00D4E6"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9116 21.3462C19.9116 23.1496 21.3735 24.6115 23.1769 24.6115C24.9803 24.6115 26.4422 23.1496 26.4422 21.3462L33.2449 21.3462C33.2449 22.0578 33.1711 22.7522 33.0307 23.4221C32.0739 27.9865 28.0257 31.4142 23.1769 31.4142C18.3281 31.4142 14.2799 27.9865 13.3231 23.4221C13.1827 22.7522 13.1089 22.0578 13.1089 21.3462L19.9116 21.3462ZM15.457 23.4221C16.371 26.8296 19.481 29.3383 23.1769 29.3383C26.8728 29.3383 29.9828 26.8296 30.8968 23.4221L28.0997 23.4221C27.2896 25.3408 25.3905 26.6874 23.1769 26.6874C20.9633 26.6874 19.0642 25.3408 18.2541 23.4221L15.457 23.4221Z" fill="#8759F2"/>
      <defs>
      <filter id="filter0_d_414_83" x="0.68396" y="0.971924" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="2"/>
      <feGaussianBlur stdDeviation="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_414_83"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_414_83" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear_414_83" x1="22.684" y1="0.971924" x2="22.684" y2="40.9719" gradientUnits="userSpaceOnUse">
      <stop stop-color="white"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      </defs>
    </svg>`;
  icon.style.width = '45px';
  icon.style.height = '45px';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';

  // 为图标添加点击事件监听器
  icon.addEventListener('click', () => {
    container.style.display = 'none';
  });

  // 快捷功能栏内容
  const actions = [
    {
      icon: '⭐',
      label: '收藏夹',
      onClick: () => {
        if (onOpenFavorites) {
          onOpenFavorites();
        } else {
          console.error('onOpenFavorites 方法未定义');
        }
      },
    },
    { icon: '🔍', label: 'AI搜索' },
    { icon: '⚙️', label: '功能选择' },
    { icon: '📖', label: '界面解释' },
  ];

  // 快捷功能按钮容器
  const actionsContainer = document.createElement('div');
  actionsContainer.style.display = 'none'; // 初始隐藏
  actionsContainer.style.flexDirection = 'row';
  actionsContainer.style.alignItems = 'center';
  actionsContainer.style.marginLeft = '10px';

  actions.forEach((action) => {
    const actionButton = document.createElement('button');
    actionButton.innerHTML = action.icon;
    actionButton.title = action.label;
    actionButton.style.border = 'none';
    actionButton.style.background = 'none';
    actionButton.style.cursor = 'pointer';
    actionButton.style.padding = '10px';
    actionButton.style.display = 'flex';
    actionButton.style.alignItems = 'center';
    actionButton.style.justifyContent = 'center';
    actionButton.style.transition = 'background-color 0.3s ease';
    actionButton.addEventListener('click', action.onClick);
    actionButton.addEventListener('mouseenter', () => {
      actionButton.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    });
    actionButton.addEventListener('mouseleave', () => {
      actionButton.style.backgroundColor = 'transparent';
    });
    actionsContainer.appendChild(actionButton);
  });

  container.appendChild(icon);
  container.appendChild(actionsContainer);
  document.body.appendChild(container);

  // 鼠标悬停事件
  container.addEventListener('mouseenter', () => {
    container.style.backgroundColor = '#fff'; // 背景显示
    container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'; // 恢复阴影
    container.style.width = 'auto'; // 背景动态延伸
    actionsContainer.style.display = 'flex';
  });

  container.addEventListener('mouseleave', () => {
    container.style.backgroundColor = 'transparent'; // 背景隐藏
    container.style.boxShadow = 'none'; // 移除阴影
    container.style.width = '45px'; // 恢复初始大小
    actionsContainer.style.display = 'none';
  });

  // 图标点击事件
  icon.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openSidePanel' });
  });
  

  // 添加拖动功能
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - container.getBoundingClientRect().left;
    offsetY = e.clientY - container.getBoundingClientRect().top;
    container.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      container.style.left = `${e.clientX - offsetX}px`;
      container.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'pointer';
  });
};

export const removeIcon = () => {
  const icon = document.getElementById('custom-selected-icon');
  if (icon) {
    icon.remove();
    console.log('Icon removed from document.');
  }
};
