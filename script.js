document.addEventListener('DOMContentLoaded', () => {
    const voiceToggle = document.getElementById('voice-toggle');
    const voiceStatus = document.getElementById('voice-status');
    const links = {
        'わくわく': 'card.php',
        'わくわくコース': 'card.php',
        'ドキドキ': '#dokidoki',
        'ドキドキことば': '#dokidoki',
        'コツコツ': 'quiz.php',
        'コツコツクイズ': 'quiz.php'
    };

    if (!('webkitSpeechRecognition' in window)) {
        voiceToggle.style.display = 'none';
        voiceStatus.textContent = 'browser doesnt support web speech api';
        return;
    }

    let recognition;

    function startVoiceRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false; 
        recognition.interimResults = false; 
        recognition.lang = 'ja-JP';

        recognition.onstart = () => {
            voiceToggle.textContent = '音声コマンドをオフ';
            voiceToggle.classList.add('listening');
            voiceStatus.textContent = '音声認識中...';
        };

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.trim();
            voiceStatus.textContent = `認識されたコマンド: ${command}`;
            console.log('認識されたコマンド:', command); 

            for (const [keyword, url] of Object.entries(links)) {
                // Check for exact match or if command contains the keyword
                if (command === keyword || command.includes(keyword)) {
                    voiceStatus.textContent = `「${keyword}」が検出されました。`;
                    console.log('Navigating to:', url); // Add console log for debugging
                    window.location.href = url;
                    return;
                }
            }

            voiceStatus.textContent = 'コマンドが見つかりませんでした。';
        };

        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            voiceStatus.textContent = `エラーが発生しました: ${event.error}`;
            stopVoiceRecognition();
        };

        recognition.onend = () => {
            voiceStatus.textContent = '音声認識が停止しました。';
            voiceToggle.textContent = '音声コマンドをオン';
            voiceToggle.classList.remove('listening');
        };

        recognition.start();
    }

    function stopVoiceRecognition() {
        if (recognition) {
            recognition.stop();
        }
        voiceToggle.textContent = '音声コマンドをオン';
        voiceToggle.classList.remove('listening');
        voiceStatus.textContent = '音声認識が停止しました。';
    }

    voiceToggle.addEventListener('click', () => {
        if (voiceToggle.textContent.includes('オフ')) {
            stopVoiceRecognition();
        } else {
            startVoiceRecognition();
        }
    });
});
