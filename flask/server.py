import os

from flask import Flask, render_template, request, json
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__,template_folder="../angular/dist/ymca-schedule")
CORS(app)

client = MongoClient("mongo:27017")

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/test", methods=['GET'])
def test():
    return "it has been changed"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090),debug=True)