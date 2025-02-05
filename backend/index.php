<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Emotion Detection from Audio</title>
    <script src="https://cdn.socket.io/4.0.1/socket.io.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }

        #result {
            margin-top: 20px;
            font-size: 20px;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>Emotion Detection from Audio</h1>
    <button id="startButton">Start Recording</button>
    <div id="result"></div>

    <script>
        const socket = io('http://localhost:5000');
        const startButton = document.getElementById('startButton');
        const resultDiv = document.getElementById('result');

        let mediaRecorder;
        let audioChunks = [];

        // Handle the emotion result from Flask server
        socket.on('emotion_result', function (data) {
            if (data.error) {
                resultDiv.textContent = 'Error: ' + data.error;
            } else {
                const dominantEmotion = data.Dominant;
                console.log(dominantEmotion);
                resultDiv.textContent = `Dominant Emotion: ${dominantEmotion.Emotion} (${dominantEmotion.Percentage})`;
            }

        });

        // Convert audio data to WAV format (works for WebM input)
        async function convertWebMtoWAV(blob) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            const wavData = audioBufferToWav(audioBuffer);
            return new Blob([new DataView(wavData)], { type: 'audio/wav' });
        }

        // Function to convert AudioBuffer to WAV format
        function audioBufferToWav(audioBuffer) {
            const numOfChannels = audioBuffer.numberOfChannels;
            const length = audioBuffer.length * numOfChannels * 2 + 44; // For WAV header
            const buffer = new ArrayBuffer(length);
            const view = new DataView(buffer);
            const writeData = (offset, data) => {
                for (let i = 0; i < data.length; i++) {
                    view.setInt8(offset + i, data[i]);
                }
            };

            // Write the RIFF header
            writeData(0, 'RIFF'.split('').map(c => c.charCodeAt(0)));
            view.setUint32(4, length - 8, true); // File size - 8 bytes
            writeData(8, 'WAVE'.split('').map(c => c.charCodeAt(0)));

            // Write the fmt chunk
            writeData(12, 'fmt '.split('').map(c => c.charCodeAt(0)));
            view.setUint32(16, 16, true); // Subchunk1Size
            view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
            view.setUint16(22, numOfChannels, true); // NumChannels
            view.setUint32(24, audioBuffer.sampleRate, true); // SampleRate
            view.setUint32(28, audioBuffer.sampleRate * numOfChannels * 2, true); // ByteRate
            view.setUint16(32, numOfChannels * 2, true); // BlockAlign
            view.setUint16(34, 16, true); // BitsPerSample

            // Write the data chunk
            writeData(36, 'data'.split('').map(c => c.charCodeAt(0)));
            view.setUint32(40, audioBuffer.length * numOfChannels * 2, true); // Subchunk2Size

            let offset = 44;
            for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
                const channelData = audioBuffer.getChannelData(i);
                for (let j = 0; j < audioBuffer.length; j++) {
                    view.setInt16(offset, channelData[j] * 32767, true); // PCM data
                    offset += 2;
                }
            }

            return buffer;
        }

        // Start recording when the button is clicked
        startButton.addEventListener('click', () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });  // WebM format

                    mediaRecorder.ondataavailable = function (event) {
                        audioChunks.push(event.data);

                        // Convert the chunks to WAV format before sending to the server
                        const blob = new Blob(audioChunks, { type: 'audio/webm' });
                        convertWebMtoWAV(blob).then(wavBlob => {
                            const reader = new FileReader();
                            reader.onload = function (e) {
                                const arrayBuffer = e.target.result;
                                socket.emit('audio_chunk', arrayBuffer);  // Send WAV data to the server
                            };
                            reader.readAsArrayBuffer(wavBlob);
                        });

                        audioChunks = [];  // Reset chunks after sending
                    };

                    mediaRecorder.start(3000); // Record in 3-second chunks
                })
                .catch(error => {
                    console.error('Error accessing microphone:', error);
                });
        });
    </script>
</body>

</html>