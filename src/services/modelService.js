import fetchSSE from '../utils/fetchSSE';
import { marked } from 'marked';

const apiKey = process.env.API_KEY;
let controller; // 定义控制器
// 全局变量，用于管理正常回复和重新回复的气泡 ID
const globalState = {
  currentModelBubbleId: null, // 正常回复的气泡 ID
  retryBubbleId: null,        // 重新回复的气泡 ID
};
let originalUserInput = null;  // 原始用户输入

export async function sendMessageToModel(message, onUserMessage, onModelMessage, setIsSending, isRetry = false) {
  controller = new AbortController(); // 创建控制器实例
  const { signal } = controller;
  console.log("Creating new AbortController", controller);
  const timestamp = new Date().toLocaleTimeString();
  const userBubbleId = Date.now();

  // 显示用户的消息（只在正常回复时显示）
  if (!isRetry) {
    onUserMessage({ role: 'user', content: message, timestamp, loading: false, id: userBubbleId });
    originalUserInput = message; // 更新 originalUserInput 为最新的用户输入
    globalState.retryBubbleId = null; // 清除之前的重试气泡 ID
  }

  // 根据是否为重试决定气泡处理
  let modelBubbleId = null;
  let loadingBubbleId = null;
  let isFirstUpdate = true; // 标志，用于控制只清除一次“重新回复中...”的内容
  loadingBubbleId = Date.now() + 1;

  if (isRetry) {
    // 重试情况下复用 retryBubbleId，并显示“重新回复中…”
    modelBubbleId = globalState.retryBubbleId;
    console.log("second : ", modelBubbleId);
    onModelMessage({ role: 'model', content: '', loading: false, id: modelBubbleId});
    onModelMessage({ role: 'system', content: '重新回复中...', timestamp: '', loading: true, id: modelBubbleId });
  } else {
    // 正常情况下创建新的“模型正在思考中…”气泡
    onModelMessage({ role: 'system', content: '模型正在思考中...', timestamp: '', loading: true, id: loadingBubbleId });
  }

  let modelResponseContent = "";

  try {
    setIsSending(true); // 设置发送中状态
    await fetchSSE('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        stream: true,
      }),
      signal,
      onMessage: (data) => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta) {
            const content = parsedData.choices[0].delta.content || "";
            modelResponseContent += content;

            if ((isRetry&&isFirstUpdate))
            {
              onModelMessage({ role: 'system', content: '', loading: false, id: modelBubbleId});
              isFirstUpdate = false; // 设置标志，确保只清除一次
            }
            else if(!modelBubbleId)
            {
              onModelMessage({ role: 'system', content: '', loading: false, id: loadingBubbleId });
              modelBubbleId = loadingBubbleId;
            }

            // if (isRetry && isFirstUpdate) {
            //   // 清除“重新回复中…”的内容并显示新内容
            //   onModelMessage({ role: 'system', content: '', loading: false, id: modelBubbleId });
            //   isFirstUpdate = false; // 设置标志，确保只清除一次
            // } else if (!modelBubbleId) {
            //   // 正常回复的情况下，首次接收数据时替换“模型正在思考中…”气泡
            //   modelBubbleId = loadingBubbleId; // 使用 loadingBubbleId 作为最终模型气泡 ID
            //   globalState.currentModelBubbleId = modelBubbleId; // 更新 currentModelBubbleId
            // }
            
            // 更新气泡内容为当前模型响应
            onModelMessage({
              role: 'model',
              content: marked.parse(modelResponseContent),
              timestamp: timestamp,
              loading: true,
              id: modelBubbleId,
            });
          }
        } catch (err) {
          console.error("解析数据时出错：", err);
        }
      }
    });

    // 响应完成后更新模型的最终消息并移除加载状态
    if (modelBubbleId) {
      const finalContent = marked.parse(modelResponseContent.trim());
      const contentWithButton = `${finalContent.trim()}${generateButtonHTML(modelBubbleId).trim()}`;
      onModelMessage({
        role: 'model',
        content: contentWithButton,
        timestamp: timestamp,
        loading: false,
        id: modelBubbleId,
      });
      bindButtonEvents(modelBubbleId, modelResponseContent, onModelMessage, setIsSending);

      // 仅在正常回复时，保存气泡 ID 为 retryBubbleId
      if (!isRetry) {
        globalState.retryBubbleId = modelBubbleId;
        console.log("first : ", modelBubbleId);
      }
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      onModelMessage({ role: 'system', content: '请求已中断', timestamp: '' });
    } else {
      onModelMessage({ role: 'error', content: '错误：无法连接到模型', timestamp });
    }
  }finally {
    setIsSending(false); // 请求完成后设置为未发送状态
  }
}

// 新增 cancelMessage 函数，用于中断请求
export function cancelMessage() {
  if (controller) controller.abort();
}



// 生成按钮 HTML 的辅助函数
function generateButtonHTML(id) {
  return `
    <div class="button-container" id="button-container-${id}">
      <button class="copy-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_406_3945)">
        <path d="M16.8602 5H12.0002V0.016L16.8602 5ZM10.0002 7V0H5.00015C4.2045 0 3.44144 0.31607 2.87883 0.87868C2.31622 1.44129 2.00015 2.20435 2.00015 3V19H17.0002V7H10.0002ZM19.0002 7.01V21.038H7.00015V24H22.0002V10L19.0002 7.01Z" fill="#374957"/>
        </g>
        <defs>
        <clipPath id="clip0_406_3945">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      </button>
      <button class="favorite-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_406_2240)">
        <path d="M14.7618 11.5869C14.2152 11.8981 13.6192 12.1132 12.9998 12.2229V23.8739C13.5269 23.7713 14.0336 23.5832 14.4998 23.3169L20.5268 19.8379C21.286 19.3978 21.9164 18.7662 22.355 18.0062C22.7937 17.2462 23.0254 16.3844 23.0268 15.5069V8.54693C23.0236 8.01274 22.9342 7.48257 22.7618 6.97693L14.7618 11.5869Z" fill="#374957"/>
        <path d="M10.242 9.8569C10.7775 10.165 11.3846 10.3271 12.0024 10.3271C12.6203 10.3271 13.2274 10.165 13.7629 9.8569L21.763 5.2469C21.4086 4.83978 20.9905 4.49293 20.525 4.2199L14.5 0.736897C13.7394 0.299519 12.8773 0.0693359 12 0.0693359C11.1226 0.0693359 10.2605 0.299519 9.49995 0.736897L3.47295 4.2169C3.024 4.47979 2.61908 4.81149 2.27295 5.1999L10.242 9.8569Z" fill="#374957"/>
        <path d="M11 12.2232C10.3802 12.1138 9.78389 11.8986 9.23699 11.5872L1.25699 6.92322C1.07232 7.4449 0.976324 7.99382 0.972992 8.54722V15.5072C0.974454 16.3847 1.20609 17.2465 1.64478 18.0065C2.08347 18.7665 2.71386 19.3981 3.47299 19.8382L9.49999 23.3172C9.96626 23.5835 10.473 23.7716 11 23.8742V12.2232Z" fill="#374957"/>
        </g>
        <defs>
        <clipPath id="clip0_406_2240">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      </button>
      <button class="retry-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_405_1548)">
        <path d="M3.08615 10.6841C3.8103 5.76306 8.3866 2.36083 13.3076 3.08498C14.9866 3.33203 16.5615 4.04842 17.8511 5.15163L16.6902 6.31251C16.3011 6.7017 16.3012 7.33267 16.6905 7.72176C16.8773 7.90851 17.1306 8.01347 17.3948 8.01351H21.9647C22.515 8.01351 22.9611 7.56739 22.9611 7.01705V2.44715C22.961 1.89681 22.5148 1.45077 21.9644 1.45087C21.7003 1.45091 21.4469 1.55587 21.2601 1.74262L19.9646 3.03803C15.0245 -1.36557 7.44996 -0.930701 3.04635 4.00937C1.48628 5.75947 0.473881 7.92878 0.134578 10.2486C0.000799559 11.071 0.559034 11.8462 1.38141 11.98C1.4555 11.992 1.53033 11.9985 1.60539 11.9994C2.3578 11.9913 2.98937 11.4303 3.08615 10.6841Z" fill="#374957"/>
        <path d="M22.3939 11.9992C21.6415 12.0073 21.0099 12.5684 20.9131 13.3146C20.189 18.2356 15.6127 21.6378 10.6917 20.9137C9.0127 20.6666 7.43773 19.9503 6.14815 18.8471L7.30904 17.6862C7.69814 17.297 7.69804 16.666 7.30881 16.2769C7.12201 16.0902 6.86866 15.9852 6.60451 15.9852H2.03471C1.48437 15.9852 1.03824 16.4313 1.03824 16.9816V21.5515C1.03838 22.1019 1.4846 22.5479 2.03494 22.5478C2.29909 22.5478 2.55244 22.4428 2.73924 22.2561L4.03465 20.9606C8.97356 25.3647 16.5476 24.9312 20.9517 19.9922C22.5126 18.2418 23.5255 16.0717 23.8647 13.7511C23.999 12.9287 23.4413 12.1532 22.619 12.0189C22.5446 12.0067 22.4693 12.0001 22.3939 11.9992Z" fill="#374957"/>
        </g>
        <defs>
        <clipPath id="clip0_405_1548">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      </button>      
    </div>
  `;
}

function bindButtonEvents(id, content, onModelMessage, setIsSending) {
  const copyButton = document.querySelector(`#button-container-${String(id)} .copy-button`);
  const retryButton = document.querySelector(`#button-container-${String(id)} .retry-button`);
  const favoriteButton = document.querySelector(`#button-container-${String(id)} .favorite-button`);

  // 处理复制按钮
  if (copyButton) {
    copyButton.addEventListener('click', () => {
      fallbackCopyTextToClipboard(content);
    });
  } else {
    console.warn('未找到 copyButton，检查选择器是否正确');
  }

  // 处理重试按钮
  if (retryButton) {
    retryButton.addEventListener('click', () => {
      if (originalUserInput) {
        // 设置发送状态为 true，表示开始发送请求
        setIsSending(true);

        // 调用 sendMessageToModel 函数，重试时传递 setIsSending
        sendMessageToModel(originalUserInput, null, onModelMessage, setIsSending, true);
      } else {
        console.error("未找到原始用户输入");
      }
    });
  }

  // 处理收藏按钮
  if (favoriteButton) {
    favoriteButton.addEventListener('click', () => {
      saveFavorite(content);
      alert('已收藏');
    });
  }
}


//复制功能的辅助函数
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    alert('已复制到剪贴板');
  } catch (err) {
    console.error('复制到剪贴板失败:', err);
    alert('复制失败，请手动复制');
  }
  document.body.removeChild(textArea);
}

// 收藏功能的辅助函数
function saveFavorite(content) {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(content);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
