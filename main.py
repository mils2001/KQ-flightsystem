from flight_manager import add_flight, view_flights
from booking_manager import book_seat, cancel_booking

def main():
    while True:
        print("\n--- Kenya Airways Flight System ---")
        print("1. Add Flight")
        print("2. Book Seat")
        print("3. View Flights")
        print("4. Cancel Booking")
        print("5. Exit")
        
        choice = input("Select an option: ")

        if choice == '1':
            flight_number = input("Flight Number: ")
            route = input("Route (e.g., Nairobi to Mombasa): ")
            price = float(input("Price (KES): "))
            seats = int(input("Number of Seats: "))
            add_flight(flight_number, route, price, seats)

        elif choice == '2':
            passenger_name = input("Passenger Name: ")
            flight_number = input("Flight Number: ")
            book_seat(passenger_name, flight_number)

        elif choice == '3':
            view_flights()

        elif choice == '4':
            passenger_name = input("Passenger Name to cancel: ")
            flight_number = input("Flight Number: ")
            cancel_booking(passenger_name, flight_number)

        elif choice == '5':
            print("Exiting system.")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()

