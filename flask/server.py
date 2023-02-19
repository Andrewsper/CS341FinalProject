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


###### Base routes ######

@app.route("/login",methods = ["POST"])
@cross_origin()
def login() -> tuple[str, int]:
    
    if "user" in session :
        print(session["user"])
        return session["user"]

    loginData = request.get_json()
    if loginData["email"] == "":
        return "no email provided" , 400

    try: 
        user = database.verify_user_login(loginData)
    except:
        return "failed to login" , 401

    if (user):
        user["password"] = ""
        session["user"] = user
        return user

    return "failed to login" , 401


@app.route("/logout",methods = ["POST"])
@cross_origin()
def logout() -> tuple[str, int]:
    if "user" in session :
        session.pop("user",None)
    return 'ok', 200

@app.route("/register", methods=['POST'])
@cross_origin()
def register_user() -> tuple[str, int]:
    user = request.get_json()
    resp: tuple[str, int] = database.add_user(user)
    
    if (resp[1] == 200):
        user["password"] = ""
        session["user"] = user
        return resp
    
    return resp

######

###### programs routes ######

@app.route("/database/programs", methods=['GET'])
def get_programs() -> list[dict]:
    return database.get_all_programs()

@app.route("/database/programs/add", methods=['POST'])
@cross_origin()
def add_program() -> tuple[str, int]:
    program = request.get_json()
    print(program)
    return database.add_program(program)

@app.route("/database/programs/remove", methods=['POST'])
@cross_origin()
def remove_program() -> tuple[str, int]:
    program = request.get_json()
    return database.remove_program(program)

@app.route("/database/programs/add/user", methods=['POST'])
@cross_origin()
def add_user_to_program() -> tuple[str, int]:
    req = request.get_json()
    return database.add_user_to_program(req)

######

###### user routes ######

@app.route("/database/users", methods=['GET'])
@cross_origin()
def get_users() -> list[dict]:
    return database.get_all_users()

@app.route("/database/users/remove", methods=['POST'])
@cross_origin()
def remove_user() -> tuple[str, int]:
    user = request.get_json()
    return database.remove_user(user)
    
######

###### signed up routes ######

@app.route("/database/signedup", methods=['GET'])
@cross_origin()
def get_signed_up() -> list[dict]:
    return database.get_all_signed_up()

######

###### Testing Routes ######

@app.route("/testing/add/user", methods=['POST'])
@cross_origin()
def add_user_test() -> tuple[str, int]:
    return database.add_test_user()

@app.route("/test", methods=['GET'])
@cross_origin()
def test():
    return "it has been changed"

######

if __name__ == "__main__":
    database = Database()
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090),debug=True) 
    
    
