import { Artist } from ".";
import { Venue } from "./Venue";

export interface Event {
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
  artists: Artist[];
  }