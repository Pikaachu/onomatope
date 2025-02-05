from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import os
import wave
import numpy as np
import ctypes
import Vokaturi
import io
import subprocess

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load Vokaturi emotion detection library
Vokaturi.load("/var/www/html/onomatope/backend/OpenVokaturi-4-0-linux.so")

@app.route('/')
def index():
    return render_template('card.php')

# Function to convert WebM to WAV using FFmpeg
def convert_to_wav(input_audio_path, output_audio_path):
    command = [
        "ffmpeg",
        "-y",
        "-i", input_audio_path,
        "-vn",  # Disable video processing
        "-ac", "1",  # Mono channel (if needed)
        "-ar", "16000",  # Set sample rate to 16 kHz (or Vokaturi's expected rate)
        "-f", "wav",  # Force output to WAV format
        output_audio_path  # Output WAV file
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"Audio successfully converted to WAV: {output_audio_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error during conversion: {e}")
        return None

    return output_audio_path

# Handle the audio chunk sent from the frontend
@socketio.on('audio_chunk')
def handle_audio_chunk(audio_data):
    try:
        print("Received audio chunk")

        # Save the incoming WebM audio data to a temporary file
        webm_audio_path = 'received_audio.webm'
        with open(webm_audio_path, 'wb') as f:
            f.write(audio_data)

        # Convert the WebM file to WAV
        wav_audio_path = 'converted_audio.wav'
        wav_file = convert_to_wav(webm_audio_path, wav_audio_path)

        if wav_file:
            # Process audio for emotion detection
            audio_file = io.open(wav_audio_path, 'rb')
            with wave.open(audio_file, 'rb') as audio:
                sample_rate = audio.getframerate()
                num_frames = audio.getnframes()
                audio_data = audio.readframes(num_frames)

            # Process audio for emotion detection
            audio_array = np.frombuffer(audio_data, dtype=np.int16)
            voice = Vokaturi.Voice(sample_rate, len(audio_array), 0)
            ctypes_array = (ctypes.c_short * len(audio_array))(*audio_array)
            voice.fill_int16array(len(audio_array), ctypes_array)

            quality = Vokaturi.Quality()
            emotion_probabilities = Vokaturi.EmotionProbabilities()
            voice.extract(ctypes.byref(quality), ctypes.byref(emotion_probabilities))

            emotions = {

                "元気もりもり": emotion_probabilities.happiness,
                "とても元気": emotion_probabilities.sadness,
                "元気": emotion_probabilities.anger,
                "穏やか": emotion_probabilities.fear,
                "無感情": emotion_probabilities.neutrality



                # "Happiness": emotion_probabilities.happiness,
                # "Sadness": emotion_probabilities.sadness,
                # "Anger": emotion_probabilities.anger,
                # "Fear": emotion_probabilities.fear,
                # "Neutrality": emotion_probabilities.neutrality
            }


###############################################################################

              # Apply emotion weights to adjust emotion probabilities
            emotion_weights = {
                "元気もりもり": 1.5,  # Boost happiness detection
                "とても元気": 0.8,
                "元気": 0.5,
                "穏やか": 0.3,
                "無感情": 0.1
            }

            weighted_emotions = {emotion: prob * emotion_weights[emotion] for emotion, prob in emotions.items()}
            dominant_emotion = max(weighted_emotions, key=weighted_emotions.get)

            emotions["Dominant"] = {
                "Emotion": dominant_emotion,
                "Percentage": int(weighted_emotions[dominant_emotion] * 100)
            }

            # Send emotion results back to frontend
            emit('emotion_result', emotions)

###############################################################################
            # dominant_emotion = max(emotions, key=emotions.get)
            # emotions["Dominant"] = {
            #     "Emotion": dominant_emotion,
            #     # "Percentage": f"{emotions[dominant_emotion] * 100:.2f}%"
            #    "Percentage": int(emotions[dominant_emotion] * 100)
            # }

            # Send emotion results back to frontend
            emit('emotion_result', emotions)

    except Exception as e:
        print(f"Error processing audio: {e}")
        emit('emotion_result', {"error": str(e)})

# Handle word correctness check
@socketio.on('check_word')
def check_word(data):
    try:
        user_input = data.get('transcript', '').strip()
        correct_word = data.get('correctWord', '').strip()

        # Compare the transcript with the correct word
        if user_input == correct_word:
            emit('word_correctness_result', {"result": "correct"})
        else:
            emit('word_correctness_result', {"result": "incorrect"})
    except Exception as e:
        emit('word_correctness_result', {"error": str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
