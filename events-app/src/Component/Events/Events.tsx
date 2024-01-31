import React, { useState } from 'react';
import { Avatar, Box, Chip, Grid } from '@mui/material'
import Typography from '@mui/material/Typography';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { formatDate } from '../../Library';
import { Event } from '../../Types';
import EventCard from '../Shared/EventCard/EventCard';
import TitleBar from '../Shared/TitleBar/TitleBar';
import CITY from '../../Constant/CITY';
import LOCALE from '../../Constant/LOCALE';
import PATH from '../../Constant/PATH';
import flag_gb from '../../Assets/flag_gb.png';
import { useNavigate } from 'react-router-dom';
import useFetchEvents from '../../Effects/useFetchEvents';
import usePathAsTitle from '../../Effects/usePathAsTitle';

function Events(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState<string>();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useFetchEvents(setEvents);
  usePathAsTitle(setTitle);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchText.toLowerCase()) ||
    event.venue.name.toLowerCase().includes(searchText.toLowerCase()) ||
    event.artists.some(artist => artist.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  const sortedEvents: { [date: string]: Event[] } = filteredEvents.reduce((acc, event: Event) => {
    const formattedDate = formatDate(event.date, LOCALE.US, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (acc[formattedDate]) {
      acc[formattedDate].push(event);
    } else {
      acc[formattedDate] = [event];
    }
    return acc;
  }, {} as { [date: string]: Event[] });

  const eventDates = Object.keys(sortedEvents);
  const oldestDate = formatDate(eventDates.sort()[0], LOCALE.DE);
  const newestDate = formatDate(eventDates.sort()[eventDates.length - 1], LOCALE.DE);
  const [cartItems, setCartItems] = useState([] as Event[]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleResetFilter = () => {
    setSearchText('')
  }

  const handleAddToCart = (event: Event) => {
    // Remove the event from events
    const updatedEvents = events.filter((e: Event) => e._id !== event._id);

    // Add the event to the cartItems
    const updatedCartItems = [...cartItems, event];

    // Update the state
    setEvents(updatedEvents);
    setCartItems(updatedCartItems);
  };

  const handleOpenCart = () => {
    navigate(PATH.CART, { replace: false });
  }

  return (
    <HelmetProvider>

      <Helmet>
        <title>
          {title ? title : ""}
        </title>
      </Helmet>

      <TitleBar
        searchText={searchText}
        handleSearch={handleSearch}
        handleResetFilter={handleResetFilter}
        cartItems={cartItems}
        handleOpenCart={handleOpenCart}
      />

      <Box style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Grid item container
          spacing={2}
          md={12}
          alignItems="center"
          justifyContent="center"
        >
          <Grid container item lg={8}>
            <Grid item xs={12} paddingTop={1} paddingBottom={1}>
              <Chip avatar={<Avatar alt="British Flag" src={flag_gb} />} label={CITY.LONDON} variant="outlined" />
              <Chip label={`${newestDate} - ${oldestDate}`} variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Public Events
              </Typography>
            </Grid>
          </Grid>

          {Object.entries(sortedEvents).map(([date, events]) => (
            <Grid container item lg={8} spacing={2} key={date}>

              <Grid item xs={12} paddingTop={1} paddingBottom={1} key={date}>
                <Typography padding={1} variant="h6" color={'primary'}>
                  {date}
                </Typography>
              </Grid>

              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  handleAddToCart={handleAddToCart}
                  id={event._id}
                  title={event.title}
                  flyerFront={event.flyerFront}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  attending={event.attending}
                  venue={event.venue}
                  artists={event.artists}
                />
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </HelmetProvider>
  )
}

export default Events;