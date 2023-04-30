r"""This file contains the database class

Author: Eric, Andrew, Will, Charlie

Date Modified: 2023-04-25
"""
import sqlite3
import database.conflict_manager as conflict_manager
import database.util as util
import datetime
from flask import jsonify

class Database:
    r"""
    A class that represents the database
    
    Attributes:
        connection (sqlite3.Connection): The connection to the database
    """
    
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
        r"""Gets the user id of the user with the given email

        Args:
            email (str): The email of the user

        Returns:
            int: The user id of the user with the given email, -1 if the user does not exist
        """
        if not self.check_for_user_by_email(email):
            return -1

        cursor = self.reset_cursor()
        cursor.execute('SELECT UserID FROM Users WHERE Email = ?', (email,))
        return cursor.fetchone()[0]

    def get_program_id(self, name: str) -> int:
        r"""Gets the program id of the program with the given name
        
        Args:
            name (str): The name of the program

        Returns:
            int: The program id of the program with the given name, -1 if the program does not exist
        """
        if not self.check_for_program_by_name(name):
            return -1
        
        cursor = self.reset_cursor()
        cursor.execute('SELECT ProgramID FROM Programs WHERE Name = ?', (name,))
        return cursor.fetchone()[0]
    
    def user_already_signed_up(self, program_id: int, user_id: int):
        r"""Checks if the user is already signed up for the program

        Args:
            program_id (int): The id of the program
            user_id (int): The id of the user

        Returns:
            bool: True if the user is already signed up for the program
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Signed_Up WHERE ProgramID = ? AND UserID = ?""", (program_id, user_id))

        return len(cursor.fetchall()) != 0
        
    #####

    ##### Getting from Database #####
    
    def get_program_by_id(self, program_id: int) -> dict:
        r"""Gets the program with the given id

        Args:
            program_id (int): The id of the program

        Returns:
            dict: The program with the given id
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs WHERE ProgramID = ?""", (program_id,))
        return util.convert_program_to_json(cursor.fetchone())
    
    def get_all_users(self) -> list[dict]:
        r"""Gets all the users in the database
        
        Returns:
            list[dict]: A list of all the users in the database
        """
        cursor = self.reset_cursor()
        cursor.execute('SELECT * FROM Users')
        users = cursor.fetchall()

        return util.convert_users_to_json(users)

    def get_all_programs(self) -> list[dict]:
        r"""Gets all the programs in the database

        Returns:
            list[dict]: A list of all the programs in the database
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs
                                ORDER BY OfferingDateFrom ASC""")
        programs = cursor.fetchall()

        return util.convert_programs_to_json(programs)
    
    def get_user_programs_relation(self, user_id: int) -> list[dict]:
        r"""Gets the relation between the user and the programs they are signed up for

        Args:
            user_id (int): The id of the user

        Returns:
            list[dict]: A list of dictionaries containing the program id and the number of people signed up for the program
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT ProgramID, NumRegistered FROM Signed_Up
                                WHERE UserID = ?""", (user_id,))
        userPrograms = cursor.fetchall()
        return util.convert_user_program_list(userPrograms)
    
    def get_all_programs_user_signed_up_for(self, user_id: int) -> list[dict]:
        r"""Gets all the programs the user is signed up for
            
        Args:
            user_id (int): The id of the user
        
        Returns:
            list[dict]: A list of all the programs the user is signed up for
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT * FROM Programs
                                WHERE ProgramID IN (SELECT ProgramID FROM Signed_Up WHERE UserID = ?)""", (user_id,))
        programs = cursor.fetchall()

        return util.convert_programs_to_json(programs)

    def get_all_signed_up(self) -> list[dict]:
        r"""Gets all the signed up relations in the database

        Returns:
            list[dict]: A list of all the signed up relations in the database
        """
        cursor = self.reset_cursor()
        cursor.execute('SELECT * FROM Signed_UP')
        signed_up = cursor.fetchall()

        return util.convert_signed_up_to_json(signed_up)
    
    def get_user_notifications(self, user_id: int) -> list[dict]:
        cursor = self.reset_cursor()
        cursor.execute("""SELECT Message, Expiration FROM UserNotifications WHERE UserID = ?""", (user_id,))
        notifications = cursor.fetchall()
        notifications = filter(lambda notification: datetime.datetime.strptime(notification[1], "%Y-%m-%d") > datetime.datetime.today(), notifications)
        notifications = [notification[0] for notification in notifications]
        
        return jsonify(notifications)

    #####

    ##### Adding to Database #####

    def add_user(self, user: dict) -> tuple[str, int]:
        r"""Adds a user to the database
        
        Args:
            user (dict): A dictionary containing the user's information

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
                            WHERE UserID = ?""", (util.hash_password(user["password"]), user_id))

        self.commit_changes()

        return self.success_response()
    
    def notify_user(self, program_id: int) -> None:
        r"""Notifies all users signed up for a program that the program has been cancelled

        Args:
            program_id (int): The id of the program

        Returns:
            None
        """
        cursor = self.reset_cursor()
        cursor.execute("SELECT OfferingDateTo, Name, Location, OfferingDateFrom FROM Programs WHERE ProgramID = ?", (program_id,))
        program = cursor.fetchone()
        expiration_date = program[0]
        cursor.execute("SELECT UserID FROM Signed_Up WHERE ProgramID = ?", (program_id,))
        users_signed_up = cursor.fetchall()
        message = f"Program {program[1]} at {program[2]} starting date {program[3]} has been cancelled."
        for user in users_signed_up:
            cursor.execute("INSERT INTO UserNotifications (UserID, Message, Expiration) VALUES (?, ?, ?)", (user[0], message, expiration_date))
        self.commit_changes()

    ##### For staff and membership we will user promotion and demotion end points on already existing users
    # Thus we should user update on user id
    def add_staff(self, user: dict) -> tuple[str, int]:
        r"""Adds a staff member to the database
        
        Args:
            user (dict): A dictionary containing the staff member's information
        
        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
                            WHERE UserID = ?""", (util.hash_password(user["password"]), user_id))

        self.commit_changes()

        return self.success_response()

    def add_program(self, program: dict) -> tuple[str, int]:
        r"""Adds a program to the database

        Args:
            program (dict): A dictionary containing the program's information

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
        r"""Signs a user up for a program

        Args:
            program_id (int): The id of the program
            user_id (int): The id of the user
            num_registered (str): The number of people the user is signing up for

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
    def toggle_user_member(self, user_id: int) -> tuple[str, int]:
        r"""Toggles a user's active status
        
        Args:
            user_id (int): The id of the user

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
        r"""Toggles a user's staff status

        Args:
            user_id (int): The id of the user

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
        r"""Toggles a user's active status

        Args:
            user_id (int): The id of the user

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204
        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""SELECT ProgramId FROM Signed_Up WHERE UserID = ?""", (user_id,))
        
        signedUpPrograms = cursor.fetchall()
        
        for program in signedUpPrograms:
            self.remove_registration(user_id, program[0])
        
        cursor.execute("""UPDATE Users
                                    SET IsActive = 
                                    CASE WHEN IsActive = 1 THEN 0
                                    ELSE 1 END
                                    WHERE UserID = ?""", (user_id,))
        self.commit_changes()

        return self.success_response()
    
    def update_registration(self, user_id: int, program_id: int, num_registered: str) -> bool:
        r"""Updates a user's registration for a program

        Args:
            user_id (int): The id of the user
            program_id (int): The id of the program
            num_registered (str): The number of people the user is signing up for

        Returns:
            bool: True if the update was successful, False otherwise
        """
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
    
    def set_user_family(self, user_id: int, family_id: int) -> tuple[str, int]:
        r"""Sets a user's family id

        Args:
            user_id (int): The id of the user
            family_id (int): The id of the family

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
        if not self.check_for_user_by_id(user_id):
            return "user not found", 204
        if not self.check_for_family_by_id(family_id):
            return "family not found", 204
        
        cursor = self.reset_cursor()
        # Soft delete users
        cursor.execute("""UPDATE Users
                                SET FamilyID = ?
                                WHERE UserID = ?""", (family_id, user_id))
        self.commit_changes()

        return self.success_response()
    
    ######

    ##### Removing from Database #####

    def remove_user(self, user_id: int) -> tuple[str, int]:
        r"""Removes a user from the database

        Args:
            user_id (int): The id of the user

        Returns:
            tuple[str, int]: A tuple containing the response and the status code
        """
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
        
        self.notify_user(programID)
        
        cursor = self.reset_cursor()
        # Hard delete programs
        cursor.execute("""DELETE FROM Programs WHERE ProgramID = ?""", (programID,))
        cursor.execute("""DELETE FROM Signed_Up WHERE ProgramID = ?""", (programID,))
        self.commit_changes()

        return self.success_response()
    
    def remove_registration(self, userID: int, programID: int) -> bool:
        r"""Removes a user's registration for a program

        Args:
            userID (int): The id of the user
            programID (int): The id of the program

        Returns:
            bool: True if the removal was successful, False otherwise
        """
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

    def check_for_family_id(self, family_id: int) -> bool:
        r"""Checks if a family exists in the database

        Args:
            family_id (int): The id of the family

        Returns:
            bool: True if the family exists, False otherwise
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT FamilyID FROM User WHERE FamilyID = ?""", (family_id,))
        return cursor.fetchone() is not None

    def check_for_time_conflict(self, program_id: int, user_id: int) -> bool:
        r"""Checks if a user has a time conflict with a program

        Args:
            program_id (int): The id of the program
            user_id (int): The id of the user

        Returns:
            bool: True if there is a time conflict, False otherwise
        """
        user_programs = self.get_all_programs_user_signed_up_for(user_id)
        new_program = self.get_program_by_id(program_id)

        return conflict_manager.check_for_conflicts(user_programs, new_program)

    def check_for_user_by_email(self, email: str) -> bool:
        r"""Checks if a user exists in the database

        Args:
            email (str): The email of the user

        Returns:
            bool: True if the user exists, False otherwise
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Users
                            WHERE Email = ?""", (email,))

        user = cursor.fetchone()

        return user is not None

    def check_for_user_by_id(self, user_id: int) -> bool:
        r"""Checks if a user exists in the database

        Args:
            user_id (int): The id of the user

        Returns:
            bool: True if the user exists, False otherwise
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Users
                            WHERE UserID = ?""", (user_id,))

        user = cursor.fetchone()

        return user is not None

    def check_for_program_by_name(self, name: str) -> bool:
        r"""Checks if a program exists in the database

        Args:
            name (str): The name of the program

        Returns:
            bool: True if the program exists, False otherwise
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Programs
                            WHERE Name = ?""", (name,))
        program = cursor.fetchone()

        return program is not None

    def check_for_program_by_id(self, program_id: int) -> bool:
        r"""Checks if a program exists in the database
            
        Args:
            program_id (int): The id of the program

        Returns:
            bool: True if the program exists, False otherwise
        """
        cursor = self.reset_cursor()
        cursor.execute("""SELECT *
                            FROM Programs
                            WHERE ProgramID = ?""", (program_id,))
        program = cursor.fetchone()

        return program is not None

    def is_program_full_by_name(self, name: str) -> int:
        r"""Checks if a program is full

        Args:
            name (str): The name of the program

        Returns:
            int: True if the program is full, False otherwise
        """
        if not self.check_for_program_by_name(name):
            return False
        
        cursor = self.reset_cursor()
        cursor.execute("""SELECT CurrentCapacity, MaximumCapacity
                            FROM Programs
                            WHERE Name = ?""", (name,))

        current_capacity, maximum_capacity = cursor.fetchone()

        return current_capacity < maximum_capacity

    def is_program_full_by_id(self, program_id: int) -> int:
        r"""Checks if a program is full

        Args:
            program_id (int): The id of the program

        Returns:
            int: True if the program is full, False otherwise
        """
        if not self.check_for_program_by_id(program_id):
            return False
        
        cursor = self.reset_cursor()
        cursor.execute("""SELECT CurrentCapacity, MaximumCapacity
                            FROM Programs
                            WHERE ProgramID = ?""", (program_id,))

        current_capacity, maximum_capacity = cursor.fetchone()

        return current_capacity < maximum_capacity

    def verify_user_login(self, user) -> dict:
        r"""Verifies a user's login credentials

        Args:
            user (dict): The user's login credentials

        Returns:
            dict: The user's information if the login was successful, None otherwise
        """
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
        if (int(util.hash_password(user["password"])) == int(found_user["password"])):
            return found_user
        
        return None