import sqlite3
import os
import database.util as util

class Database:
    def __init__(self) -> None:
        self.connection = sqlite3.connect('./database/database.db', check_same_thread=False)
        self.cursor = self.connection.cursor()

    def __del__(self) -> None:
        self.connection.close()

    ##### Helper Functions #####

    def reset_cursor(self) -> None:
        self.cursor = self.connection.cursor()

    def commit_changes(self) -> None:
        self.connection.commit()

    def success_response(self) -> tuple[str, int]:
        return "ok", 200

    def get_user_id(self, email: str) -> int:
        if not self.check_for_user(email):
            return -1

        self.reset_cursor()
        self.cursor.execute('SELECT UserID FROM Users WHERE Email = ?', (email,))
        return self.cursor.fetchone()[0]

    def get_program_id(self, name: str) -> int:
        if not self.check_for_program(name):
            return -1

        self.reset_cursor()
        self.cursor.execute('SELECT ProgramID FROM Programs WHERE Name = ?', (name,))
        return self.cursor.fetchone()[0]

    #####

    ##### Getting from Database #####

    def get_all_users(self) -> list[dict]:
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Users')
        users = self.cursor.fetchall()

        return util.convert_users_to_json(users)

    def get_all_programs(self) -> list[dict]:
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Programs')
        programs = self.cursor.fetchall()

        return util.convert_programs_to_json(programs)

    def get_all_signed_up(self) -> list[dict]:
        self.reset_cursor()
        self.cursor.execute('SELECT * FROM Signed_UP')
        signed_up = self.cursor.fetchall()

        return util.convert_signed_up_to_json(signed_up)

    #####

    ##### Adding to Database #####

    def add_user(self, user: dict) -> tuple[str, int]:
        if self.check_for_user(user["email"]):
            return "user already exists", 409

        self.reset_cursor()
        self.cursor.execute("""INSERT INTO Users 
                                (FirstName, LastName, Address, PhoneNumber, Email, 
                                Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        (user["firstName"], user["lastName"], user["address"], 
                                         user["phoneNumber"], user["email"], user["password"], 
                                         user["zipCode"], 0, False, user["isMember"], True))
        self.commit_changes()

        return self.success_response()

    ##### For staff and member ship we will user promotion and demotion end points on already existing users
    # Thus we should user update on user id
    def add_staff(self, user: dict) -> tuple[str, int]:
        if self.check_for_user(user["email"]):
            return "staff already exists", 409

        self.reset_cursor()
        self.cursor.execute("""INSERT INTO Users 
                                (FirstName, LastName, Address, PhoneNumber, Email, 
                                Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        (user["firstName"], user["lastName"], user["address"], 
                                         user["phoneNumber"], user["email"], user["password"], 
                                         user["zipCode"], 0, True, False, True))
        self.commit_changes()

        return self.success_response()

    def add_program(self, program: dict) -> tuple[str, int]:
        if self.check_for_program(program["name"]):
            return "program already exists", 409

        self.reset_cursor()
        self.cursor.execute("""INSERT INTO Programs 
                                (Name, Description, Date, OfferingPeriod, Price, 
                                Length, MaximumCapacity, CurrentCapacity) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        (program["name"], program["description"], program["date"],
                                         program["offeringPeriod"], program["price"], program["length"],
                                         program["maximumCapacity"], 0))
        self.commit_changes()

        return self.success_response()

    def add_user_to_program(self, user: dict, program: dict) -> tuple[str, int]:
        user_id: int = self.get_user_id(user["email"])
        program_id: int = self.get_program_id(program["name"])

        if user_id == -1:
            return "user not found", 204
        if program_id == -1:
            return "program not found", 204

        if not self.check_program_capacity(program["name"]):
            return "program is full", 409

        self.reset_cursor()
        self.cursor.execute("""INSERT INTO Signed_UP 
                                (UserID, ProgramID) 
                                    VALUES (?, ?)""", 
                                        (user_id, program_id))
        self.cursor.execute("""UPDATE Programs
                                    SET CurrentCapacity = CurrentCapacity + 1
                                    WHERE ProgramID = ?""", (program_id,))
        self.commit_changes()

        return self.success_response()

    ######

    ##### Removing from Database #####

    def remove_user(self, user: dict) -> tuple[str, int]:
        if not self.check_for_user(user["email"]):
            return "user not found", 204

        self.reset_cursor()
        # Soft delete users
        self.cursor.execute("""UPDATE Users
                                    SET IsActive = 0
                                    WHERE Email = ?""", (user["email"],))
        self.commit_changes()

        return self.success_response()

    def remove_program(self, program: dict) -> tuple[str, int]:
        if not self.check_for_program(program["name"]):
            return "program not found", 204
        
        self.reset_cursor()
        # Hard delete programs
        self.cursor.execute("""DELETE FROM Programs
                                    WHERE Name = ?""", (program["name"],))
        self.commit_changes()

        return self.success_response()

    #####

    ##### Validation #####

    def check_for_user(self, email: str) -> bool:
        self.reset_cursor()
        self.cursor.execute("""SELECT *
                                    FROM Users
                                    WHERE Email = ?""", (email,))

        user = self.cursor.fetchone()

        if user:
            return True
        return False

    def check_for_program(self, name: str) -> bool:
        self.reset_cursor()
        self.cursor.execute("""SELECT *
                                    FROM Programs
                                    WHERE Name = ?""", (name,))
        program = self.cursor.fetchone()

        if program:
            return True
        return False

    def check_program_capacity(self, name: str) -> int:
        if not self.check_for_program(name):
            return False
        
        self.reset_cursor()
        self.cursor.execute("""SELECT CurrentCapacity, MaximumCapacity
                                    FROM Programs
                                    WHERE Name = ?""", (name,))

        current_capacity, maximum_capacity = self.cursor.fetchone() 
        print(current_capacity, maximum_capacity)

        if current_capacity < maximum_capacity:
            return True
        return False

    def verify_user_login(self, user) -> dict:
        self.reset_cursor()
        self.cursor.execute("""SELECT *
                                    FROM Users
                                    WHERE Email = ? AND Password = ?""", 
                                    (user["email"], user["password"]))

        return util.convert_user_to_json(self.cursor.fetchone())

    #####

    ##### Testing #####

    def add_test_user(self) -> tuple[str, int]:
        self.reset_cursor()
        self.cursor.execute("""INSERT INTO Users 
                                (FirstName, LastName, Address, PhoneNumber, Email, 
                                Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        ("Bob", "Test", "1234 test street WI", "(111)-222-3333", "bob@test.com", 
                                        "password", "54601", 0, True, True, True))
        self.commit_changes()

        return self.success_response()

    def add_test_program(self, program: dict) -> tuple[str, int]:
        if self.check_for_program(program["name"]):
            return "program already exists", 409

        self.reset_cursor()
        self.cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                                                  ("1", "2", "3", "4", 5.0, 6, 7, 8))
        self.commit_changes()

        return self.success_response()

    ######