import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Events from './Component/Events';
import Cart from './Component/Cart';
import { useState } from 'react';
import useFetchEvents from './Effects/useFetchEvents';
import { Event } from './Types/Event';
import { formatDate } from './Library';
import LOCALE from './Constant/LOCALE';
import DATE_FORMAT from './Constant/DATE_FORMAT';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [cartItems, setCartItems] = useState([] as Event[]);

  useFetchEvents(setEvents);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleResetFilter = () => {
    setSearchText('');
  };

  const handleAddToCart = (event: Event) => {
    // Remove the event from events
    const updatedEvents = events.filter((e: Event) => e._id !== event._id);

    // Add the event to the cartItems
    const updatedCartItems = [...cartItems, event];

    // Update the state
    setEvents(updatedEvents);
    setCartItems(updatedCartItems);
  };

  const handleRemoveFromCart = (event: Event) => {
    // Remove the event from cartItems
    const updatedCartItems = cartItems.filter((e: Event) => e._id !== event._id);

    // Add the event back to events
    const updatedEvents = [...events, event];

    // Update the state
    setEvents(updatedEvents);
    setCartItems(updatedCartItems);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.venue.name.toLowerCase().includes(searchText.toLowerCase()) ||
      event.artists.some((artist) =>
        artist.name.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const sortedEvents: { [date: string]: Event[] } = filteredEvents.reduce(
    (acc, event: Event) => {
      const formattedDate = formatDate(event.date, LOCALE.US, {
        weekday: `${DATE_FORMAT.WEEKDAY_SHORT}`,
        month: `${DATE_FORMAT.MONTH_SHORT}`,
        day: `${DATE_FORMAT.YEAR_NUMERIC}`,
        year: `${DATE_FORMAT.YEAR_NUMERIC}`,
      });
      if (acc[formattedDate]) {
        acc[formattedDate].push(event);
      } else {
        acc[formattedDate] = [event];
      }
      return acc;
    },
    {} as { [date: string]: Event[] }
  );

  const eventDates = Object.keys(sortedEvents);
  const oldestDate = formatDate(eventDates.sort()[0], LOCALE.DE);
  const newestDate = formatDate(
    eventDates.sort()[eventDates.length - 1],
    LOCALE.DE
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/events"
          element={
            <Events
              searchText={searchText}
              sortedEvents={sortedEvents}
              cartItems={cartItems}
              oldestDate={oldestDate}
              newestDate={newestDate}
              handleSearch={handleSearch}
              handleResetFilter={handleResetFilter}
              handleAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              searchText={searchText}
              cartItems={cartItems}
              handleSearch={handleSearch}
              handleResetFilter={handleResetFilter}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;