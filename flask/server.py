import os

from flask import Flask, render_template, request, json
from flask_cors import CORS
from database.database import Database

database: Database
app = Flask(__name__,template_folder="../angular/dist/ymca-schedule")
CORS(app)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/test", methods=['GET'])
def test():
    return "it has been changed"

@app.route("/database/users", methods=['GET'])
def get_users():
    return database.get_all_users()

if __name__ == "__main__":
    database = Database()
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090),debug=True) 