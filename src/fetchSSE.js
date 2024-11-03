// src/model/fetchSSE.js

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
  
  // 导出 fetchSSE 函数
  export default fetchSSE;
  