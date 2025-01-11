const botToken = '7794927171:AAHFulaQUvtJPAo3uyZ85kBgplvSJuouahk'; // Replace with your bot token
const chatId = '412522706';     // Replace with your Telegram user ID

// Function to send a message to Telegram
function sendMessageToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Message sent successfully:', data);
            } else {
                console.error('Error sending message:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Example usage when the game starts
function onGameStart() {
    let userInfo = getUserInfo();
    const message = `Game started!\nDevice Info:\nUser Agent: ${userInfo.userAgent}\nPlatform: ${userInfo.platform}\nLanguage: ${userInfo.language}\nMemory: ${userInfo.deviceMemory}\nCores: ${userInfo.hardwareConcurrency}\nResolution: ${userInfo.screenResolution}\nTimezone: ${userInfo.timezone}\nCookies Enabled: ${userInfo.cookieEnabled}`;
    sendMessageToTelegram(message);
}

// Example usage when the game finishes
function onGameFinish(result) {
    let userInfo = getUserInfo();
    const message = `Game Finished with score: ${result}!\nDevice Info:\nUser Agent: ${userInfo.userAgent}\nPlatform: ${userInfo.platform}\nLanguage: ${userInfo.language}\nMemory: ${userInfo.deviceMemory}\nCores: ${userInfo.hardwareConcurrency}\nResolution: ${userInfo.screenResolution}\nTimezone: ${userInfo.timezone}\nCookies Enabled: ${userInfo.cookieEnabled}`;
    sendMessageToTelegram(message);
}

function onGamePrize(result) {
    let userInfo = getUserInfo();
    const message = `Game Prize: ${result}!\nDevice Info:\nUser Agent: ${userInfo.userAgent}\nPlatform: ${userInfo.platform}\nLanguage: ${userInfo.language}\nMemory: ${userInfo.deviceMemory}\nCores: ${userInfo.hardwareConcurrency}\nResolution: ${userInfo.screenResolution}\nTimezone: ${userInfo.timezone}\nCookies Enabled: ${userInfo.cookieEnabled}`;
    sendMessageToTelegram(message);
}


function getUserInfo() {
    const userInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        deviceMemory: navigator.deviceMemory || 'Not available',
        hardwareConcurrency: navigator.hardwareConcurrency || 'Not available',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
    };

    return userInfo;
}
