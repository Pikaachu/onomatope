<!DOCTYPE html>
<html lang="ja">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>ペラペラオノマトペ</title>
	<!-- fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700;800;900&display=swap"
		rel="stylesheet">
	<!-- css -->
	<link rel="stylesheet" href="css/style.css">
	<style>
		#explanation-popup {
			display: none;
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: var(--primary-yellow);
			border: 10px solid var(--primary-dark);
			border-radius: 20px;
			width: 80%;
			max-width: 600px;
			padding: 20px;
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
			z-index: 1000;
			text-align: center;
		}

		#explanation-popup h2 {
			color: var(--primary-blue);
			margin-bottom: 15px;
		}

		#explanation-popup p {
			line-height: 1.6;
			margin-bottom: 15px;
		}

		#close-explanation {
			background-color: var(--primary-blue);
			color: white;
			border: none;
			padding: 10px 20px;
			border-radius: 15px;
			cursor: pointer;
			transition: background-color 0.3s;
		}

		#close-explanation:hover {
			background-color: var(--light-blue);
		}

		/* Overlay for popup */
		#popup-overlay {
			display: none;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(77, 77, 77, 0.5);
			z-index: 999;
		}
	</style>
</head>

<body class="flex-box" id="flash-card">
	<main class="flex-box">
		<div class="wrapper flex-box">
			<div class="title">
				<h1 id="onomatope-title">きらきら</h1>
				<span id="onomatope-romaji">(Kira Kira)</span>
			</div>

			<div class="image flex-box">
				<button class="btn-pre flex-box"><i class="fa-solid fa-caret-left"></i></button>
				<img src="images/kirakira.jpg" alt="キラキラ画像">
				<button class="btn-next flex-box"><i class="fa-solid fa-caret-right"></i></button>
			</div>
			
			<div class="text flex-box">
				<div class="box">
					<i class="fa-solid fa-microphone"></i>
					<span id="user-speech">きらきら</span>
				</div>
			</div>
		</div>
	</main>

	<!-- 説明　Pop Up -->
	<div id="popup-overlay"></div>
	<div id="explanation-popup">
		<h2 id="popup-title">きらきら (Kira Kira) の説明</h2>
		<p id="popup-explanation">
			「きらきら」は、輝く、光り輝く様子を表現する擬音語です。キラキラと光る宝石、晴れた日の太陽、きらめく星など、まぶしく輝く様子を生き生きと描写します。
		</p>
		<button id="close-explanation">閉じる</button>
	</div>

	<!-- buttons -->
	 <a href="index.php" class="btn btn-top btn-left btn-control btn-round flex-box"><i class="fa-solid fa-house"></i></a>
	 <button class="btn btn-top btn-right btn-control btn-round"><i class="fa-solid fa-volume-low"></i></button>
	 <button class="btn btn-bottom btn-left btn-control btn-explanation">説明</button>
	 <button class="btn btn-bottom btn-right btn-control btn-round"><i class="fa-solid fa-heart"></i></button>

	<!-- Audio -->
	<audio id="onomatope-audio">
		<source src="audio/キラキラ.mp3" type="audio/mpeg">
		お使いのブラウザは音声再生に対応していません。
	</audio>

	<!-- js -->
	<script src="https://kit.fontawesome.com/9670cd3151.js" crossorigin="anonymous"></script>
	<script>
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const onomatopeData = {
    'きらきら': {
        explanation: '「きらきら」は、輝く、光り輝く様子を表現する擬音語です。キラキラと光る宝石、晴れた日の太陽、きらめく星など、まぶしく輝く様子を生き生きと描写します。',
        audio: 'audio/キラキラ.mp3'
    },
    // Add more onomatopoeia entries here
};

if (SpeechRecognition) {
    let recognition;
    let isRecognizing = false;

    const homeBtn = document.querySelector(".btn-top.btn-left");
    const soundBtn = document.querySelector(".btn-top.btn-right");
    const explanationBtn = document.querySelector(".btn-bottom.btn-left");
    const favoriteBtn = document.querySelector(".btn-bottom.btn-right");
    const explanationPopup = document.getElementById('explanation-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const closeExplanationBtn = document.getElementById('close-explanation');
    const audioElement = document.getElementById('onomatope-audio');
    const speechIcon = document.querySelector(".fa-microphone");
    const userSpeechSpan = document.getElementById("user-speech");

    let currentWord = document.getElementById('onomatope-title').textContent;

    // Popup and Audio Management
    explanationBtn.addEventListener('click', showExplanation);

    function showExplanation() {
        const currentData = onomatopeData[currentWord];
        if (currentData) {
            document.getElementById('popup-title').textContent = `${currentWord} の説明`;
            document.getElementById('popup-explanation').textContent = currentData.explanation;
            explanationPopup.style.display = 'block';
            popupOverlay.style.display = 'block';
        }
    }

    function closeExplanation() {
        explanationPopup.style.display = 'none';
        popupOverlay.style.display = 'none';
        userSpeechSpan.textContent = '説明を閉じました';
    }

    closeExplanationBtn.addEventListener('click', closeExplanation);
    popupOverlay.addEventListener('click', closeExplanation);

    // Enhanced Audio Playback Functions
    function playAudio() {
        const currentData = onomatopeData[currentWord];
        if (currentData && currentData.audio) {
            audioElement.src = currentData.audio;
            audioElement.play();
            userSpeechSpan.textContent = '音声を再生します';
            soundBtn.classList.add('playing');
        } else {
            alert('この擬音語の音声は利用できません。');
        }
    }

    function stopAudio() {
        if (!audioElement.paused) {
            audioElement.pause();
            audioElement.currentTime = 0;
            userSpeechSpan.textContent = '音声を停止しました';
            soundBtn.classList.remove('playing');
        }
    }
    audioElement.addEventListener('ended', () => {
        soundBtn.classList.remove('playing');
    });

    soundBtn.addEventListener('click', () => {
        if (audioElement.paused) {
            playAudio();
        } else {
            stopAudio();
        }
    });

    // お気に入り
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let isFavorite = favorites.includes(currentWord);

    function updateFavoriteButton() {
        favoriteBtn.style.color = isFavorite ? 'red' : 'white';
    }

    function toggleFavorite() {
        isFavorite = !isFavorite;
        
        if (isFavorite) {
            if (!favorites.includes(currentWord)) {
                favorites.push(currentWord);
            }
        } else {
            const index = favorites.indexOf(currentWord);
            if (index > -1) {
                favorites.splice(index, 1);
            }
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteButton();
        userSpeechSpan.textContent = isFavorite ? 'お気に入りに追加しました' : 'お気に入りから削除しました';
    }

    favoriteBtn.addEventListener('click', toggleFavorite);
    updateFavoriteButton();

    // 音声認識
    function startVoiceRecognition() {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'ja-JP';

        recognition.onstart = () => {
            isRecognizing = true;
            userSpeechSpan.textContent = "リスニング中...";
            speechIcon.style.backgroundColor = "#ffcccb";
        };

        recognition.onresult = (event) => {
            const command = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
            userSpeechSpan.textContent = `認識されたコマンド: ${command}`;

            // Check popup state
            if (explanationPopup.style.display === 'block') {
                if (command.includes('閉じる') || command.includes('とじる')) {
                    closeExplanation();
                    return;
                }
            }

            //　ボイスコマンド
            if (command.includes('音声') || command.includes('聞く')) {
                playAudio();
            } else if (command.includes('止める') || command.includes('とめる') || command.includes('停止')) {
                stopAudio();
            } else if (command.includes('説明')) {
                showExplanation();
            } else if (command.includes('お気に入り')) {
                toggleFavorite();
            } else if (command.includes('ホーム') || command.includes('もどる')) {
                window.location.href = 'index.php';
            }
        };

        recognition.onerror = (event) => {
            console.error(`Error: ${event.error}`);
            userSpeechSpan.textContent = `エラー: ${event.error}`;
            speechIcon.style.backgroundColor = "#f0f0f0";
        };

        recognition.onend = () => {
            if (isRecognizing) {
                recognition.start();
            } else {
                speechIcon.style.backgroundColor = "#f0f0f0";
            }
        };

        recognition.start();
    }

    function stopVoiceRecognition() {
        isRecognizing = false;
        if (recognition) {
            recognition.stop();
        }
        userSpeechSpan.textContent = "音声認識を停止しました";
        speechIcon.style.backgroundColor = "#f0f0f0";
    }

    // マイクボタン
    speechIcon.addEventListener("click", () => {
        if (!isRecognizing) {
            startVoiceRecognition();
        } else {
            stopVoiceRecognition();
        }
    });

} else {
    alert("このブラウザーは音声認識をサポートしていません。");
}

// マイク　CSS
const style = document.createElement("style");
style.textContent = `
    .fa-microphone {
        background-color: #f0f0f0; 
        border-radius: 50%;
        padding: 10px; 
        cursor: pointer; 
        transition: background-color 0.3s; 
    }
    .fa-microphone:hover {
        background-color: #d1e7dd;
    }
    .btn-top.btn-right.playing {
        color: red;
    }
`;
document.head.appendChild(style);
	</script>
</body>
</html>