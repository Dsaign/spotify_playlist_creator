from typing import Any, Dict
from flask import Flask, request, jsonify
import requests
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:8080"])
DEV_MODE = True


@app.route("/api/get_client_id", methods=["GET"])
def getClientID() -> Any:
    """
    Endpoint to retrieve the CLIENT_ID from environment variables.
    """
    client_id = os.getenv("CLIENT_ID")
    if client_id is None:
        return jsonify({"error": "CLIENT_ID not found in environment variables"}), 500
    return jsonify({"client_id": client_id})


@app.route("/api/generate-playlist")
def home() -> Any:
    data = request.json
    if not data:
        return ValueError()
    user_prompt = data.get("prompt", "")
    if DEV_MODE:
        # Use local Ollama instance in development
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",  # Or another model you've pulled
                "prompt": f"Generate a Spotify playlist based on this description: '{user_prompt}'. Return a JSON array of song objects with artist and title fields. Only include music that matches the vibe described. Include 10-15 song suggestions.",
                "system": "You are a music expert assistant helping to generate Spotify playlist suggestions.",
            },
        )
        return jsonify({"response": response.json().get("response", "")})
    else:
        # Use Anthropic API in production
        # Your original Anthropic API code here
        pass
    return ""


@app.route("/api/user/get", methods=["GET"])
def get_user_data() -> Dict[str, Any]:
    """
    Endpoint to get user data.
    Returns a dictionary with user information.
    """
    user_data: Dict[str, Any] = {
        "user_id": 1,
        "display_name": "Fabio Sampaio",
        "user_email": "teste@teste.com",
        "user_uri": "teste_uri@teste.com",
        "user_spotify_link": "www.link.com.br",
        "user_profile_image": "https://img.myloview.com.br/fotomurais/user-icon-human-person-symbol-avatar-login-sign-700-259624278.jpg",
    }
    return user_data


@app.route("/api/user/insert", methods=["SET"])
def set_user():
    raise NotImplementedError()


@app.route("/api/user/update", methods=["PATCH"])
def update_user():
    raise NotImplementedError()


@app.route("/api/user/set", methods=["DELETE"])
def delete_user():
    raise NotImplementedError()


if __name__ == "__main__":
    app.run(debug=True, port=8080)
