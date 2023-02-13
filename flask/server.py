import os
import json
from flask import Flask, render_template, request, session
from flask_session import Session
from flask_cors import CORS, cross_origin
from database.database import Database



database: Database
app = Flask(__name__)
app.secret_key = 'hamburgers'
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
CORS(app)
Session(app)

@app.route("/")
@cross_origin()
def hello():
    return render_template("index.html")

@app.route("/login",methods = ["POST"])
@cross_origin()
def login():
    
    if "user" in session :
        print(session["user"])
        return session["user"]
    else:
        loginData = request.get_json()
        try: 
            user = database.verify_user_login(loginData)
        except:
            return "failed to login" , 400

        if(user):
            user["password"]=""
            session["user"] = user
            return user
        else:
            return "failed to login" , 400


@app.route("/logout",methods = ["POST"])
@cross_origin()
def logout():
    if "user" in session :
        session.pop("user",None)
    return 'ok', 200

@app.route("/test", methods=['GET'])
@cross_origin()
def test():
    return "it has been changed"

@app.route("/database/users", methods=['GET'])
@cross_origin()
def get_users():
    return database.get_all_users()

@app.route("/database/programs", methods=['GET'])
def get_programs():
    return database.get_all_programs()

@app.route("/database/testing/add/user", methods=['POST'])
@cross_origin()
def add_user_test():
    database.add_test_user()
    return "Success"

@app.route("/database/add/user", methods=['POST'])
@cross_origin()
def add_user():
    user = request.get_json()
    database.add_user(user)
    return "Success"


if __name__ == "__main__":
    database = Database()

    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090),debug=True) 
    
    
