import os
from dotenv import load_dotenv
import vonage

load_dotenv()

def send_booking_sms(to_number, flight_name, flight_time):
    api_key = os.getenv("VONAGE_API_KEY")
    api_secret = os.getenv("VONAGE_API_SECRET")
    from_number = os.getenv("VONAGE_VIRTUAL_NUMBER")

    client = vonage.Client(key=api_key, secret=api_secret)
    sms = vonage.Sms(client)

    text = f"Booking confirmed for {flight_name} at {flight_time}."

    responseData = sms.send_message({
        "from": from_number,
        "to": to_number,
        "text": text,
    })

    if responseData["messages"][0]["status"] == "0":
        print("✅ Message sent successfully.")
    else:
        print("❌ Message failed:", responseData["messages"][0]["error-text"])

