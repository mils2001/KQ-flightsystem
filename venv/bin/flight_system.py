import json
import os
import random

DATA_FILE = "data.json"

# Load flight data safely from JSON file
def load_flights():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as file:
                content = file.read().strip()
                return json.loads(content) if content else {}
        except json.JSONDecodeError:
            print("⚠️ Warning: data.json is corrupted. Starting with empty data.")
            return {}
    return {}

# Save flights to file
def save_flights(flights):
    with open(DATA_FILE, 'w') as file:
        json.dump(flights, file, indent=4)
    print("✅ Flight data saved.\n")

# Add or edit flight routes
def add_or_edit_flights(flights):
    print("\n🛫 Enter at least 10 flight routes (or type 'done' to stop):")
    while True:
        flight_number = input("Flight Number (e.g. KQ101): ").strip()
        if flight_number.lower() == 'done':
            if len(flights) >= 10:
                break
            else:
                print(f"⚠️ You need at least 10 flights. Currently: {len(flights)}.")
                continue

        route = input(f"Route for {flight_number} (e.g. Nairobi to Mombasa): ").strip()
        price = int(input(f"Enter price for {flight_number}: "))
        seats = int(input(f"Enter available seats for {flight_number}: "))
        rating = float(input(f"Enter passenger rating (1.0 to 5.0) for {flight_number}: "))

        flights[flight_number] = {
            "route": route,
            "price": price,
            "seats": seats,
            "rating": rating
        }
        print(f"✅ Flight {flight_number} added/updated.\n")

    save_flights(flights)

# View all flights
def view_flights(flights):
    if not flights:
        print("No flights available.")
        return

    print("\n📋 All Flight Routes:")
    for flight_no, details in flights.items():
        print(f"{flight_no}: {details['route']}")
        print(f"   💰 Price: ${details['price']}")
        print(f"   💺 Seats: {details['seats']}")
        print(f"   ⭐ Rating: {details['rating']}\n")

# View summaries
def view_summary(flights):
    popular_routes = {f: d for f, d in flights.items() if d["rating"] >= 3}
    expensive_routes = {f: d for f, d in flights.items() if d["price"] > 500}
    few_seats = {f: d for f, d in flights.items() if d["seats"] < 10}

    # Extract unique destinations
    destinations = set()
    for f in flights.values():
        parts = f["route"].split(" to ")
        if len(parts) == 2:
            destinations.update(parts)

    print("\n📈 Summary:")
    print(f"Popular Routes (rating >= 3): {list(popular_routes.keys())}")
    print(f"Expensive Routes (price > $500): {list(expensive_routes.keys())}")
    print(f"Few Seats (less than 10): {list(few_seats.keys())}")
    print(f"Unique Destinations: {sorted(destinations)}\n")

# Reset flight data
def reset_data():
    confirm = input("⚠️ Are you sure you want to delete all flight data? (yes/no): ").lower()
    if confirm == 'yes':
        with open(DATA_FILE, 'w') as file:
            json.dump({}, file)
        print("✅ All flight data has been reset.\n")
    else:
        print("❌ Reset canceled.\n")

# Menu
def main():
    flights = load_flights()

    while True:
        print("\n✈️ Kenya Airways Flight Management System")
        print("1. Add/Edit Flights")
        print("2. View Flights")
        print("3. View Summary")
        print("4. Reset All Flights")
        print("5. Exit")
        choice = input("Choose an option: ")

        if choice == '1':
            add_or_edit_flights(flights)
        elif choice == '2':
            view_flights(flights)
        elif choice == '3':
            view_summary(flights)
        elif choice == '4':
            reset_data()
            flights = {}  # Clear from memory
        elif choice == '5':
            print("Goodbye!")
            break
        else:
            print("❌ Invalid choice. Try again.")

# Run the program
if __name__ == "__main__":
    main()

