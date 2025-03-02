from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app=app, origins="*")


@app.route("/")
def home():
    return "<strong>Home</strong>"


if __name__ == "__main__":
    app.run(debug=True, port=8080)
