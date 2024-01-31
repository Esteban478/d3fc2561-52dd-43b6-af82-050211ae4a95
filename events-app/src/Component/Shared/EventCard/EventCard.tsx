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
    Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { formatDate } from '../../../Library';
import { Event } from '../../../Types/Event';
import { Venue } from '../../../Types/Venue';
import LOCALE from '../../../Constant/LOCALE';
import URL from '../../../Constant/URL';
import { Artist } from '../../../Types';
import DATE_FORMAT from '../../../Constant/DATE_FORMAT';

interface EventCardProps {
    event: Event;
    id: string;
    title: string;
    flyerFront: string;
    startTime: string;
    endTime: string;
    attending: number;
    venue: Venue;
    artists: Artist[];
    handleAddToCart?: (event: any) => void;
    handleRemoveFromCart?: (event: any) => void;
}

const EventCard = ({
    event,
    title,
    flyerFront,
    startTime,
    endTime,
    attending,
    venue,
    artists,
    id,
    handleAddToCart,
    handleRemoveFromCart
}: EventCardProps) => {
    const handleOpenDirection = () => {
        window.open(venue.direction, '_blank');
    };

    const getArtistNames = (artists: Artist[]) => {
        return artists.map((artist) => artist.name).join(', ');
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
                    sx={{ minHeight: 420, backgroundSize: 'cover', backgroundFit: 'contain'}}
                    image={
                        flyerFront
                            ? flyerFront
                            : URL.NO_IMAGE
                    }
                    title={title}
                />
                    <CardContent sx={{paddingBottom: 0}}>
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
                        {startTime && (
                            <Typography variant="body2" color="text.secondary">
                                Starts:{' '}
                                {formatDate(startTime, LOCALE.DE, {
                                    hour: `${DATE_FORMAT.NUMERIC}`,
                                    minute: `${DATE_FORMAT.NUMERIC}`,
                                    second: `${DATE_FORMAT.NUMERIC}`,
                                })}
                            </Typography>
                        )}

                        {endTime && (
                            <Typography variant="body2" color="text.secondary">
                                Ends:{' '}
                                {formatDate(endTime, LOCALE.DE, {
                                    hour: `${DATE_FORMAT.NUMERIC}`,
                                    minute: `${DATE_FORMAT.NUMERIC}`,
                                    second: `${DATE_FORMAT.NUMERIC}`,
                                })}
                            </Typography>
                        )}
                    <Tooltip title={getArtistNames(artists)}>
                        <Typography noWrap variant="body2" color="text.secondary">
                            {getArtistNames(artists)}
                        </Typography>
                    </Tooltip>
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
                        paddingTop: 0,
                    }}
                >
                    {
                    handleRemoveFromCart && <IconButton
                        color="secondary"
                        aria-label="remove from cart"
                        onClick={() => handleRemoveFromCart(event)}
                    >
                        <RemoveCircleIcon fontSize="large" />
                    </IconButton>
                    }
                    {
                        handleAddToCart && <IconButton
                        color="primary"
                        aria-label="add to cart"
                        onClick={() => handleAddToCart(event)}
                        >
                        <AddCircleIcon fontSize="large" />
                    </IconButton>
                    } 
                </CardActions>
            </Card>
        </Grid>
    );
};

export default EventCard;