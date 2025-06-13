from twilio.rest import Client
import os

# Load Twilio credentials from environment variables (keep your .env secure!)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TO_PHONE_NUMBER = os.getenv("USER_PHONE_NUMBER")  # Optional: Used for testing

# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_booking_sms(to_phone, flight_name, flight_time):
    try:
        print(f"📲 Sending SMS to {to_phone}...")

        message = client.messages.create(
            body=f"🛫 Your booking for {flight_name} is confirmed! Departure at {flight_time}.",
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone
        )

        print(f"✅ SMS sent to {to_phone}. SID: {message.sid}")

    except Exception as e:
        print(f"❌ Error sending SMS to {to_phone}: {e}")


# ✅ Optional: Run standalone to test SMS delivery
if __name__ == "__main__":
    if TO_PHONE_NUMBER:
        send_booking_sms(TO_PHONE_NUMBER, "KQ123", "2025-06-15 13:30:00")
    else:
        print("❗ USER_PHONE_NUMBER not set in .env file.")

