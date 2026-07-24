import sys

with open('src/components/PipelineBuilder.tsx', 'r') as f:
    content = f.read()

target = '''  const triggerSimulatedWebhook = (targetPlat: string) => {
    const timeStr = new Date().toLocaleTimeString();
    const isSlack = webhookType === "slack";
    const serviceName = isSlack ? "Slack" : "Discord";
    const channelLabel = isSlack ? webhookChannel : `${webhookChannel} channel`;
    const msgText = isSlack
      ? `[${timeStr}] [incoming-webhook] Slack: Sent build-completed notification to ${webhookChannel} for ${targetPlat.toUpperCase()}`
      : `[${timeStr}] [incoming-webhook] Discord: Sent build-completed notification to channel ${webhookChannel} for ${targetPlat.toUpperCase()}`;
    
    setWebhookLogs(prev => [
      { time: timeStr, text: msgText, type: webhookType },
      ...prev
    ].slice(0, 5));
    showToast(isZh ? `${serviceName} 模拟通知已发送到 ${webhookChannel}！` : `${serviceName} simulated notification sent to ${webhookChannel}!`);
  };'''

replacement = '''  const triggerSimulatedWebhook = (targetPlat: string) => {
    const timeStr = new Date().toLocaleTimeString();
    let serviceName = "Slack";
    if (webhookType === "discord") serviceName = "Discord";
    if (webhookType === "teams") serviceName = "Teams";
    
    const msgText = `[${timeStr}] [incoming-webhook] ${serviceName}: Sent build-completed notification to ${webhookChannel} for ${targetPlat.toUpperCase()}`;
    
    setWebhookLogs(prev => [
      { time: timeStr, text: msgText, type: webhookType },
      ...prev
    ].slice(0, 5));
    showToast(isZh ? `${serviceName} 模拟通知已发送到 ${webhookChannel}！` : `${serviceName} simulated notification sent to ${webhookChannel}!`);
  };'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/PipelineBuilder.tsx', 'w') as f:
        f.write(content)
    print("Patched triggerSimulatedWebhook successfully!")
else:
    print("Target not found!")
