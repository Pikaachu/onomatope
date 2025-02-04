document.addEventListener("DOMContentLoaded", function () {
    const imgBox = document.querySelector(".img-box");
    const nextButton = document.getElementById("btn-next");
    const userSpeechElement = document.getElementById("user-speech");
    const microphoneIcon = document.querySelector(".fa-microphone");
    const dynamicText = document.getElementById("dynamic-text");

    let currentIndex = 0;
    let imageData = []; // Store image data

    function fetchData() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `db_get_onomatope.php`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    imageData = JSON.parse(xhr.responseText);
                    displayImage(imageData[currentIndex]);
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

    function displayImage(image) {
        imgBox.innerHTML = "";
        userSpeechElement.textContent = "";

        if (image && image.image_path) {
            const imgElement = document.createElement("img");
            imgElement.src = image.image_path;
            imgElement.alt = "Onomatopoeia Image";
            imgElement.style.width = "100%";
            imgElement.style.height = "auto";
            imgBox.appendChild(imgElement);
            dynamicText.textContent = "Try to guess the onomatopoeia!";
        } else {
            console.error("No image data found.");
        }
    }

    function loadNextImage() {
        currentIndex = (currentIndex + 1) % imageData.length;
        displayImage(imageData[currentIndex]);
    }

    nextButton.addEventListener("click", loadNextImage);

    fetchData();

    // normalize Hiragana and Katakana
    function normalizeToHiragana(input) {
        return input.replace(/[\u30A1-\u30F6]/g, function (char) {
            return String.fromCharCode(char.charCodeAt(0) - 0x60);
        });
    }

    // Speech recognition
    if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "ja-JP";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        microphoneIcon.addEventListener("click", function () {
            recognition.start();
            microphoneIcon.classList.add("listening");
            console.log("Speech recognition started...");
        });

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log("User said:", transcript);
            userSpeechElement.textContent = transcript;

            // 全部ひらがなに変更
            const normalizedUserInput = normalizeToHiragana(transcript);
            const correctOnomatopoeia = imageData[currentIndex]?.name;
            const normalizedCorrectAnswer = correctOnomatopoeia
                ? normalizeToHiragana(correctOnomatopoeia)
                : "";

            // 不正解チェック
            if (normalizedCorrectAnswer && normalizedUserInput === normalizedCorrectAnswer) {
                dynamicText.textContent = "正解です!";
                dynamicText.style.color = "green";
            } else {
                dynamicText.textContent = "残念!";
                dynamicText.style.color = "red";
            }

            if (transcript === "次") {
                loadNextImage();
            }
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = function () {
            microphoneIcon.classList.remove("listening");
            console.log("音声認識停止されました");
        };
    } else {
        console.warn("音声認識APIが応用されていません。");
    }
});
