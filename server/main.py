from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:8080"])


@app.route("/api/user_info", methods=["GET"])
def dados():
    return jsonify(
        {
            "user_info": {
                "name": "Fabio Sampaio",
                "email": "fsampaio.souza@gmail.com",
                "spotify_uri": "",
                "spotify_link": "",
                "profile_image_url": "",
            }
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)
