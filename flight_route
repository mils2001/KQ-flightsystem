def enter_flight_routes():
    flight_routes = []
    print("Enter flight routes (e.g., AA101, Nairobi to Mombasa). Type 'quit' to stop.")
    
    while True:
        flight_number = input("Enter flight number (or type 'quit' to stop): ").strip()
        if flight_number.lower() == 'quit':
            if len(flight_routes) >= 10:
                break
            else:
                print(f"You need at least 10 flight routes. Currently, you have {len(flight_routes)}.")
                continue
        
        route = input(f"Enter route for {flight_number} (e.g., Nairobi to Mombasa): ").strip()
        flight_routes.append((flight_number, route))
        print(f"Flight added: {flight_number} - {route}")
    
    return flight_routes

# Call the function
flight_routes = enter_flight_routes()
print("\nFinal List of Flight Routes:")
for flight in flight_routes:
    print(flight)
