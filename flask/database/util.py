r"""This module contains useful functions for that help the database

Author: Eric, Charlie, Will, Andrew

Date Modified: 2023-04-25
"""

import database.conflict_manager as conflict_manager

def convert_program_to_json(program: list) -> dict:
    r"""Converts a program from the database to a json object
    
    Args:
        program (list): A list containing the program information from the database
        
    Returns:
        dict: A json object containing the program information
    """
    if program is None:
        return None
    
    program_json = {
        "programID": program[0],
        "name": program[1],
        "description": program[2],
        "offeringDateFrom": program[3],
        "offeringDateTo" : program[4],
        "location": program[5],
        "price": program[6],
        "length": program[7],
        "daysOffered": conflict_manager.get_days_of_the_week(program[8]),
        "startTime": program[9],
        "maximumCapacity": program[10],
        "currentCapacity": program[11]
    }

    return program_json

def convert_programs_to_json(programs: list) -> list:
    r"""Converts a list of programs from the database to a list of json objects
    
    Args:
        programs (list): A list containing the program information from the database
        
    Returns:
        list: A list of json objects containing the program information
    """
    programs_json: list = list()
    for program in programs:
        programs_json.append(convert_program_to_json(program))

    return programs_json

def convert_user_to_json(user: list) -> dict:
    r"""Converts a user from the database to a json object

    Args:
        user (list): A list containing the user information from the database

    Returns:
        dict: A json object containing the user information
    """
    if user is None:
        return None
    
    user_json = {
        "userid": user[0],
        "firstName": user[1],
        "lastName": user[2],
        "address": user[3],
        "zipCode": user[7],
        "phoneNumber": user[4],
        "email": user[5],
        #Never return password
        "password": user[6],
        "balance": user[8],
        "isStaff": user[9],
        "isMember": user[10],
        "isActive": user[11]
    }
    
    return user_json

def convert_users_to_json(users: list) -> list:
    r"""Converts a list of users from the database to a list of json objects

    Args:
        users (list): A list containing the user information from the database

    Returns:
        list: A list of json objects containing the user information
    """
    users_json: list = list()
    for user in users:
        users_json.append(convert_user_to_json(user))

    return users_json

def convert_signed_up_to_json(signed_up: list) -> list:
    r"""Converts a list of signed up programs from the database to a list of json objects

    Args:
        signed_up (list): A list containing the signed up program information from the database

    Returns:
        list: A list of json objects containing the signed up program information
    """
    signed_up_json: list = list()

    for signed_up in signed_up:
        signed_up_json.append({
            "userID": signed_up[0],
            "programID": signed_up[1],
        })

    return signed_up_json

def convert_user_program_list(programs: list) -> list:
    r"""Converts a list of programs from the database to a list of json objects

    Args:
        programs (list): A list containing the program information from the database

    Returns:
        list: A list of json objects containing the program information
    """
    newList: list = list()
    for program in programs:
        newList.append([program[0],program[1]])
    newList.append(["-1",-1])
    return newList

def hash_password(password: str) -> int:
    r"""Hashes a password using a salt

    Args:
        password (str): The password to be hashed
        salt (int): The salt to be used in the hashing

    Returns:
        int: The hashed password
    """
    hashed_password: int = 0
    for char in password:
        hashed_password += ord(char)
    return hashed_password