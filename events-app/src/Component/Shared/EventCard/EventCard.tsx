import {
    Grid,
    Card,
    CardHeader,
    Avatar,
    CardMedia,
    CardContent,
    Typography,
    IconButton,
    CardActions,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { formatDate } from '../../../Library';
import { Event } from '../../../Types/Event';
import { Venue } from '../../../Types/Venue';
import LOCALE from '../../../Constant/LOCALE';

interface EventCardProps {
    event: Event;
    id: string;
    title: string;
    flyerFront: string;
    startTime: string;
    endTime: string;
    attending: number;
    venue: Venue;
    handleAddToCart: (event: any) => void;
}

const EventCard = ({
    event,
    title,
    flyerFront,
    startTime,
    endTime,
    attending,
    venue,
    id,
    handleAddToCart,
}: EventCardProps) => {
    const handleOpenDirection = () => {
        window.open(venue.direction, '_blank');
    };

    return (
        <Grid item xs={12} sm={6} md={4} key={id}>
            <Card sx={{ minHeight: 600 }} key={id}>
                <CardHeader
                    sx={{
                        height: 60,
                    }}
                    avatar={<Avatar aria-label="event">S</Avatar>}
                    title={title}
                />
                <CardMedia
                    sx={{ minHeight: 420, objectFit: 'contain' }}
                    image={
                        flyerFront
                            ? flyerFront
                            : 'https://via.placeholder.com/300x300.png?text=No+Image'
                    }
                    title={title}
                />
                <CardContent>
                    <Typography variant="body1" color="text.primary">
                        <IconButton
                            size="small"
                            edge="start"
                            sx={{ mb: 1 }}
                            color="primary"
                            aria-label="show-location"
                            onClick={handleOpenDirection}
                        >
                            <LocationOnIcon fontSize="small" />
                        </IconButton>
                        {venue.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Starts:{' '}
                        {formatDate(startTime, LOCALE.DE, {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                        })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Ends:{' '}
                        {formatDate(endTime, LOCALE.DE, {
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                        })}
                    </Typography>
                    <div style={{ display: 'inline-flex', padding: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            {attending}
                        </Typography>
                        <PeopleAltOutlinedIcon fontSize="small" />
                    </div>
                </CardContent>
                <CardActions
                    disableSpacing
                    sx={{
                        alignSelf: 'stretch',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
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
    );
};

export default EventCard;
