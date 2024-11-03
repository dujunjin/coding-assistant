export async function sendMessageToModel(message) {
  // 模拟与大模型的交互，返回模型响应
  const response = await fetch('/model-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  
  const data = await response.json();
  return data.reply;  // 假设模型返回的响应字段为 'reply'
}
