import sqlite3

class Database:
    def __init__(self):
        self.connection = sqlite3.connect('./database/database.db', check_same_thread=False)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def reset_cursor(self):
        self.cursor = self.connection.cursor()

    def get_all_users(self):
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Users')
        users = self.cursor.fetchall()
        return self.convert_users_to_json(users)

    def add_user(self) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Users (FirstName, LastName, Address, ZipCode, PhoneNumber, Email, Password, Balance, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', ("1", "2", "3", "4", "5", "6", "7", 8.0, 9))
        self.connection.commit()

    def add_user(self, user: dict) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Users (FirstName, LastName, Address, ZipCode, PhoneNumber, Email, Password, Balance, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                               (user["FirstName"], user["LastName"], user["Address"], 
                                               user["ZipCode"], user["PhoneNumber"], user["Email"], 
                                               user["Password"], user["Balance"], user["Type"]))
        self.connection.commit()

    def add_program(self) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', ("1", "2", "3", "4", 5.0, 6, 7, 8))

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
                "FirstName": user[1],
                "LastName": user[2],
                "Address": user[3],
                "ZipCode": user[4],
                "PhoneNumber": user[5],
                "Email": user[6],
                "Password": user[7],
                "Balance": user[8],
                "Type": user[9]
            })
        return users_json
    
    def convert_user_to_json(self, user: list) -> dict:
        user_json = {
            "UserID": user[0],
            "FirstName": user[1],
            "LastName": user[2],
            "Address": user[3],
            "ZipCode": user[4],
            "PhoneNumber": user[5],
            "Email": user[6],
            "Password": user[7],
            "Balance": user[8],
            "Type": user[9]
        }
        return user_json