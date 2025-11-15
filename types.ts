export enum Page {
  Login,
  Home,
  OnDemand,
  RideGiver,
  RideTaker,
  Buses,
  Community,
  Profile,
}

export interface User {
  name: string;
  dob: string;
  phone: string;
}

export interface Car {
  name: string;
  number: string;
  seats: number;
}

export interface RideUser {
  id: string;
  name: string;
  avatar: string;
  distance: number;
}

export interface Bus {
  id: string;
  name: string;
  eta: number;
  availableSeats: number;
  route: string[];
  livePosition: { lat: number; lng: number };
}

export enum Role {
  Giver = 'Ride Giver',
  Taker = 'Ride Taker',
}

export enum VehicleType {
    Car = 'Car',
    Bike = 'Bike',
}

export interface ChatMessage {
  id: string;
  sender: string; // 'You', member's name, or 'Bot'
  text: string;
  timestamp: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: Role;
  vehicleType: VehicleType;
  schedule: string[]; // e.g., ['Mon', 'Tue', 'Wed']
  startLocation: string;
  endLocation: string;
  areaName: string;
}

export interface SubCommunity {
  id: string;
  vehicleType: VehicleType;
  members: CommunityMember[];
  rotation?: { [day: string]: string }; // Maps day to Giver's name
  messages?: ChatMessage[];
}

export interface Community {
  id: string;
  name: string;
  areaName: string;
  startLocation: string;
  endLocation: string;
  subCommunities: SubCommunity[];
}