from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import wave
import numpy as np
import ctypes
import Vokaturi

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Load Vokaturi library
Vokaturi.load("/var/www/html/onomatope_ajax_boraaaa/backend/OpenVokaturi-4-0-linux.so")

@app.route('/')
def index():
    return render_template('card.php')

# WebSocket event for handling the audio chunk (for emotion detection)
@socketio.on('audio_chunk')
def handle_audio_chunk(data):
    file_path = "temp.wav"
    try:
        with open(file_path, "wb") as temp_file:
            temp_file.write(data)

        # Ensure the file starts with "RIFF" to be a valid WAV
        if not data.startswith(b"RIFF"):
            emit('emotion_result', {"error": "Invalid audio format."})
            return

        with wave.open(file_path, 'rb') as audio:
            sample_rate = audio.getframerate()
            num_frames = audio.getnframes()
            audio_data = audio.readframes(num_frames)

        audio_array = np.frombuffer(audio_data, dtype=np.int16)
        voice = Vokaturi.Voice(sample_rate, len(audio_array), 0)
        ctypes_array = (ctypes.c_short * len(audio_array))(*audio_array)
        voice.fill_int16array(len(audio_array), ctypes_array)

        quality = Vokaturi.Quality()
        emotion_probabilities = Vokaturi.EmotionProbabilities()
        voice.extract(ctypes.byref(quality), ctypes.byref(emotion_probabilities))

        emotions = {
            "Happiness": emotion_probabilities.happiness,
            "Sadness": emotion_probabilities.sadness,
            "Anger": emotion_probabilities.anger,
            "Fear": emotion_probabilities.fear,
            "Neutrality": emotion_probabilities.neutrality
        }

        dominant_emotion = max(emotions, key=emotions.get)
        emotions["Dominant"] = {
            "Emotion": dominant_emotion,
            "Percentage": f"{emotions[dominant_emotion] * 100:.2f}%"
        }

        emit('emotion_result', emotions)

    except Exception as e:
        emit('emotion_result', {"error": str(e)})

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

# Word correctness endpoint
@app.route('/check_word', methods=['POST'])
def check_word():
    try:
        data = request.json
        user_input = data.get('transcript', '').strip()
        correct_word = data.get('correct_word', '').strip()

        # Normalize and compare
        if user_input == correct_word:
            return jsonify({"result": "correct"})
        else:
            return jsonify({"result": "incorrect"})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
