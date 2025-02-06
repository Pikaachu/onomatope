document.addEventListener("DOMContentLoaded", function () {
	// DOM Elements
	const container = document.getElementById("card-container");
	const categoryList = document.getElementById("category-list");
	const prevButton = document.getElementById("btn-prev");
	const nextButton = document.getElementById("btn-next");
	const explanationButton = document.querySelector('.btn-explanation');
	const volumeButton = document.querySelector('.fa-volume-low');
	const micIcon = document.querySelector('.fa-microphone');
	const explanationPopup = document.getElementById("explanation-popup");
	const popupOverlay = document.getElementById("popup-overlay");
	const favoriteButton = document.querySelector('.fa-heart');

	// Answer
	let currentAnswer;
  
	// Variables to track state
	let currentIndex = 0;
	let currentData = [];
	let isRecognizing = false;
	let lastCommandTime = 0;
	const cooldownTime = 500; // 500ms between commands initially
  
	// 音声認識　SET UP
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SpeechRecognition) {
	  alert("このブラウザーは音声認識をサポートしていません。");
	  return;
	}
	const recognition = new SpeechRecognition();
	recognition.lang = 'ja-JP';
	recognition.continuous = true;
	recognition.interimResults = true;
  
	// お気に入り　localStorage
	const favoriteList = JSON.parse(localStorage.getItem("favorites")) || [];
  
	// -----------------------------
	// Data Fetching and Carousel
	// -----------------------------
	function fetchData(categoryId = 0) {
	const xhr = new XMLHttpRequest();
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const category = urlParams.get('category')
	if (category) {
		categoryId = category;
	}
	  xhr.open("GET", `db_get_onomatope.php?category_id=${categoryId}`, true);
	  xhr.onload = function () {
		if (xhr.status === 200) {
		  try {
			const data = JSON.parse(xhr.responseText);
			currentData = data;
			currentIndex = 0; 
			displayData(data);
			updateCarousel();
			updateFavoriteButton();
		  } catch (e) {
			console.error("Error parsing JSON", e);
		  }
		} else {
		  console.error("Error fetching data", xhr.statusText);
		}
	  };
	  xhr.onerror = function () {
		console.error("Request failed");
	  };
	  xhr.send();
	}
  
	function displayData(data) {
	  container.innerHTML = "";
	  if (data && Array.isArray(data)) {
		data.forEach((item, index) => {
		  const card = document.createElement("div");
		  card.classList.add("card");
		  if (index === 0) card.classList.add("active");
		  card.innerHTML = `
			<div class="title" data-effect="${item.effect_path}">
			  <h1 id="onomatope-title">${item.name}</h1>
			  <span id="onomatope-romaji">(${item.name_romaji})</span>
			</div>
			<div class="image flex-box">
			  <img src="${item.image_path}" alt="${item.name}画像">
			</div>
		  `;
		  container.appendChild(card);
		});
	  }
	}
  
	function updateCarousel() {
	  const cards = document.querySelectorAll(".card");
	  cards.forEach((card, index) => {
		if (index === currentIndex) {
		  card.classList.add("active");
		} else {
		  card.classList.remove("active");
		}
	  });
	  document.getElementById('user-speech').textContent = '';    //テキストフィールドの空白にする
	  updateFavoriteButton();
	}
  
	// -----------------------------
	// お気に入り　ボタン
	// -----------------------------
	function updateFavoriteButton() {
	  // お気に入りのリストチェック
	  const currentItem = currentData[currentIndex];
	  if (currentItem && favoriteList.includes(currentItem.id)) {
		favoriteButton.style.color = "red"; // 入っている　＝　赤
	  } else {
		favoriteButton.style.color = ""; //　入ってない　＝　普通
	  }
	}
  
	favoriteButton.addEventListener("click", function () {
	  const currentItem = currentData[currentIndex];
	  if (!currentItem) return;
	  const itemId = currentItem.id;
	  const index = favoriteList.indexOf(itemId);
	  if (index > -1) {
		//　お気に入りから削除
		favoriteList.splice(index, 1);
	  } else {
		//　お気に入りに追加
		favoriteList.push(itemId);
	  }
	  localStorage.setItem("favorites", JSON.stringify(favoriteList));
	  updateFavoriteButton();
	});
  
	// -----------------------------
	// Explanation Popup
	// -----------------------------
	explanationButton.addEventListener("click", function () {
	  if (currentData.length > 0) {
		const item = currentData[currentIndex];
		document.getElementById('popup-title').textContent = `${item.name} の説明`;
		document.getElementById('popup-explanation').innerHTML = `
		  <strong>日本語説明:</strong> ${item.explanation_ja}<br><br>
		  <strong>English Explanation:</strong> ${item.explanation_en}
		`;
		explanationPopup.style.display = 'block';
		popupOverlay.style.display = 'block';
	  }
	});
  
	document.getElementById('close-explanation').addEventListener("click", closeExplanation);
	popupOverlay.addEventListener("click", closeExplanation);
	function closeExplanation() {
	  explanationPopup.style.display = 'none';
	  popupOverlay.style.display = 'none';
	}
  
	// -----------------------------
	// Carousel Navigation Buttons
	// -----------------------------
	categoryList.addEventListener("change", function () {
	  const selectedCategory = parseInt(categoryList.value, 10);
	  fetchData(selectedCategory);
	});
  
	prevButton.addEventListener("click", function () {
	  const dataLength = container.children.length;
	  currentIndex = (currentIndex - 1 + dataLength) % dataLength;
	  updateCarousel();
	  let cardActive = document.querySelectorAll(".card.active");
	  currentAnswer = hiraganaToKatagana(cardActive[0].querySelector("h1").innerText);
	});
  
	nextButton.addEventListener("click", function () {
	  const dataLength = container.children.length;
	  currentIndex = (currentIndex + 1) % dataLength;
	  updateCarousel();
	  let cardActive = document.querySelectorAll(".card.active");
	  currentAnswer = hiraganaToKatagana(cardActive[0].querySelector("h1").innerText);
	});
  
	// -----------------------------
	// 音声認識　＆　ボイスコマンド
	// -----------------------------
	micIcon.addEventListener('click', function () {
		
	  if (isRecognizing) {
		recognition.stop();
	  } else {
		recognition.start();
		// Answer
		let cardActive = document.querySelectorAll(".card.active");
		currentAnswer = hiraganaToKatagana(cardActive[0].querySelector("h1").innerText);
	  }
	  isRecognizing = !isRecognizing;
  
	  // マイクONカラー
	  if (isRecognizing) {
		micIcon.style.backgroundColor = "#d1e7dd";
		micIcon.classList.add('playing');
	  } else {
		micIcon.style.backgroundColor = "#f0f0f0";
		micIcon.classList.remove('playing');
	  }
	});
  
	recognition.onstart = function () {
	  console.log('Voice recognition started.');
	};
  
	recognition.onend = function () {
	  console.log('Voice recognition ended.');
	};
  
	recognition.onresult = function (event) {
	  const currentTime = Date.now();
	  if (currentTime - lastCommandTime < cooldownTime) return;
  
	  const resultIndex = event.results.length - 1;
	  const transcript = event.results[resultIndex][0].transcript.trim();
	  const isFinal = event.results[resultIndex].isFinal;
  
	  if (isFinal) {
		document.getElementById('user-speech').textContent = transcript;
		let userAnswer = hiraganaToKatagana(transcript);
  
		// Command parsing (using simple substring matching)
		if (transcript.includes("次")) {
		  nextButton.click();
		} else if (transcript.includes("前")) {
		  prevButton.click();
		} else if (transcript.includes("戻る") || transcript.includes("ホーム")) {
		  window.location.href = "index.php";
		} else if (transcript.includes("聴く") || transcript.includes("聞く") || transcript.includes("音声") || userAnswer.includes(currentAnswer)) {
		  // Toggle audio playback
		  btn.click();
		} else if (transcript.includes("止める") || transcript.includes("とめる") || transcript.includes("停止")) {
		  stopAudio();
		} else if (transcript.includes("説明") || transcript.includes("意味")) {
		  explanationButton.click();
		} else if (transcript.includes("お気に入り") || transcript.includes("お気に入り追加")) {
		  // Toggle favorites for current item
		  const currentItem = currentData[currentIndex];
		  if (currentItem) {
			const itemId = currentItem.id;
			const idx = favoriteList.indexOf(itemId);
			if (idx === -1) {
			  favoriteList.push(itemId);
			} else {
			  favoriteList.splice(idx, 1);
			}
			localStorage.setItem("favorites", JSON.stringify(favoriteList));
			updateFavoriteButton();
		  }
		}
		  else if (transcript.includes("閉じる") || transcript.includes("説明を閉じる")) {
			closeExplanation();
		  }
		lastCommandTime = currentTime;
	  }
	};
  
	// -----------------------------
	// マイク　CSS
	// -----------------------------
	const micStyle = document.createElement("style");
	micStyle.textContent = `
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
	  .fa-microphone.playing {
		/* Optionally, add extra styles when active */
		box-shadow: 0 0 8px rgba(0,0,0,0.2);
	  }
	  .fa-volume-low.playing {
		color: red;
	  }
	`;
	document.head.appendChild(micStyle);
  
	// -----------------------------
	// Initial Data Fetch
	// -----------------------------
	fetchData();
	
  });
  
  function hiraganaToKatagana(input) {
    return input.replace(/[ぁ-ん]/g, (match) => {
        // ひらがなをカタカナに変換
        return String.fromCharCode(match.charCodeAt(0) + 0x60);
    });
}