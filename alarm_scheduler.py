import time
import threading
import os
from notifications import send_booking_sms


def schedule_alarm(phone_number, flight_name, client_name):
    def alarm_task():
        print(f"⏳ Alarm scheduled. Will notify {phone_number} in 1 minute...")
        time.sleep(60)

        message = f"🔔 Don't forget your flight {client_name}, have a safe journey."
        print(f"🔔 Reminder: {message} (sent to {phone_number})")

        # Send SMS reminder
        send_booking_sms(phone_number, flight_name, "", custom_message=message)

        # Optional: Play alarm sound if on Linux
        try:
            os.system('play -n synth 1 sine 1000 vol 1.5')
        except Exception as e:
            print("Sound alert failed:", e)

    threading.Thread(target=alarm_task).start()

