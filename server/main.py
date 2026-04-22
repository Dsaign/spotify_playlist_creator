import os
from dataclasses import dataclass
from typing import Any, Dict

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:8080"])
DEV_MODE = True

# export interface UserProfile {
#   data: {
#     display_name: string;
#     id: string;
#     email: string;
#     uri: string;
#     href: string;
#     images: { url: string }[];
#     external_urls: { spotify: string };
#   };
# }


@dataclass
class UserProfile:
    display_name: str
    id: str
    email: str
    uri: str
    href: str
    images: list[dict[str, str]]
    external_urls: dict[str, str]


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
    user_data: UserProfile = UserProfile(
        display_name="Fabio Sampaio",
        id="1",
        email="teste2@teste.com",
        uri="teste_uri@teste.com",
        href="www.link.com.br",
        images=[
            {
                "url": "https://img.myloview.com.br/fotomurais/user-icon-human-person-symbol-avatar-login-sign-700-259624278.jpg"
            }
        ],
        external_urls={"spotify": "www.link.com.br"},
    )

    return user_data.__dict__


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
