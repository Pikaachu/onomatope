document.addEventListener("DOMContentLoaded", function () {
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
	const categoryButton = document.getElementById("btn-category");
  
	let currentAnswer;
	let currentIndex = 0;
	let currentData = [];
	let isRecognizing = false;
	let lastCommandTime = 0;
	const cooldownTime = 500; // 500ms between commands
  
	// Setup Speech Recognition
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!SpeechRecognition) {
	  alert("このブラウザーは音声認識をサポートしていません。");
	  return;
	}
	const recognition = new SpeechRecognition();
	recognition.lang = 'ja-JP';
	recognition.continuous = true;
	recognition.interimResults = true;
	
	// -----------------------------
	// Favorite List
	// -----------------------------
	const favoriteList = JSON.parse(localStorage.getItem("favorites")) || [];
  
	// -----------------------------
	// User Speech
	// -----------------------------
	function updateUserSpeech(message) {
	  const userSpeechEl = document.getElementById('user-speech');
	  userSpeechEl.textContent = message;
	  setTimeout(() => {
		userSpeechEl.textContent = "";
	  }, 3000);
	}
  
	// -----------------------------
	// Data Fetch
	// -----------------------------
	function fetchData(categoryId = 0) {
	  const xhr = new XMLHttpRequest();
	  const queryString = window.location.search;
	  const urlParams = new URLSearchParams(queryString);
	  const category = urlParams.get('category');
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
	  document.getElementById('user-speech').textContent = ''; 
	  updateFavoriteButton();
	}
	
	// -----------------------------
	// お気に入り 色
	// -----------------------------
	function updateFavoriteButton() {
	  const currentItem = currentData[currentIndex];
	  if (currentItem && favoriteList.includes(currentItem.id)) {
		favoriteButton.style.color = "red";
	  } else {
		favoriteButton.style.color = "";
	  }
	}
	
	favoriteButton.addEventListener("click", function () {
	  const currentItem = currentData[currentIndex];
	  if (!currentItem) return;
	  const itemId = currentItem.id;
	  const index = favoriteList.indexOf(itemId);
	  if (index > -1) {
		favoriteList.splice(index, 1);
		updateUserSpeech("お気に入りから削除されました");
	  } else {
		favoriteList.push(itemId);
		updateUserSpeech("お気に入りに追加されました");
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
		updateUserSpeech("説明を表示します");
	  }
	});
	
	function closeExplanation() {
	  explanationPopup.style.display = 'none';
	  popupOverlay.style.display = 'none';
	  updateUserSpeech("説明を閉じます");
	}
	
	document.getElementById('close-explanation').addEventListener("click", closeExplanation);
	popupOverlay.addEventListener("click", closeExplanation);
	
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
	  const cardActive = document.querySelector(".card.active");
	  currentAnswer = hiraganaToKatagana(cardActive.querySelector("h1").innerText);
	  updateUserSpeech("前のカードに移動します");
	});
	
	nextButton.addEventListener("click", function () {
	  const dataLength = container.children.length;
	  currentIndex = (currentIndex + 1) % dataLength;
	  updateCarousel();
	  const cardActive = document.querySelector(".card.active");
	  currentAnswer = hiraganaToKatagana(cardActive.querySelector("h1").innerText);
	  updateUserSpeech("次のカードに移動します");
	});
	
	volumeButton.addEventListener("click", function () {
	  updateUserSpeech("音声を再生します");
	});
	
	categoryButton.addEventListener("click", function (e) {
	  e.preventDefault();
	  updateUserSpeech("カテゴリー画面に移動します");
	  // Delay navigation
	  setTimeout(() => {
		window.location.href = categoryButton.getAttribute("href");
	  }, 2000);
	});
	
	// -----------------------------
	// Voice Recognition & Commands
	// -----------------------------
	micIcon.addEventListener('click', function () {
	  if (!isRecognizing) {
		recognition.start();
		const cardActive = document.querySelector(".card.active");
		currentAnswer = hiraganaToKatagana(cardActive.querySelector("h1").innerText);
	  } else {
		recognition.stop();
	  }
	  isRecognizing = !isRecognizing;
	
	  // Update mic icon style
	  if (isRecognizing) {
		micIcon.style.backgroundColor = "#f79b99"; 
		micIcon.classList.add('playing');
	  } else {
		micIcon.style.backgroundColor = "#f0f0f0";
		micIcon.classList.remove('playing');
	  }
	});
	
	recognition.onstart = function () {
	  console.log('Voice recognition started.');
	document.getElementById('user-speech').textContent = "リスニング中...";
	};
	
	recognition.onend = function () {
	  console.log('Voice recognition ended.');
	  micIcon.style.backgroundColor = "#f0f0f0";
	  micIcon.classList.remove('playing');
	  isRecognizing = false;
	};
	
	recognition.onresult = function (event) {
	  let transcript = "";
	  for (let i = event.resultIndex; i < event.results.length; i++) {
		transcript += event.results[i][0].transcript;
	  }
	  document.getElementById('user-speech').textContent = transcript;
	
	  if (event.results[event.results.length - 1].isFinal) {
		const currentTime = Date.now();
		if (currentTime - lastCommandTime < cooldownTime) return;
		lastCommandTime = currentTime;
	
		let commandRecognized = false;
		const normalizedTranscript = transcript.trim();
		const userAnswer = hiraganaToKatagana(normalizedTranscript);
	
		if (normalizedTranscript.includes("次")) {
		  nextButton.click();
		  updateUserSpeech("次のカードに移動します");
		  commandRecognized = true;
		} else if (normalizedTranscript.includes("前")) {
		  prevButton.click();
		  updateUserSpeech("前のカードに移動します");
		  commandRecognized = true;
		} else if (normalizedTranscript.includes("戻る") || normalizedTranscript.includes("ホーム")) {
		  updateUserSpeech("ホームに戻ります");
		  commandRecognized = true;
		  window.location.href = "index.php";
		} else if (
		  normalizedTranscript.includes("聴く") ||
		  normalizedTranscript.includes("聞く") ||
		  normalizedTranscript.includes("音声") ||
		  userAnswer.includes(currentAnswer)
		) {
		  volumeButton.click();
		  updateUserSpeech("音声を再生します");
		  commandRecognized = true;
		} else if (
		  normalizedTranscript.includes("止める") ||
		  normalizedTranscript.includes("とめる") ||
		  normalizedTranscript.includes("停止")
		) {
		  stopAudio(); 
		  updateUserSpeech("音声を停止しました");
		  commandRecognized = true;
		} else if (
		  normalizedTranscript.includes("説明") ||
		  normalizedTranscript.includes("意味")
		) {
		  explanationButton.click();
		  updateUserSpeech("説明を表示します");
		  commandRecognized = true;
		} else if (
		  normalizedTranscript.includes("カテゴリー") ||
		  normalizedTranscript.includes("カテゴリ")
		) {
		  categoryButton.click();
		  updateUserSpeech("カテゴリー画面に移動します");
		  commandRecognized = true;
		} else if (
		  normalizedTranscript.includes("お気に入り") ||
		  normalizedTranscript.includes("お気に入り追加")
		) {
		  favoriteButton.click();
		  commandRecognized = true;
		} else if (
		  normalizedTranscript.includes("閉じる") ||
		  normalizedTranscript.includes("閉じて") ||
		  normalizedTranscript.includes("説明を閉じる")
		) {
		  closeExplanation();
		  updateUserSpeech("説明を閉じます");
		  commandRecognized = true;
		}
	
		if (!commandRecognized) {
		  updateUserSpeech("認識:" + normalizedTranscript);
		}
	  }
	};
	
	// -----------------------------
	// Mic & Volume Button CSS
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
	  return String.fromCharCode(match.charCodeAt(0) + 0x60);
	});
  }
  