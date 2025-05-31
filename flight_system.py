# flight_system.py

flight_data = {}  # key: flight_number, value: dict with route, price, seats, rating

def add_flight():
    while True:
        flight_number = input("\nEnter flight number (or 'done' to stop): ").strip()
        if flight_number.lower() == 'done':
            break
        if flight_number in flight_data:
            print("⚠️ Flight already exists.")
            continue

        route = input("Enter route (e.g., Nairobi to Mombasa): ").strip()
        try:
            price = float(input("Enter flight price (USD): "))
            seats = int(input("Enter number of available seats: "))
            rating = float(input("Enter average passenger rating (1 to 5): "))
        except ValueError:
            print("❌ Invalid input. Try again.")
            continue

        flight_data[flight_number] = {
            "route": route,
            "price": price,
            "seats": seats,
            "rating": rating
        }
        print(f"✅ Added: {flight_number} - {route}")


def view_flights():
    if not flight_data:
        print("\n📭 No flight data available.")
        return
    print("\n📋 Flight List:")
    for num, (flight_number, info) in enumerate(flight_data.items(), start=1):
        print(f"{num}. {flight_number} | {info['route']} | ${info['price']} | {info['seats']} seats | Rating: {info['rating']}")


def delete_flight():
    view_flights()
    if not flight_data:
        return
    flight_number = input("Enter flight number to delete: ").strip()
    if flight_number in flight_data:
        del flight_data[flight_number]
        print(f"🗑️ Deleted flight {flight_number}")
    else:
        print("⚠️ Flight not found.")


def clear_all_flights():
    confirm = input("⚠️ Delete ALL flights? (yes/no): ").lower()
    if confirm == 'yes':
        flight_data.clear()
        print("✅ All flights cleared.")
    else:
        print("Cancelled.")


def edit_flight():
    flight_number = input("Enter flight number to edit: ").strip()
    if flight_number not in flight_data:
        print("⚠️ Flight not found.")
        return

    info = flight_data[flight_number]
    print(f"Editing {flight_number} - {info['route']}")
    new_route = input(f"New route (current: {info['route']}): ") or info['route']
    try:
        new_price = float(input(f"New price (current: {info['price']}): ") or info['price'])
        new_seats = int(input(f"New seats (current: {info['seats']}): ") or info['seats'])
        new_rating = float(input(f"New rating (current: {info['rating']}): ") or info['rating'])
    except ValueError:
        print("❌ Invalid input. Edit cancelled.")
        return

    flight_data[flight_number] = {
        "route": new_route,
        "price": new_price,
        "seats": new_seats,
        "rating": new_rating
    }
    print("✏️ Flight updated successfully.")


def filter_analysis():
    popular_routes = {fn: data for fn, data in flight_data.items() if data['rating'] >= 3}
    expensive_routes = {fn: data for fn, data in flight_data.items() if data['price'] > 500}
    few_seats = {fn: data for fn, data in flight_data.items() if data['seats'] < 10}
    
    destinations = set()
    for data in flight_data.values():
        parts = data['route'].split(" to ")
        if len(parts) == 2:
            destinations.add(parts[0].strip())
            destinations.add(parts[1].strip())
    
    print("\n📊 Filter Results:")
    print(f"- Popular Routes (rating ≥ 3): {list(popular_routes.keys())}")
    print(f"- Expensive Routes (price > $500): {list(expensive_routes.keys())}")
    print(f"- Few Seats (<10): {list(few_seats.keys())}")
    print(f"- Unique Destinations: {sorted(destinations)}")


def main_menu():
    while True:
        print("\n========== KENYA AIRWAYS SYSTEM ==========")
        print("1. Add Flights")
        print("2. View All Flights")
        print("3. Edit a Flight")
        print("4. Delete a Flight")
        print("5. Clear ALL Flights")
        print("6. Show Filtered Analysis")
        print("7. Exit")
        choice = input("Choose an option (1–7): ").strip()

        if choice == '1':
            add_flight()
        elif choice == '2':
            view_flights()
        elif choice == '3':
            edit_flight()
        elif choice == '4':
            delete_flight()
        elif choice == '5':
            clear_all_flights()
        elif choice == '6':
            filter_analysis()
        elif choice == '7':
            print("👋 Goodbye.")
            break
        else:
            print("⚠️ Invalid input.")

# Run the menu
main_menu()

