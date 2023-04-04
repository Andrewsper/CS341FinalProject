import sqlite3
import database.conflict_manager as conflict_manager
import database.util as util
from flask import jsonify

class Database:
    
    def __init__(self) -> None:
        self.connection = sqlite3.connect('./database/database.db', check_same_thread=False)

    def __del__(self) -> None:
        self.connection.close()

    ##### Helper Functions #####

    def reset_cursor(self) -> sqlite3.Cursor:
        return self.connection.cursor()

    def commit_changes(self) -> None:
        self.connection.commit()

    def success_response(self) -> tuple[str, int]:
        return jsonify("ok"), 200

    def get_user_id(self, email: str) -> int:
        if not self.check_for_user_by_email(email):
            return -1

        cursor = self.reset_cursor()
        cursor.execute('SELECT UserID FROM Users WHERE Email = ?', (email,))
        return cursor.fetchone()[0]

    def get_program_id(self, name: str) -> int:
        if not self.check_for_program_by_name(name):
            return -1
        

        cursor = self.reset_cursor()
        cursor.execute('SELECT ProgramID FROM Programs WHERE Name = ?', (name,))
        return cursor.fetchone()[0]
    
    def user_already_signed_up(self, program_id: int, user_id: int):
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Signed_Up WHERE ProgramID = ? AND UserID = ?""", (program_id, user_id))

        return len(cursor.fetchall()) != 0
        
    #####

    ##### Getting from Database #####
    
    def get_program_by_id(self, program_id) -> dict: 
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs WHERE ProgramID = ?""", program_id)
        return util.convert_program_to_json(cursor.fetchone())
    
    def get_all_users(self) -> list[dict]:
        cursor = self.reset_cursor()
        cursor.execute('SELECT * FROM Users')
        users = cursor.fetchall()

        return util.convert_users_to_json(users)

    def get_all_programs(self) -> list[dict]:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs
                                ORDER BY OfferingDateFrom ASC""")
        programs = cursor.fetchall()

        return util.convert_programs_to_json(programs)
    
    def get_user_programs(self, user_id: int):
        cursor = self.reset_cursor()
        cursor.execute("""SELECT ProgramID, NumRegistered FROM Signed_Up
                                WHERE UserID = ?""", (user_id,))
        userPrograms = cursor.fetchall()
        return util.convert_user_program_list(userPrograms)
    
    def get_all_programs_user_signed_up_for(self, user_id: int) -> list[dict]:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs
                                WHERE ProgramID IN (SELECT ProgramID FROM Signed_Up WHERE UserID = ?)""", (user_id,))
        programs = cursor.fetchall()

        return util.convert_programs_to_json(programs)

    def get_all_signed_up(self) -> list[dict]:
        cursor = self.reset_cursor()
        cursor.execute('SELECT * FROM Signed_UP')
        signed_up = cursor.fetchall()

        return util.convert_signed_up_to_json(signed_up)

    #####

    ##### Adding to Database #####

    def add_user(self, user: dict) -> tuple[str, int]:
        if self.check_for_user_by_email(user["email"]):
            return "user already exists", 409

        cursor = self.reset_cursor()
        cursor.execute("""INSERT INTO Users 
                            (FirstName, LastName, Address, PhoneNumber, Email, 
                            Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                    (user["firstName"], user["lastName"], user["address"], 
                                        user["phoneNumber"], user["email"], user["password"], 
                                        user["zipCode"], 0, False, False, True))
        
        # get id of the user we just added and hash the password
        user_id = self.get_user_id(user["email"])
        
        cursor.execute("""UPDATE Users 
                            SET Password = ? 
                            WHERE UserID = ?""", (util.hash_password(user["password"], user_id), user_id))

        self.commit_changes()

        return self.success_response()

    ##### For staff and membership we will user promotion and demotion end points on already existing users
    # Thus we should user update on user id
    def add_staff(self, user: dict) -> tuple[str, int]:
        if self.check_for_user_by_email(user["email"]):
            return "staff already exists", 409

        cursor = self.reset_cursor()
        cursor.execute("""INSERT INTO Users 
                            (FirstName, LastName, Address, PhoneNumber, Email, 
                            Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                    (user["firstName"], user["lastName"], user["address"], 
                                        user["phoneNumber"], user["email"], user["password"], 
                                        user["zipCode"], 0, True, False, True))
        
        # get id of the user we just added and hash the password
        user_id = self.get_user_id(user["email"])
        
        cursor.execute("""UPDATE Users 
                            SET Password = ? 
                            WHERE UserID = ?""", (util.hash_password(user["password"], user_id), user_id))

        self.commit_changes()

        return self.success_response()

    def add_program(self, program: dict) -> tuple[str, int]:
        if self.check_for_program_by_name(program["name"]):
            return "program already exists", 409

        days_offered_binary = conflict_manager.convert_days_to_binary(program["daysOffered"])

        cursor = self.reset_cursor()
        cursor.execute("""INSERT INTO Programs 
                                (Name, Description, OfferingDateTo, OfferingDateFrom,
                                Location, Price, Length, MaximumCapacity, CurrentCapacity,
                                DaysOffered, StartTime) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        (program["name"], program["description"], program["offeringDateTo"],
                                         program["offeringDateFrom"], program["location"], program["price"], program["length"],
                                         program["maximumCapacity"], 0, days_offered_binary, program["startTime"]))
        self.commit_changes()

        return self.success_response()

    def sign_up_for_program(self, program_id: int, user_id: int, num_registered: str) -> tuple[str, int]:
        if not self.check_for_user_by_id(user_id):
            return jsonify("user not found"), 204
        
        if not self.check_for_program_by_id(program_id):
            return jsonify("program not found"), 204
        
        if self.user_already_signed_up(program_id, user_id):
            return jsonify("user already signed up"), 409
        
        if self.check_for_time_conflict(program_id, user_id):
            return jsonify("program conflict"), 410
        
        cursor = self.reset_cursor()
        

        cursor.execute("SELECT MaximumCapacity, CurrentCapacity FROM Programs WHERE ProgramID = ?", (program_id,))
        capacity = cursor.fetchone()

        if (int(capacity[1]) + int(num_registered)) > int(capacity[0]):
            return jsonify("program is full"), 409


        cursor.execute("""INSERT INTO Signed_UP 
                                (UserID, ProgramID, NumRegistered) 
                                    VALUES (?, ?, ?)""", 
                                        (user_id, program_id, num_registered))
        cursor.execute("""UPDATE Programs
                                    SET CurrentCapacity = CurrentCapacity + ?
                                    WHERE ProgramID = ?""", (num_registered, program_id))
        self.commit_changes()

        return self.success_response()

    ######

    ##### Updating Database #####
    def toggle_user_member(self, user_id: int)-> tuple[str, int]:
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204
        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""UPDATE Users
                                    SET IsMember = 
                                    CASE WHEN IsMember = 1 THEN 0
                                    ELSE 1 END
                                    WHERE UserID = ?""", (user_id,))
        self.commit_changes()

        return self.success_response()
    
    def toggle_user_staff(self, user_id: int)-> tuple[str, int]:
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204
        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""UPDATE Users
                                    SET IsStaff = 
                                    CASE WHEN IsStaff = 1 THEN 0
                                    ELSE 1 END
                                    WHERE UserID = ?""", (user_id,))
        self.commit_changes()

        return self.success_response()
    
    def toggle_user_active(self, user_id: int)-> tuple[str, int]:
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204
        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""UPDATE Users
                                    SET IsActive = 
                                    CASE WHEN IsActive = 1 THEN 0
                                    ELSE 1 END
                                    WHERE UserID = ?""", (user_id,))
        self.commit_changes()

        return self.success_response()
    
    def update_registration(self, user_id: int, program_id: int, num_registered: str) -> bool:
        cursor = self.reset_cursor()

        cursor.execute("SELECT NumRegistered FROM Signed_Up WHERE UserID = ? AND ProgramID = ?", (user_id, program_id))
        prev_num_reg = cursor.fetchone()

        cursor.execute("SELECT MaximumCapacity, CurrentCapacity FROM Programs WHERE ProgramID = ?", (program_id,))
        capacity = cursor.fetchone()

        if (int(capacity[1]) + int(num_registered) - int(prev_num_reg[0])) > int(capacity[0]):
            return False
        
        cursor.execute("""UPDATE Signed_Up
                            SET NumRegistered = ?
                            WHERE UserID = ? AND ProgramID = ?""", (num_registered, user_id, program_id))
        
        cursor.execute("""UPDATE Programs
                            SET CurrentCapacity = CurrentCapacity + ?
                            WHERE ProgramID = ?""", (int(num_registered) - int(prev_num_reg[0]), program_id))
        
        self.commit_changes()
        return True
    
    ######

    ##### Removing from Database #####

    def remove_user(self, user_id: int) -> tuple[str, int]:
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204

        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""UPDATE Users
                                    SET IsActive = 0
                                    WHERE UserID = ?""", (user_id,))
        self.commit_changes()

        return self.success_response()

    def remove_program(self, program: dict) -> tuple[str, int]:
        if not self.check_for_program_by_name(program["name"]):
            return "program not found", 204
        
        cursor = self.reset_cursor()
        # Hard delete programs
        cursor.execute("""DELETE FROM Programs
                                    WHERE Name = ?""", (program["name"],))
        self.commit_changes()

        return self.success_response()
    
    def remove_registration(self, userID: int, programID: int) -> bool:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT NumRegistered FROM Signed_Up WHERE UserID = ? AND ProgramID = ?""", (userID, programID))
        num_registered = cursor.fetchone()
        cursor.execute("""DELETE FROM Signed_Up 
                                WHERE UserID = ? AND ProgramID = ?""", 
                                (userID, programID))
        cursor.execute("""UPDATE Programs
                                SET CurrentCapacity = CurrentCapacity - ?
                                WHERE ProgramID = ? AND CurrentCapacity > 0""", (num_registered[0], programID))
        self.commit_changes()
        return True

    #####

    ##### Validation #####

    def check_for_time_conflict(self, program_id: int, user_id: int) -> bool:
        user_programs = self.get_all_programs_user_signed_up_for(user_id)
        new_program = self.get_program_by_id(program_id)

        return conflict_manager.check_for_conflicts(user_programs, new_program)

    def check_for_user_by_email(self, email: str) -> bool:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Users
                            WHERE Email = ?""", (email,))

        user = cursor.fetchone()

        return user is not None

    def check_for_user_by_id(self, user_id: int) -> bool:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Users
                            WHERE UserID = ?""", (user_id,))

        user = cursor.fetchone()

        return user is not None

    def check_for_program_by_name(self, name: str) -> bool:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Programs
                            WHERE Name = ?""", (name,))
        program = cursor.fetchone()

        return program is not None

    def check_for_program_by_id(self, program_id: int) -> bool:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Programs
                            WHERE ProgramID = ?""", (program_id,))
        program = cursor.fetchone()

        return program is not None

    def is_program_full_by_name(self, name: str) -> int:
        if not self.check_for_program_by_name(name):
            return False
        
        cursor = self.reset_cursor()
        cursor.execute("""SELECT CurrentCapacity, MaximumCapacity
                            FROM Programs
                            WHERE Name = ?""", (name,))

        current_capacity, maximum_capacity = cursor.fetchone()

        return current_capacity < maximum_capacity

    def is_program_full_by_id(self, program_id: int) -> int:
        if not self.check_for_program_by_id(program_id):
            return False
        
        cursor = self.reset_cursor()
        cursor.execute("""SELECT CurrentCapacity, MaximumCapacity
                            FROM Programs
                            WHERE ProgramID = ?""", (program_id,))

        current_capacity, maximum_capacity = cursor.fetchone()

        return current_capacity < maximum_capacity

    def verify_user_login(self, user) -> dict:
        user_id = self.get_user_id(user["email"])

        cursor = self.reset_cursor()       
        cursor.execute("""SELECT *
                            FROM Users
                            WHERE Email = ? AND IsActive = 1""", 
                            (user["email"],))
        
        found_user = cursor.fetchone()
        if found_user is None:
            return None
        
        found_user = util.convert_user_to_json(found_user)
        if (int(util.hash_password(user["password"], user_id)) == int(found_user["password"])):
            return found_user
        
        return None
        
    #####

    ##### Testing #####

    def add_test_user(self) -> tuple[str, int]:
        cursor = self.reset_cursor()
        cursor.execute("""INSERT INTO Users 
                                (FirstName, LastName, Address, PhoneNumber, Email, 
                                Password, ZipCode, Balance, IsStaff, IsMember, IsActive) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                                        ("Bob", "Test", "1234 test street WI", "(111)-222-3333", "bob@test.com", 
                                        "password", "54601", 0, True, True, True))
        self.commit_changes()

        return self.success_response()

    def add_test_program(self, program: dict) -> tuple[str, int]:
        if self.check_for_program_by_name(program["name"]):
            return "program already exists", 409

        cursor = self.reset_cursor()
        cursor.execute('INSERT INTO Programs (Name, Description, OfferingPeriod, Location, Date, Price, Length, MaximumCapacity, CurrentCapacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                                                  (program["name"], program["description"], program["offeringPeriod"], program["location"], program["date"], program["price"], program["length"], program["maxCapacity"], program["currentCapacity"]))
        self.commit_changes()

        return self.success_response()

    ######