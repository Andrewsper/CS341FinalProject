import sqlite3

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('./database/database.db', check_same_thread=False)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def reset_cursor(self):
        self.cursor = self.connection.cursor()

    def commit_changes(self):
        self.connection.commit()

    def get_all_users(self):
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Users')
        users = self.cursor.fetchall()

        return self.convert_users_to_json(users)

    def get_all_programs(self):
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Programs')
        programs = self.cursor.fetchall()

        return self.convert_programs_to_json(programs)

    def add_test_user(self) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Users (Username, FirstName, LastName, Address, PhoneNumber, Email, Password, ZipCode, Balance, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                               ("1", "2", "3", "4", "5", "6", "7", "54601", 9.0, 10))
        self.commit_changes()

    def add_user(self, user: dict) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Users (Username, FirstName, LastName, Address, ZipCode, PhoneNumber, Email, Password, Balance, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                               (user["Username"], user["FirstName"], user["LastName"], user["Address"], 
                                               user["ZipCode"], user["PhoneNumber"], user["Email"], 
                                               user["Password"], user["Balance"], user["Type"]))
        self.commit_changes()

    def add_program(self) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                                                  ("1", "2", "3", "4", 5.0, 6, 7, 8))
        self.commit_changes()

    def convert_programs_to_json(self, programs: list) -> list:
        programs_json: list = list()
        for program in programs:
            programs_json.append({
                "ProgramID": program[0],
                "Name": program[1],
                "Description": program[2],
                "OfferingPeriod": program[3],
                "Date": program[4],
                "Price": program[5],
                "Length": program[6],
                "MaximumCapacity": program[7],
                "CurrentCapacity": program[8]
            })
        return programs_json

    def convert_program_to_json(self, program: list) -> dict:
        program_json = {
            "ProgramID": program[0],
            "Name": program[1],
            "Description": program[2],
            "OfferingPeriod": program[3],
            "Date": program[4],
            "Price": program[5],
            "Length": program[6],
            "MaximumCapacity": program[7],
            "CurrentCapacity": program[8]
        }
        return program_json

    def convert_users_to_json(self, users: list) -> list:
        users_json: list = list()
        for user in users:
            users_json.append({
                "UserID": user[0],
                "Username": user[1],
                "FirstName": user[2],
                "LastName": user[3],
                "Address": user[4],
                "ZipCode": user[5],
                "PhoneNumber": user[6],
                "Email": user[7],
                "Password": user[8],
                "Balance": user[9],
                "Type": user[10]
            })
        return users_json
    
    def convert_user_to_json(self, user: list) -> dict:
        user_json = {
            "UserID": user[0],
            "Username": user[1],
            "FirstName": user[2],
            "LastName": user[3],
            "Address": user[4],
            "ZipCode": user[5],
            "PhoneNumber": user[6],
            "Email": user[7],
            "Password": user[8],
            "Balance": user[9],
            "Type": user[10]
        }
        return user_json