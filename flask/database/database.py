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

    def verify_user_login(self,user):
        self.reset_cursor()
        self.cursor.execute("""SELECT *
                                    FROM Users
                                    WHERE Email = ? AND Password =?""",(user["email"],user["password"]))
        return self.convert_user_to_json(self.cursor.fetchone())

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
        self.cursor.execute('INSERT INTO Users (FirstName, LastName, Address, PhoneNumber, Email, Password, ZipCode, Balance, IsStaff, IsMember) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                               ("Bob", "Test", "1234 test street WI", "(111)-222-3333", "bob@test.com", "password", "54601",0,True,True))
        self.commit_changes()
        
    def add_test_program(self) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                                                  ("Test Program", "This is a test program", "Summer", "2023-07-01", 10, 1, 10, 0))
        self.commit_changes()

    def add_user(self, user: dict) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Users (Username, FirstName, LastName, Address, ZipCode, PhoneNumber, Email, Password, Balance, Type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                               (user["Username"], user["FirstName"], user["LastName"], user["Address"], 
                                               user["ZipCode"], user["PhoneNumber"], user["Email"], 
                                               user["Password"], 0, user["Type"]))
        self.connection.commit()
        self.commit_changes()

    def add_program(self, program: dict) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                                                  (program["name"], program["description"], program["offeringPeriod"], program["date"], program["price"], program["length"], program["maxCapacity"], program["currentCapacity"]))
        self.commit_changes()
        
    def sign_up_for_program(self, programID: int, userID: int) -> None:
        self.reset_cursor()
        self.cursor.execute('INSERT INTO Signed_Up (ProgramID, UserID) VALUES (?, ?)', 
                                                  (programID, userID))
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
            users_json.append(self.convert_user_to_json(user))
        return users_json
    
    def convert_user_to_json(self, user: list) -> dict:
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
            "isMember": user[10]
        }
      

        return user_json