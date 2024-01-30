import React, { useEffect, useState } from 'react';
import { Avatar, Badge, BadgeProps, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Grid } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { Helmet, HelmetProvider } from "react-helmet-async";
import '/src/App.css';
import { formatDate } from '../../Library';
import { Event } from '../../Types/Event';
import LOCALE from '../../Constant/LOCALE';
import URL from '../../Constant/URL';
import CITY from '../../Constant/CITY';
import PATH from '../../Constant/PATH';
import PAGE_TITLE from '../../Constant/TITLE';
import flag_gb from '../../Assets/flag_gb.png';
import {useNavigate} from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginRight: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 16,
  },
}));

function Cart(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState<string>();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(URL.BASE_URL);
        const events = (await response.json()) as Event[];
        setEvents(events);
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("Aborted");
          return;
        }
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Set the title based on the current route
    if (location.pathname === PATH.EVENTS) {
      setTitle(PAGE_TITLE.EVENTS);
    } else if (location.pathname === PATH.CART) { 
      setTitle(PAGE_TITLE.CART);
  }}, [location]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
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
    navigate(PATH.CART, {replace: false});  
  }

  return (
  <HelmetProvider>
    <Helmet>
      <title>
        {title ? title : ""}
      </title>
    </Helmet>
    <Box sx={{ height: 64 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchText}
              onChange={handleSearch}
            />
          </Search>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="clear-filter"
            sx={{ mr: 4 }}
          >
          {searchText ? 
            <FilterAltOffOutlinedIcon
              onClick={handleResetFilter}
            />
            : 
            <FilterAltOutlinedIcon/>}
          </IconButton>
          <StyledBadge             
          sx={{ marginLeft: 'auto'}}
          badgeContent={cartItems.length}
          color="secondary">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="shopping-cart"
              disabled={cartItems.length === 0}
              onClick={handleOpenCart}
            >
              <ShoppingCartOutlinedIcon/>
            </IconButton>
          </StyledBadge>
        </Toolbar>
      </AppBar>
    </Box>
    <Box style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
    <Grid item container 
      spacing={2} 
      md={12} 
      alignItems="center"
      justifyContent="center"
      >
      {Object.entries(sortedEvents).map(([date]) => (
        <Grid container item lg={8} spacing={2} key={date}>
          {cartItems.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <Card sx={{ minHeight: 600}} key={event._id}>
              <CardHeader
                sx={{ 
                  height: 60
                }}
                avatar={
                  <Avatar aria-label="event">
                    S
                  </Avatar>
                }
                title={event.title}
              />
              <CardMedia
                sx={{minHeight: 420, objectFit: "contain" }}
                image={event.flyerFront? event.flyerFront : "https://via.placeholder.com/300x300.png?text=No+Image"}
                title={event.title}
              />
              <CardContent>
                <Typography variant="body1" color="text.primary">
                <IconButton
                  size="small"
                  edge="start"
                  sx={{ mb: 1}}
                  color="primary"
                  aria-label="show-location"
                  onClick={() => window.open(event.venue.direction, "_blank")}
                >
                  <LocationOnIcon fontSize='small'/>
                </IconButton>                    
                  {event.venue.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Starts: {formatDate(event.startTime, LOCALE.DE, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ends: {formatDate(event.endTime, LOCALE.DE ,{ hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                </Typography>
                  <div style={{ display: "inline-flex", padding: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {event.attending}
                    </Typography>
                    <PeopleAltOutlinedIcon fontSize='small'/>
                  </div>
              </CardContent>
              <CardActions
                disableSpacing
                sx={{
                  alignSelf: "stretch",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  p: 1,
                }}
              >
                <IconButton
                  color="primary"
                  aria-label="add to cart"
                  onClick={() => handleAddToCart(event)}
                >
                  <AddCircleIcon fontSize="large" />
                </IconButton>
              </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ))}
      </Grid>
    </Box>
  </HelmetProvider>
  )
}

export default Cart;