import vonage
import os
from dotenv import load_dotenv

load_dotenv()

client = vonage.Client(
    key=os.getenv("VONAGE_API_KEY"),
    secret=os.getenv("VONAGE_API_SECRET")
)
sms = vonage.Sms(client)

def send_booking_sms(phone_number, flight_name, flight_time, client_name=None, custom_message=None):
    if custom_message:
        message = custom_message
    else:
        if client_name:
            message = f"✅ Hi {client_name}, your flight '{flight_name}' is confirmed for {flight_time}."
        else:
            message = f"✅ Your flight '{flight_name}' is confirmed for {flight_time}."

    try:
        response = sms.send_message({
            "from": "Vonage",
            "to": phone_number,
            "text": message,
        })
        if response["messages"][0]["status"] == "0":
            print("✅ Message sent successfully.")
        else:
            print("❌ Message failed with error:", response["messages"][0]["error-text"])
    except Exception as e:
        print("❌ Exception while sending SMS:", str(e))

