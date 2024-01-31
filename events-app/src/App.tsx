import { useState } from 'react';
import { BrowserRouter as Router, Navigate, useRoutes } from 'react-router-dom';
import Events from './Component/Events';
import Cart from './Component/Cart';
import { useFetchEvents } from './Effects';
import { Event } from './Types';
import { formatDate } from './Library';
import { LOCALE, DATE_FORMAT} from './Constant';

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

  const sortedEvents: { [date: string]: Event[] } = filteredEvents
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce((acc, event: Event) => {
      const formattedDate = formatDate(event.date, LOCALE.US, {
        weekday: `${DATE_FORMAT.SHORT}`,
        month: `${DATE_FORMAT.SHORT}`,
        day: `${DATE_FORMAT.NUMERIC}`,
        year: `${DATE_FORMAT.NUMERIC}`,
      });
      if (acc[formattedDate]) {
        acc[formattedDate].push(event);
      } else {
        acc[formattedDate] = [event];
      }
      return acc;
    }, {} as { [date: string]: Event[] });

  const eventDates = Object.keys(sortedEvents);
  const sortedEventDates = eventDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const oldestDate = formatDate(sortedEventDates[0], LOCALE.DE);
  const newestDate = formatDate(sortedEventDates[sortedEventDates.length - 1], LOCALE.DE);
  
  const appRoutes = useRoutes([
    {
      path: '/events',
      element: <Events
        searchText={searchText}
        sortedEvents={sortedEvents}
        cartItems={cartItems}
        oldestDate={oldestDate}
        newestDate={newestDate}
        handleSearch={handleSearch}
        handleResetFilter={handleResetFilter}
        handleAddToCart={handleAddToCart}
      />
    },
    {
      path: '/cart',
      element: <Cart
        searchText={searchText}
        cartItems={cartItems}
        handleSearch={handleSearch}
        handleResetFilter={handleResetFilter}
        handleRemoveFromCart={handleRemoveFromCart}
      />
    },
    {
      path: '/',
      element: <Navigate to="/events" />
    }
  ]);

  return appRoutes;
 }

 export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}