INSERT INTO Users (FirstName, LastNAme, Address, PhoneNumber, Email, Password, ZipCode, Balance, IsStaff, IsMember, IsActive, FamilyID)
VALUES ("Mr. Admin", "Moderator", "123 Admin Street", "1234567890", "admin@admin.gov", 883, "66666", 0, 1, 1, 1, 1);

INSERT INTO Users (FirstName, LastName, Address, PhoneNumber, Email, Password, ZipCode, Balance, IsStaff, IsMember, IsActive, FamilyID)
VALUES ("Jane", "Doe", "123 Jane Street", "1234567890", "jdoe@email.com", 883, "53256", 0, 0, 1, 1, 2);

INSERT INTO Users (FirstName, LastName, Address, PhoneNumber, Email, Password, ZipCode, Balance, IsStaff, IsMember, IsActive, FamilyID)
VALUES ("Luke", "Anderson", "123 Luke Street", "1234567890", "landerson@email.com", 883, "82364", 0, 0, 1, 1, 3);

INSERT INTO Users (FirstName, LastName, Address, PhoneNumber, Email, Password, ZipCode, Balance, IsStaff, IsMember, IsActive, FamilyID)
VALUES ("Aini", "Anderson", "123 Aini Street", "1234567890", "aanderson@email.com", 883, "32564", 0, 0, 1, 1, 3);

INSERT INTO Programs (Name, Description, OfferingDateFrom, OfferingDateTo, Location, Price, Length, DaysOffered, StartTime, MaximumCapacity, CurrentCapacity)
VALUES ("Shark", "Participants must have passed pike level before.", "2023-05-21", "2023-06-25", "YMCA Onalaska pool,", 96, 40, 1, "17:00", 8, 1);

INSERT INTO Programs (Name, Description, OfferingDateFrom, OfferingDateTo, Location, Price, Length, DaysOffered, StartTime, MaximumCapacity, CurrentCapacity)
VALUES ("Shark", "Participants must have passed pike level before.", "2023-05-21", "2023-06-25", "YMCA Onalaska pool,", 130, 40, 10, "18:00", 8, 1);

INSERT INTO Programs (Name, Description, OfferingDateFrom, OfferingDateTo, Location, Price, Length, DaysOffered, StartTime, MaximumCapacity, CurrentCapacity)
VALUES ("Log Rolling", "", "2023-05-21", "2023-06-25", "YMCA Onalaska pool,", 200, 40, 1, "17:00", 1, 1);

INSERT INTO Programs (Name, Description, OfferingDateFrom, OfferingDateTo, Location, Price, Length, DaysOffered, StartTime, MaximumCapacity, CurrentCapacity)
VALUES ("Log Rolling", "", "2023-05-21", "2023-06-25", "YMCA Onalaska pool,", 200, 40, 2, "18:00", 2, 2);

INSERT INTO Signed_Up (UserID, ProgramID, NumRegistered)
VALUES (2, 1, 1);

INSERT INTO Signed_Up (UserID, ProgramID, NumRegistered)
VALUES (2, 4, 1);

INSERT INTO Signed_Up (UserID, ProgramID, NumRegistered)
VALUES (3, 2, 1);

INSERT INTO Signed_Up (UserID, ProgramID, NumRegistered)
VALUES (3, 3, 1);

INSERT INTO Signed_Up (UserID, ProgramID, NumRegistered)
VALUES (4, 4, 1);