import '../styles/sidebar.css';

// 内联 eventsource-parser 库
function createParser(onParse) {
  let buffer = '';
  return {
    feed(chunk) {
      buffer += chunk;
      let position = 0;
      while (position < buffer.length) {
        const nextNewline = buffer.indexOf('\n', position);
        if (nextNewline === -1) break;
        const line = buffer.slice(position, nextNewline);
        position = nextNewline + 1;
        if (line.startsWith('data: ')) {
          onParse({ type: 'event', data: line.slice(6) });
        }
      }
      buffer = buffer.slice(position);
    },
  };
}

// 定义 fetchSSE 函数，用于处理流式响应
async function fetchSSE(resource, options) {
  const { onMessage, ...fetchOptions } = options;
  const response = await fetch(resource, fetchOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      // 检查是否为 [DONE] 标记，跳过处理
      if (event.data === '[DONE]') return;
      onMessage(event.data);
    }
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;

  while (!done) {
    const { value, done: isDone } = await reader.read();
    done = isDone;
    if (value) {
      parser.feed(decoder.decode(value));
    }
  }
}


// 当用户松开鼠标按钮时，检测是否有选中文字
document.addEventListener('mouseup', function (e) {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    // 如果有选中的文字，显示一个小图标
    showIcon(e.pageX, e.pageY, selectedText);
  }
});

// 1. 创建 Intersection Observer，监听代码块是否进入视口
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const codeBlock = entry.target;

      // 将图标放置在代码块附近
      const rect = codeBlock.getBoundingClientRect();
      showIcon(window.scrollX + rect.right - 100, window.scrollY + rect.top, codeBlock.textContent.trim());

      // 取消对该代码块的观察（可选）
      observer.unobserve(codeBlock);
    }
  });
}, { threshold: 0.1 }); // 设置阈值，进入10%视口时触发

// 3. 开始观察所有代码块
document.querySelectorAll('pre, code, .example_code').forEach(block => {
  observer.observe(block);
});


// 显示一个小图标，允许用户点击后显示侧边栏
function showIcon(x, y, selectedText) {
  // 如果已经有图标存在，先移除
  const existingIcon = document.getElementById('custom-selected-icon');
  if (existingIcon) {
    existingIcon.remove();
  }

  // 创建图标
  const icon = document.createElement('div');
  icon.id = 'custom-selected-icon';
  icon.innerHTML = `<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  icon.style.position = 'absolute';
  icon.style.top = `${y}px`;
  icon.style.left = `${x}px`;
  icon.style.cursor = 'pointer';
  icon.style.zIndex = 1000;
  icon.style.width = '100px';
  icon.style.height = '100px';
  icon.style.borderRadius = '50%';
  icon.style.display = 'flex';
  icon.style.alignItems = 'center';
  icon.style.justifyContent = 'center';

  // 点击图标时，显示侧边栏
  icon.addEventListener('click', function () {
    const existingSidebar = document.getElementById('custom-sidebar');
    if (!existingSidebar) {
      createSidebar(selectedText);
      console.log('selectedText1: ', selectedText);
      // 向 background.js 发送消息
      chrome.runtime.sendMessage({ action: 'fillTextBox', text: selectedText }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", chrome.runtime.lastError.message);
        } else {
          console.log("Message sent, response:", response);
        }
      });
    }
    document.body.removeChild(icon);  // 移除图标
  });

  document.body.appendChild(icon);
}

// 创建侧边栏
function createSidebar(selectedText) {
  let sidebar = document.getElementById('custom-sidebar');
  if (!sidebar) {
    // 创建侧边栏容器
    sidebar = document.createElement('div');
    sidebar.id = 'custom-sidebar';
    sidebar.className = 'sidebar-container';
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '0';
    sidebar.style.width = '25%';
    sidebar.style.height = '100%';
    sidebar.style.zIndex = '10000';
    sidebar.style.display = 'flex';
    sidebar.style.flexDirection = 'column';

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.className = 'sidebar-title-bar';

    // 插入 "C" 形 SVG 图标
    const titleIcon = document.createElement('span');
    titleIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 12a10 10 0 1 1-10-10"></path>
      </svg>
    `;
    titleIcon.className = 'title-icon';

        // 标题文字
    const title = document.createElement('span');
    title.innerText = 'oding assistant';

    // 图标容器
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';

        // 固定图标
    const pinIcon = document.createElement('button');
    pinIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_406_221)"><path d="M2.12299 24.0004L8.56699 17.5564L13.467 22.4564L14.527 21.3954C15.5718 20.3422 16.3231 19.0342 16.7064 17.6011C17.0897 16.1679 17.0916 14.6595 16.712 13.2254L20.055 9.87138L20.548 10.3654C20.8806 10.7148 21.3258 10.9357 21.8053 10.9891C22.2847 11.0425 22.7676 10.925 23.169 10.6574C23.4041 10.4894 23.5998 10.2724 23.7426 10.0213C23.8854 9.77018 23.9719 9.49101 23.996 9.20314C24.0202 8.91527 23.9815 8.62559 23.8825 8.35418C23.7836 8.08278 23.6268 7.83614 23.423 7.63138L16.455 0.641378C16.1224 0.291951 15.6772 0.0710828 15.1977 0.0176684C14.7183 -0.0357459 14.2353 0.0817191 13.834 0.349378C13.5989 0.517307 13.4032 0.734353 13.2604 0.985465C13.1176 1.23658 13.0311 1.51575 13.0069 1.80362C12.9828 2.09149 13.0215 2.38117 13.1205 2.65257C13.2194 2.92398 13.3762 3.17061 13.58 3.37538L14.139 3.93538L10.789 7.30038L10.725 7.28038C9.29794 6.91063 7.79918 6.91905 6.37637 7.30483C4.95357 7.6906 3.65582 8.44041 2.61099 9.48038L1.54999 10.5374L6.44999 15.4374L-7.62939e-06 21.8774L2.12299 24.0004ZM9.88399 10.1534L11.617 10.7144L16.257 6.06038L17.934 7.74138L13.3 12.3914L13.825 14.0334C14.176 15.3906 13.9935 16.8307 13.315 18.0574L5.94199 10.6864C7.13991 10.0124 8.55011 9.82173 9.88399 10.1534Z" fill="white"/></g><defs><clipPath id="clip0_406_221"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';  // 固定图标
    pinIcon.className = 'pin-icon';
    pinIcon.addEventListener('click', () => {
      console.log('Pin icon clicked');
    });

    // 三点菜单图标
    const moreIcon = document.createElement('button');
    moreIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_406_170)"><path d="M0 3V11H11V0H3C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.31607 1.44129 0 2.20435 0 3H0ZM3 3H8V8H3V3Z" fill="white"/><path d="M20.9998 0H12.9998V11H23.9998V3C23.9998 2.20435 23.6838 1.44129 23.1212 0.87868C22.5585 0.31607 21.7955 0 20.9998 0V0ZM20.9998 8H15.9998V3H20.9998V8Z" fill="white"/><path d="M0 21C0 21.7956 0.31607 22.5587 0.87868 23.1213C1.44129 23.6839 2.20435 24 3 24H11V13H0V21ZM3 16H8V21H3V16Z" fill="white"/><path d="M12.9998 24H20.9998C21.7955 24 22.5585 23.6839 23.1212 23.1213C23.6838 22.5587 23.9998 21.7956 23.9998 21V13H12.9998V24ZM15.9998 16H20.9998V21H15.9998V16Z" fill="white"/></g><defs><clipPath id="clip0_406_170"><rect width="24" height="24" fill="white"/></clipPath></defs></svg> `;
    moreIcon.className = 'more-icon';
    moreIcon.addEventListener('click', () => {
      const dropdownMenu = document.getElementById('dropdown-menu');
      dropdownMenu.classList.toggle('active');
    });

    // 关闭图标
    const closeIcon = document.createElement('button');
    closeIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_405_1484)"><path d="M22.5 6H1.5C1.10218 6 0.720644 5.84196 0.43934 5.56066C0.158035 5.27936 0 4.89782 0 4.5C0 4.10218 0.158035 3.72064 0.43934 3.43934C0.720644 3.15804 1.10218 3 1.5 3H22.5C22.8978 3 23.2794 3.15804 23.5607 3.43934C23.842 3.72064 24 4.10218 24 4.5C24 4.89782 23.842 5.27936 23.5607 5.56066C23.2794 5.84196 22.8978 6 22.5 6Z" fill="white"/><path d="M22.4999 10.9996H9.49988C9.10205 10.9996 8.72052 10.8416 8.43922 10.5603C8.15791 10.279 7.99988 9.89746 7.99988 9.49963C7.99988 9.10181 8.15791 8.72028 8.43922 8.43897C8.72052 8.15767 9.10205 7.99963 9.49988 7.99963H22.4999C22.8977 7.99963 23.2792 8.15767 23.5605 8.43897C23.8418 8.72028 23.9998 9.10181 23.9998 9.49963C23.9998 9.89746 23.8418 10.279 23.5605 10.5603C23.2792 10.8416 22.8977 10.9996 22.4999 10.9996Z" fill="white"/><path d="M22.5 21H1.5C1.10218 21 0.720644 20.842 0.43934 20.5607C0.158035 20.2794 0 19.8978 0 19.5C0 19.1022 0.158035 18.7206 0.43934 18.4393C0.720644 18.158 1.10218 18 1.5 18H22.5C22.8978 18 23.2794 18.158 23.5607 18.4393C23.842 18.7206 24 19.1022 24 19.5C24 19.8978 23.842 20.2794 23.5607 20.5607C23.2794 20.842 22.8978 21 22.5 21Z" fill="white"/><path d="M22.4999 16.0004H9.49988C9.10205 16.0004 8.72052 15.8423 8.43922 15.561C8.15791 15.2797 7.99988 14.8982 7.99988 14.5004C7.99988 14.1025 8.15791 13.721 8.43922 13.4397C8.72052 13.1584 9.10205 13.0004 9.49988 13.0004H22.4999C22.8977 13.0004 23.2792 13.1584 23.5605 13.4397C23.8418 13.721 23.9998 14.1025 23.9998 14.5004C23.9998 14.8982 23.8418 15.2797 23.5605 15.561C23.2792 15.8423 22.8977 16.0004 22.4999 16.0004Z" fill="white"/><path d="M1.707 15.7452L4.681 12.7712C4.88508 12.5665 4.99968 12.2892 4.99968 12.0002C4.99968 11.7111 4.88508 11.4339 4.681 11.2292L1.707 8.25519C1.56709 8.11532 1.38883 8.02009 1.19479 7.98156C1.00074 7.94302 0.799624 7.96291 0.616884 8.0387C0.434143 8.1145 0.27799 8.24279 0.168182 8.40735C0.0583736 8.57192 -0.00015534 8.76535 3.09641e-07 8.96319V15.0372C-0.00015534 15.235 0.0583736 15.4285 0.168182 15.593C0.27799 15.7576 0.434143 15.8859 0.616884 15.9617C0.799624 16.0375 1.00074 16.0574 1.19479 16.0188C1.38883 15.9803 1.56709 15.8851 1.707 15.7452Z" fill="white"/></g><defs><clipPath id="clip0_405_1484"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';  // 关闭图标（SVG 或 Emoji）
    closeIcon.className = 'close-icon';
    closeIcon.addEventListener('click', () => {
      document.body.removeChild(sidebar);
    });

    // 下拉菜单
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'dropdown-menu';
    dropdownMenu.className = 'dropdown-menu';

    const settingsItem = document.createElement('div');
    settingsItem.innerText = '设置';
    settingsItem.className = 'dropdown-item';

    const historyItem = document.createElement('div');
    historyItem.innerText = '历史记录';
    historyItem.className = 'dropdown-item';

    const favoritesItem = document.createElement('div');
    favoritesItem.innerText = '收藏夹';
    favoritesItem.className = 'dropdown-item';

    dropdownMenu.appendChild(settingsItem);
    dropdownMenu.appendChild(historyItem);
    dropdownMenu.appendChild(favoritesItem);

        // 组装标题栏
    titleBar.appendChild(titleIcon); // 左侧是 "C" 形 SVG 图标
    titleBar.appendChild(title);     // 中间是 "oding assistant" 文字
    titleBar.appendChild(iconContainer);  // 右侧是图标容器

    // 组装标题栏
    titleBar.appendChild(pinIcon);  // 紧接着是固定图标
    titleBar.appendChild(moreIcon);  // 三点菜单图标
    titleBar.appendChild(closeIcon);  // 右侧是关闭图标
    titleBar.appendChild(dropdownMenu);

    // 创建聊天记录区域
    const chatHistory = document.createElement('div');
    chatHistory.id = 'chat-history';
    chatHistory.className = 'chat-history';
    chatHistory.innerHTML = `<p class="welcome-message">欢迎使用编程小助手</p>`;

    // 创建输入区域
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'chat-input-container';

    const chatInput = document.createElement('textarea');  // 改为textarea用于支持换行
    chatInput.id = 'chat-input';
    chatInput.className = 'chat-input';
    chatInput.placeholder = '输入消息...';
    chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();  // 阻止默认换行
        const message = chatInput.value;
        if (message !== '') {
          sendMessageToModel(message);
          chatInput.value = '';  // 清空输入框
        }
      }
    });

    const sendButton = document.createElement('button');
    sendButton.className = 'send-button';
    sendButton.innerHTML = '<i class="send-icon">发送</i>';
    sendButton.addEventListener('click', () => {
      const message = chatInput.value;
      if (message !== '') {
        sendMessageToModel(message);
        chatInput.value = '';  // 清空输入框
      }
    });

    chatInputContainer.appendChild(chatInput);
    chatInputContainer.appendChild(sendButton);

    // 将元素添加到侧边栏
    sidebar.appendChild(titleBar);
    sidebar.appendChild(chatHistory);
    sidebar.appendChild(chatInputContainer);

    document.body.appendChild(sidebar);
  }
}


// 监听来自 background.js 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleSidebar') {
    const existingSidebar = document.getElementById('custom-sidebar');
    if (existingSidebar) {
      // 如果侧边栏已经存在，则移除
      document.body.removeChild(existingSidebar);
    } else {
      // 如果侧边栏不存在，则创建
      createSidebar();
    }
  }
});

// 更新后的 sendMessageToModel 函数
async function sendMessageToModel(message) {
  console.log(message);
  const chatHistory = document.getElementById('chat-history');
  const timestamp = new Date().toLocaleTimeString();

  // 显示用户发送的消息
  const userMessage = document.createElement('div');
  userMessage.className = 'chat-bubble user-bubble';
  userMessage.textContent = message;
  const timestampSpan = document.createElement('span');
  timestampSpan.className = 'timestamp';
  timestampSpan.textContent = ` ${timestamp}`;
  userMessage.appendChild(timestampSpan);
  chatHistory.appendChild(userMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // 显示加载状态
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'chat-bubble loading-bubble';
  loadingMessage.textContent = `模型正在思考...`;
  chatHistory.appendChild(loadingMessage);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  let modelResponse; // 定义模型的当前回复气泡

  try {
    // 使用 fetchSSE 函数处理流式响应
    await fetchSSE('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sk-6e6c9fc152524e459bff2f5e4459b145`  // 替换 YOUR_API_KEY 为你的 DeepSeek API Key
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { "role": "system", "content": "You are a helpful assistant." },
          { "role": "user", "content": message }
        ],
        stream: true // 启用流式输出
      }),
      onMessage: (data) => {
        if (loadingMessage) loadingMessage.remove();

        try {
          const parsedData = JSON.parse(data);
          if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta) {
            const content = parsedData.choices[0].delta.content || "";

            // 检查是否需要创建新的模型回复气泡
            if (!modelResponse || modelResponse.dataset.finished === "true") {
              // 创建新的模型回复气泡
              modelResponse = document.createElement('div');
              modelResponse.className = 'chat-bubble model-bubble';
              modelResponse.dataset.rawContent = ""; // 临时存储 Markdown 内容
              modelResponse.dataset.finished = "false"; // 标记为未完成
              chatHistory.appendChild(modelResponse);
            }

            // 累积 Markdown 内容（不要直接更新 innerHTML）
            modelResponse.dataset.rawContent += content;
            modelResponse.innerHTML = marked.parse(modelResponse.dataset.rawContent.trim());

            chatHistory.scrollTop = chatHistory.scrollHeight;
          }
        } catch (err) {
          console.error("解析数据时出错：", err);
        }
      }
    });

    // 完成后标记模型的回复气泡
    if (modelResponse) {
      modelResponse.dataset.finished = "true";
      const modelTimestampSpan = document.createElement('span');
      modelTimestampSpan.className = 'timestamp';
      modelTimestampSpan.textContent = ` ${timestamp}`;
      modelResponse.appendChild(modelTimestampSpan);
    }

  } catch (error) {
    // 处理网络或请求错误
    loadingMessage.remove();
    const errorMessage = document.createElement('div');
    errorMessage.className = 'chat-bubble error-bubble';
    errorMessage.textContent = `错误：无法连接到模型，请稍后再试。`;
    chatHistory.appendChild(errorMessage);
    console.error("详细错误信息：", error);
  }

  chatHistory.scrollTop = chatHistory.scrollHeight;
}








