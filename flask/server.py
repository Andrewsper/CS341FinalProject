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

@app.route("/database/users", methods=['GET'])
def get_users():
    return database.get_all_users()

@app.route("/database/programs", methods=['GET'])
def get_programs():
    return database.get_all_programs()

@app.route("/database/testing/add/user", methods=['POST'])
def add_user_test():
    database.add_test_user()
    return "Success"

@app.route("/database/add/user", methods=['POST'])
def add_user():
    user = request.get_json()
    database.add_user(user)
    return "Success"

if __name__ == "__main__":
    database = Database()
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090),debug=True) 