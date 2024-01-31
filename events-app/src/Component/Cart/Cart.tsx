import React, { useState } from 'react';
import { Box, Grid } from '@mui/material'
import Typography from '@mui/material/Typography';
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Event } from '../../Types/Event';
import usePathAsTitle from '../../Effects/usePathAsTitle';
import TitleBar from '../Shared/TitleBar/TitleBar';
import EventCard from '../Shared/EventCard/EventCard';

interface CartProps {
  searchText: string;
  cartItems: Event[];
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetFilter: () => void;
  handleRemoveFromCart: (event: Event) => void;
}

function Cart({
  searchText,
  cartItems,
  handleSearch,
  handleResetFilter,
  handleRemoveFromCart
}: CartProps): JSX.Element {
  const [title, setTitle] = useState<string>();

  usePathAsTitle(setTitle);

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
      />
  
      <Box style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Grid item container 
        spacing={2} 
        md={12} 
        alignItems="center"
        justifyContent="center"
        >
          <Grid container item lg={8}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h3" gutterBottom>
                Shopping Cart
              </Typography>
            </Grid>
          </Grid>
    
          <Grid container item lg={8} spacing={2}>
            {cartItems.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                handleRemoveFromCart={handleRemoveFromCart} 
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
        </Grid>
      </Box>
    </HelmetProvider>
    )
}

export default Cart;