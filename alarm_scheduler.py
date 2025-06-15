# alarm_scheduler.py
from datetime import datetime, timedelta
import threading
import time

def alarm_task(user_phone, flight_name, flight_time):
    # Wait until the scheduled time
    now = datetime.now()
    delay = (flight_time - timedelta(hours=1) - now).total_seconds()
    if delay > 0:
        time.sleep(delay)

    print(f"🔔 ALARM: Reminder for {user_phone} — Flight '{flight_name}' departs at {flight_time}.")

def schedule_alarm(user_phone, flight_name, flight_time_str):
    # Convert string to datetime
    flight_time = datetime.strptime(flight_time_str, "%H:%M:%S")  # assuming format "HH:MM:SS"
    flight_time = datetime.combine(datetime.today(), flight_time.time())

    # Create a new thread for the alarm
    threading.Thread(target=alarm_task, args=(user_phone, flight_name, flight_time)).start()

