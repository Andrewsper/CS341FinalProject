import os
import json
from flask import Flask, jsonify, render_template, request, session
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

    login_data = request.get_json()
    if login_data["email"] == "":
        return jsonify("no email provided"), 400
    
    user = database.verify_user_login(login_data)

    if (user):
        user["password"] = ""
        session["user"] = user
        return user

    return jsonify("failed to login") , 401


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
    
    if resp[1] != 200:
        return resp
    
    created_user = database.verify_user_login(user)
    if created_user is not None:
        created_user["password"] = ""
        session["user"] = created_user
        return created_user
    
    return resp

@app.route("/users/<uid>/member", methods=['PUT'])
@cross_origin()
def toggle_user_member(uid):
    return database.toggle_user_member(uid)


@app.route("/users/<uid>/active", methods=['PUT'])
@cross_origin()
def toggle_user_active(uid):
    return database.toggle_user_active(uid)


@app.route("/users/<uid>/staff", methods=['PUT'])
@cross_origin()
def toggle_user_staff(uid):
    return database.toggle_user_staff(uid)

######

###### programs routes ######
@app.route("/programs", methods=['GET'])
def get_all_programs():
    return database.get_all_programs()

@app.route("/programs", methods=['POST'])
@cross_origin()
def add_program() -> tuple[str, int]:
    program = request.get_json()
    return database.add_program(program)

@app.route("/programs/<uid>", methods=['GET'])
def get_user_programs(uid):
    if uid is None:
        return database.get_all_programs()
    return database.get_user_programs(uid)


@app.route("/program/<pid>", methods=['GET'])
def get_program_by_id(pid):
    return database.get_program_by_id(pid)

@app.route("/program/<pid>/<uid>/<num_registered>", methods=['PUT'])
def unregister(pid, uid, num_registered):
    print(num_registered)
    if int(num_registered) > 0:
        result = database.update_registration(uid, pid, num_registered)
        if not result: 
            return jsonify("Failed to update registration"), 400
    else:
        database.remove_registration(uid, pid)
    return jsonify("OK"), 200

@app.route("/program/<pid>/<uid>/<num_registered>", methods = ["POST"])
@cross_origin()
def signup(pid, uid, num_registered):
    return database.sign_up_for_program(pid, uid, num_registered)

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

@app.route("/users", methods=['GET'])
@cross_origin()
def get_users() -> list[dict]:
    return database.get_all_users()

@app.route("/database/users/remove", methods=['DELETE'])
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
    
    
