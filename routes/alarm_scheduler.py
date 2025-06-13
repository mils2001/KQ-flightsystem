from apscheduler.schedulers.background import BackgroundScheduler
from datetime import timedelta
from notifications import send_booking_sms

scheduler = BackgroundScheduler()
scheduler.start()

def schedule_alarm(phone_number, flight_name, flight_time):
    # Run one hour before the flight
    alarm_time = flight_time - timedelta(hours=1)

    scheduler.add_job(
        func=send_booking_sms,
        trigger='date',
        run_date=alarm_time,
        args=[phone_number, flight_name, flight_time],
        id=f'alarm_{phone_number}_{flight_time}'
    )
    print(f"⏰ Alarm set for {phone_number} at {alarm_time}")
