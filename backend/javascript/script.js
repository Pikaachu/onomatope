document.addEventListener("DOMContentLoaded", function () {
    const imgBox = document.querySelector(".img-box");
    const nextButton = document.getElementById("btn-next");
    const userSpeechElement = document.getElementById("user-speech");
    const microphoneIcon = document.querySelector(".fa-microphone");







    const mic = document.querySelector(".mic-button");
    const voiceToggle = document.getElementById('voice-toggle');

    const dynamicText = document.getElementById("dynamic-text");
    const resultDiv = document.getElementById('result');
    const emoteImage = document.getElementById("emote");
    const percentEmo = document.getElementById("power");



    const socket = io.connect('http://localhost:5000');

    let currentIndex = 0;
    let imageData = [];
    let mediaRecorder;
    let audioChunks = [];

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
        percentEmo.textContent = "";
        resultDiv.textContent = `フィードバック:`;
        
        userSpeechElement.textContent = "";
        dynamicText.textContent = "オノマトペを当ててみて！";
        dynamicText.style.color = "black";
        dynamicText.style.fontWeight = "bold";
        dynamicText.style.fontSize = "24px";
        emoteImage.src = "../images/emotion/happy1.png";
     



        if (image && image.image_path) {
            const imgElement = document.createElement("img");
            imgElement.src = "../" + image.image_path;
            imgElement.alt = "Onomatopoeia Image";
            imgElement.style.width = "100%";
            imgElement.style.height = "auto";
            imgElement.style.borderRadius = "40px";

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

        // microphoneIcon.addEventListener("click", () => {
        //     recognition.start();
        //     microphoneIcon.classList.add("listening");
        //     console.log("Speech recognition started...");
        //     // Start recording audio for emotion detection
        //     startRecording();



        mic.addEventListener("click", () => {
            recognition.start();
            microphoneIcon.classList.add("listening");
            console.log("Speech recognition started...");


            voiceToggle.textContent = '音声コマンドをオフ';
            voiceToggle.classList.add('listening');

            startRecording();

        });

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript.trim();
            userSpeechElement.textContent = transcript;

            const normalizedUserInput = normalizeToHiragana(transcript);
            const correctOnomatopoeia = imageData[currentIndex]?.name || "";
            const normalizedCorrectAnswer = normalizeToHiragana(correctOnomatopoeia);

            // Check for correct answer
            socket.emit("check_word", {
                transcript: normalizedUserInput,
                correctWord: normalizedCorrectAnswer
            });

            // Automatically load next image on "次"
            if (normalizedUserInput === "次") loadNextImage();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            microphoneIcon.classList.remove("listening");
            console.log("Speech recognition stopped");
            // Stop audio recording

            voiceToggle.classList.remove('listening');
            voiceToggle.textContent = '音声コマンドをオン';
            stopRecording();
        };
    } else {
        console.warn("Speech recognition API not supported.");
    }

    // Audio recording setup for emotion detection
    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);  // Don't specify MIME type
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);  // Collect audio data as it's available
                };
                mediaRecorder.start();
            })
            .catch(err => {
                console.error('Error accessing audio stream:', err);
            });
    }



    //////////////////////////////////hint pop up////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////




    // Stop recording and send audio data to backend
    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });  // Use recorded MIME type
            const reader = new FileReader();
            reader.onload = () => {
                const audioData = reader.result;  // Get ArrayBuffer
                socket.emit('audio_chunk', audioData);  // Send to backend as ArrayBuffer
            };
            reader.readAsArrayBuffer(audioBlob);  // Ensure audio is read as ArrayBuffer
            audioChunks = [];  // Reset the chunks for the next recording
        }
    }

    // Socket listener for word correctness result
    socket.on('word_correctness_result', (data) => {

    const correctAudio = new Audio('sounds/correct.mp3');  
    const incorrectAudio = new Audio('sounds/incorrect.mp3');  
    correctAudio.volume = 1;
    incorrectAudio.volume = 0.6;


        if (data.result === "correct") {
            dynamicText.textContent = "正解です!";
            dynamicText.style.color = "green";
            dynamicText.style.fontSize = "40px";
            dynamicText.style.marginLeft = "40px";
            emoteImage.src = "../images/emotion/happy2.png";

            correctAudio.play();

        } else {
            dynamicText.textContent = "残念!";
            dynamicText.style.color = "red";
            dynamicText.style.fontSize = "40px";
            dynamicText.style.marginLeft = "40px";

            emoteImage.src = "../images/emotion/sad.png";

            incorrectAudio.play();
        }
    });

    // Socket listener for emotion result
    socket.on('emotion_result', (emotionData) => {
        const dominantEmotion = emotionData.Dominant.Emotion;
        const emotionPercentage = emotionData.Dominant.Percentage;
        console.log('Dominant Emotion:', dominantEmotion, emotionPercentage);


        let color;
        if (dominantEmotion === "元気もりもり") {
            color = "#FF4500";
        } else if (dominantEmotion === "とても元気") {
            color = "deeppink";
        } else if (dominantEmotion === "元気") {
            color = "yellow";
        } else if (dominantEmotion === "穏やか") {
            color = "#4FD4FF";
        } else if (dominantEmotion === "無感情") {
            color = "gray";
        }



        percentEmo.textContent = ` ${dominantEmotion}`;
        percentEmo.style.color = color;


        /* resultDiv.textContent = `Emotion: ${dominantEmotion} (${emotionPercentage})`;*/

        if (dominantEmotion == "Happiness") {
            resultDiv.textContent = `フィードバック: すごく良い感じ`;

            dynamicText.style.color = "green";


        }
        else {
            resultDiv.textContent = `フィードバック: もっと元気に出してね!`;


        }


        /* console.log(emotionPercentage);
         let cry = parseInt(emotionPercentage);
         console.log(dominantEmotion);
  
         const progressFill = document.querySelector(".progress-fill");
         if (progressFill) {
             console.log("Progress fill found!");
             progressFill.style.width = `${cry}%`;  // Update the width
         } else {
             console.log("Progress fill not found.");
         } */

        console.log(emotionPercentage);
        let cry = parseInt(emotionPercentage);
        console.log("checking cry" + cry);


        // Switch statement to adjust cry based on the dominant emotion
        switch (dominantEmotion) {
            case "元気もりもり":
                cry = 100;
                break;
            case "穏やか":
                cry = 25;
                break;
            case "とても元気":
                cry = 90;
                break;
            case "元気":
                cry = 70;
                break;
            case "無感情":
                cry = 50;
                break;
            default:
                cry = 0; // Default to 0% if the emotion is not recognized
                break;
        }

        console.log("Updated cry value: " + cry);

        const progressFill = document.querySelector(".progress-fill");
        if (progressFill) {
            console.log("Progress fill found!");
            progressFill.style.width = `${cry}%`;  // Update the width
        } else {
            console.log("Progress fill not found.");
        }
    });

});
