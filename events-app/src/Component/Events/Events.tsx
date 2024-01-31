import { Avatar, Box, Chip, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Event } from '../../Types';
import EventCard from '../Shared/EventCard/EventCard';
import TitleBar from '../Shared/TitleBar/TitleBar';
import CITY from '../../Constant/CITY';
import flag_gb from '../../Assets/flag_gb.png';
import { useNavigate } from 'react-router-dom';
import PATH from '../../Constant/PATH';
import usePathAsTitle from '../../Effects/usePathAsTitle';
import { useState } from 'react';

interface EventsProps {
  searchText: string;
  cartItems: Event[];
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilter: () => void;
  handleAddToCart: (event: Event) => void;
  sortedEvents: { [date: string]: Event[] };
  oldestDate: string;
  newestDate: string;
}

function Events({
  searchText,
  cartItems,
  handleSearch,
  handleResetFilter,
  handleAddToCart,
  sortedEvents,
  oldestDate,
  newestDate
}: EventsProps): JSX.Element {
  const [title, setTitle] = useState<string>('');
  usePathAsTitle(setTitle);

  const navigate = useNavigate();


  const handleOpenCart = () => {
    navigate(PATH.CART, { replace: false });
  };


  return (
    <HelmetProvider>
      <Helmet>
        <title>{title ? title : ''}</title>
      </Helmet>

      <TitleBar
        searchText={searchText}
        handleSearch={handleSearch}
        handleResetFilter={handleResetFilter}
        cartItems={cartItems}
        handleOpenCart={handleOpenCart}
      />

      <Box style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Grid
          item
          container
          spacing={2}
          md={12}
          alignItems="center"
          justifyContent="center"
        >
          <Grid container item lg={8}>
            <Grid item xs={12} paddingTop={1} paddingBottom={1}>
              <Chip
                avatar={<Avatar alt="British Flag" src={flag_gb} />}
                label={CITY.LONDON}
                variant="outlined"
              />
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
  );
}

export default Events;