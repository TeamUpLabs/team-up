export type EventType = 'hackathon' | 'conference' | 'meetup';
export type EventSize = 'small' | 'medium' | 'large';
export type EventColor = 'violet' | 'green' | 'pink' | 'emerald' | 'amber' | 'red' | 'blue';

export interface Event {
  id: number;
  title: string;
  type: EventType;
  date: string;
  location: string;
  attendees: number;
  price: string;
  image?: string;
  size?: EventSize;
  color: EventColor;
  description: string;
  fullDescription: string;
  organizer: string;
  schedule: string[];
  tags: string[];
}