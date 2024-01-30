import { useEffect, useState } from 'react';
import { Avatar, Badge, BadgeProps, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, Grid } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '/src/App.css';
import BASE_URL from '../../Constant/URL';

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

interface Event {
  _id: string;
  title: string;
  flyerFront: string;
  attending: number;
  date: string;
  venue: Venue;
  startTime: string;
  endTime: string;
  city: string;
  country: string;
}

interface Venue {
  id: string
  name: string
  contentUrl: string
  live: boolean
  direction: string
}

function Cart(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}`);
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

  function formatDate(date: string, locale?: string, options?: Object): string {
    const formattedDate = new Date(date).toLocaleDateString(locale, options);
    return formattedDate;
  }

  const sortedEvents: { [date: string]: Event[] } = events.reduce((acc, event: Event) => {
    const formattedDate = formatDate(event.date, 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (acc[formattedDate]) {
      acc[formattedDate].push(event);
    } else {
      acc[formattedDate] = [event];
    }
    return acc;
  }, {} as { [date: string]: Event[] });

  const eventDates = Object.keys(sortedEvents);
  const oldestDate = formatDate(eventDates.sort()[0], 'de-DE');
  const newestDate = formatDate(eventDates.sort()[eventDates.length - 1], 'de-DE');
  const [cartItems, setCartItems] = useState([] as Event[]);

  const handleAddToCart = (event: Event) => {
    // Remove the event from groupedEvents
    const updatedEvents = events.filter((e: Event) => e._id !== event._id);

    // Add the event to cartItems
    const updatedCartItems = [...cartItems, event];

    // Update the state
    setEvents(updatedEvents);
    setCartItems(updatedCartItems);

    console.log(updatedCartItems)
  };

  return (
    <>
    <Box sx={{ height: 60 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="clear-filter"
            sx={{ mr: 4 }}
          >
            <FilterAltOutlinedIcon />
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
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </StyledBadge>
        </Toolbar>
      </AppBar>
    </Box>

    <Grid item container 
      spacing={2} 
      md={12} 
      alignItems="center"
      justifyContent="center"
      >
      <Grid container item lg={8}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Shopping Cart
          </Typography>
        </Grid>
          <Grid container item xs={12} spacing={2}>
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
                  <Typography variant="body1" color="text.secondary">
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
                    | Starts: {formatDate(event.startTime, 'de-DE', { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    | Ends: {formatDate(event.endTime, 'de-DE' ,{ hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                  </Typography>
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
      </Grid>
    </Grid>
    </>
  )
}

export default Cart;