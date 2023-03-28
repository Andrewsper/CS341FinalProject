def get_binary_representation(num: int) -> int:
    return int(bin(num)[2:], base=2)

days_of_the_week = {
    "Sunday": get_binary_representation(1),
    "Monday": get_binary_representation(2),
    "Tuesday": get_binary_representation(4),
    "Wednesday": get_binary_representation(8),
    "Thursday": get_binary_representation(16),
    "Friday": get_binary_representation(32),
    "Saturday": get_binary_representation(64)
}

def get_days_of_the_week(days: int) -> list[str]:
    days_offered = list()
    for key, value in days_of_the_week.items():
        if value & days:
            days_offered.append(key)
    return days_offered

def convert_days_to_binary(days: list[str]) -> int:
    binary = 0
    for day in days:
        binary |= days_of_the_week[day]
    return binary

def convert_military_time_to_minutes(time: str) -> int:
    time = time.split(":")
    return int(time[0]) * 60 + int(time[1])

def check_for_potential_conflict(existing_program_start: int, existing_program_end: int, new_program_start: int, new_program_end: int):
    if existing_program_start <= new_program_start and new_program_end <= existing_program_end:
        return True
    if new_program_start <= existing_program_start and existing_program_end <= new_program_end:
        return True
    if existing_program_start <= new_program_start and existing_program_end <= new_program_start:
        return True
    if new_program_start <= existing_program_start and existing_program_end <= new_program_end:
        return True
    
    return False

def check_for_conflicts(user_program: list, new_program: dict) -> bool:
    """
    Check if a program conflicts with any other program in the list

    Returns True if there is a conflict, False otherwise
    """
    print("user_program", user_program)
    print("new_program", new_program)
    
    if len(user_program) == 0 or len(new_program) == 0:
        return False

    new_program_days = convert_days_to_binary(new_program["daysOffered"])

    new_program_start_time = convert_military_time_to_minutes(new_program["startTime"])
    new_program_end_time = new_program_start_time + int(new_program["length"])

    new_program_offering_from = new_program["offeringDateFrom"]
    new_program_offering_to = new_program["offeringDateTo"]

    new_program_offering_from_year = int(new_program_offering_from.split("-")[0])
    new_program_offering_from_month = int(new_program_offering_from.split("-")[1])
    new_program_offering_from_day = int(new_program_offering_from.split("-")[2])

    new_program_offering_to_year = int(new_program_offering_to.split("-")[0])

    new_program_offering_to_month = int(new_program_offering_to.split("-")[1])
    new_program_offering_to_day = int(new_program_offering_to.split("-")[2])

    for p in user_program:

        p_program_days = convert_days_to_binary(p["daysOffered"])        

        p_program_start_time = convert_military_time_to_minutes(p["startTime"])
        p_program_end_time = p_program_start_time + int(p["length"])

        p_program_offering_from = p["offeringDateFrom"]
        p_program_offering_to = p["offeringDateTo"]

        p_program_offering_from_year = int(p_program_offering_from.split("-")[0])
        p_program_offering_from_month = int(p_program_offering_from.split("-")[1])
        p_program_offering_from_day = int(p_program_offering_from.split("-")[2])

        p_program_offering_to_year = int(p_program_offering_to.split("-")[0])
        p_program_offering_to_month = int(p_program_offering_to.split("-")[1])
        p_program_offering_to_day = int(p_program_offering_to.split("-")[2])

        if check_for_potential_conflict(p_program_offering_from_year, p_program_offering_to_year, new_program_offering_from_year, new_program_offering_to_year) and \
           check_for_potential_conflict(p_program_offering_from_month, p_program_offering_to_month, new_program_offering_from_month, new_program_offering_to_month) and \
           check_for_potential_conflict(p_program_offering_from_day, p_program_offering_to_day, new_program_offering_from_day, new_program_offering_to_day) and \
           check_for_potential_conflict(p_program_days, new_program_days, p_program_days, new_program_days) and \
           check_for_potential_conflict(p_program_start_time, p_program_end_time, new_program_start_time, new_program_end_time) and \
           p_program_days & new_program_days:
            return True
        
    return False