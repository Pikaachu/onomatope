document.addEventListener("DOMContentLoaded", function () {
    const imgBox = document.querySelector(".img-box");
    const nextButton = document.getElementById("btn-next");
    const userSpeechElement = document.getElementById("user-speech");
    const microphoneIcon = document.querySelector(".fa-microphone");
    const dynamicText = document.getElementById("dynamic-text");
    const resultDiv = document.getElementById('result');
    const emoteImage = document.getElementById("emote");

    let currentIndex = 0;
    let imageData = [];

    // Fetch and display image data
    async function fetchData() {
        try {
            const response = await fetch("../db_get_onomatope.php");
            if (!response.ok) throw new Error("Failed to fetch data");
            imageData = await response.json();
            if (imageData.length > 0) displayImage(imageData[currentIndex]);
        } catch (error) {
            console.error("Error fetching or parsing image data:", error);
        }
    }

    // Display image
    function displayImage(image) {
        imgBox.innerHTML = "";
        userSpeechElement.textContent = "";
        dynamicText.textContent = "Try to guess the onomatopoeia!";
        dynamicText.style.color = "black";

        if (image && image.image_path) {
            const imgElement = document.createElement("img");
            imgElement.src = "../" + image.image_path;
            imgElement.alt = "Onomatopoeia Image";
            imgElement.style.width = "100%";
            imgElement.style.height = "auto";
            imgBox.appendChild(imgElement);
        } else {
            console.error("Invalid or missing image data.");
        }
    }

    // Load next image
    function loadNextImage() {
        if (imageData.length > 0) {
            currentIndex = (currentIndex + 1) % imageData.length;
            displayImage(imageData[currentIndex]);
        }
    }

    nextButton.addEventListener("click", loadNextImage);
    fetchData();

    // Normalize Hiragana and Katakana
    function normalizeToHiragana(input) {
        return input.replace(/[\u30A1-\u30F6]/g, char =>
            String.fromCharCode(char.charCodeAt(0) - 0x60)
        );
    }

    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        microphoneIcon.addEventListener("click", () => {
            recognition.start();
            microphoneIcon.classList.add("listening");
            console.log("Speech recognition started...");
        });

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript.trim();
            userSpeechElement.textContent = transcript;

            const normalizedUserInput = normalizeToHiragana(transcript);
            const correctOnomatopoeia = imageData[currentIndex]?.name || "";
            const normalizedCorrectAnswer = normalizeToHiragana(correctOnomatopoeia);

            // Check for correct answer
            if (normalizedUserInput === normalizedCorrectAnswer) {
                dynamicText.textContent = "正解です!";
                dynamicText.style.color = "green";
                emoteImage.src = "../images/sarasara.jpg";
            } else {
                dynamicText.textContent = "残念!";
                dynamicText.style.color = "red";
                emoteImage.src = "../images/zaza.jpg";
            }

            // Send transcript to backend for emotion detection
            try {
                const response = await fetch('/emotion_detection', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transcript }),
                });
                const data = await response.json();

                if (data.Dominant) {
                    const emotion = data.Dominant.Emotion;
                    resultDiv.innerHTML = `<p>Dominant Emotion: ${emotion} (${data.Dominant.Percentage})</p>`;


                    // Respond based on emotion
                    if (emotion === "Happiness") {
                        dynamicText.textContent = "Great job! Keep going!";
                        dynamicText.style.color = "blue";
                    } else if (emotion === "Sadness") {
                        dynamicText.textContent = "Don't worry, you can do it!";
                        dynamicText.style.color = "orange";
                    }
                } else {
                    resultDiv.innerHTML = "<p>Unable to detect emotion.</p>";
                }
            } catch (error) {
                console.error("Error sending data to server:", error);
                resultDiv.innerHTML = "<p>Error processing emotion detection.</p>";
            }

            // Automatically load next image on "次"
            if (normalizedUserInput === "次") loadNextImage();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            microphoneIcon.classList.remove("listening");
            console.log("Speech recognition stopped");
        };
    } else {
        console.warn("Speech recognition API not supported.");
    }
});
