def convert_program_to_json(program: list) -> dict:
    program_json = {
        "programID": program[0],
        "name": program[1],
        "description": program[2],
        "offeringPeriod": program[3],
        "location" : program[4],
        "date": program[5],
        "price": program[6],
        "length": program[7],
        "maximumCapacity": program[8],
        "currentCapacity": program[9]
    }

    return program_json

def convert_programs_to_json(programs: list) -> list:
    programs_json: list = list()
    for program in programs:
        programs_json.append(convert_program_to_json(program))

    return programs_json

def convert_user_to_json(user: list) -> dict:
    user_json = {
        "userid": user[0],
        "firstName": user[1],
        "lastName": user[2],
        "address": user[3],
        "zipCode": user[7],
        "phoneNumber": user[4],
        "email": user[5],
        #Never return password
        "password": "",
        "balance": user[8],
        "isStaff": user[9],
        "isMember": user[10],
        "isActive": user[11]
    }
    
    return user_json

def convert_users_to_json(users: list) -> list:
    users_json: list = list()
    for user in users:
        users_json.append(convert_user_to_json(user))

    return users_json

def convert_signed_up_to_json(signed_up: list) -> list:
    signed_up_json: list = list()

    for signed_up in signed_up:
        signed_up_json.append({
            "userID": signed_up[0],
            "programID": signed_up[1],
        })

    return signed_up_json

def convert_user_program_list(programs: list) -> list:
    newList: list = list()
    for program in programs:
        newList.append([program[0],program[1]])
    newList.append(["-1",-1])
    return newList
        