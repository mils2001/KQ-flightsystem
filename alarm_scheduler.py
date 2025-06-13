# alarm_scheduler.py

import datetime
import threading
import time

def schedule_alarm(user_phone, flight_name, flight_time):
    """
    Schedule an alarm 1 hour before the flight_time.
    This function runs in a separate thread to simulate the alarm.
    """
    try:
        # Convert flight_time string (e.g., '2025-06-14 15:30') to datetime
        flight_dt = datetime.datetime.strptime(flight_time, "%Y-%m-%d %H:%M")
        alarm_time = flight_dt - datetime.timedelta(hours=1)
        now = datetime.datetime.now()
        delay = (alarm_time - now).total_seconds()

        if delay <= 0:
            print("Alarm time is in the past. Skipping alarm.")
            return

        def alarm():
            print(f"🔔 ALARM: Reminder for flight '{flight_name}' (User phone: {user_phone}) at {flight_time}")

        # Run alarm in a separate thread after the delay
        threading.Timer(delay, alarm).start()
        print(f"Alarm scheduled in {int(delay)} seconds for flight '{flight_name}'.")

    except Exception as e:
        print("Error scheduling alarm:", str(e))
