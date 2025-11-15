import React, { useState, useEffect } from 'react';
import { Page, RideUser } from '../types';
import Header from '../components/Header';
import MapPlaceholder from '../components/MapPlaceholder';

interface RideTakerPageProps {
  setCurrentPage: (page: Page) => void;
}

const mockGivers: RideUser[] = [
    { id: '4', name: 'David', avatar: 'https://picsum.photos/seed/user4/100', distance: 0.8 },
    { id: '5', name: 'Eve', avatar: 'https://picsum.photos/seed/user5/100', distance: 1.5 },
    { id: '6', name: 'Frank', avatar: 'https://picsum.photos/seed/user6/100', distance: 2.2 },
];

const RideTakerPage: React.FC<RideTakerPageProps> = ({ setCurrentPage }) => {
    const [step, setStep] = useState(1);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] =useState('');
    const [distance, setDistance] = useState(0);
    const [dateTime, setDateTime] = useState('');
    const [passengers, setPassengers] = useState(1);

    // Mock distance calculation since the interactive map is replaced
    useEffect(() => {
        if (startLocation && endLocation) {
            const combined = startLocation + endLocation;
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                hash = combined.charCodeAt(i) + ((hash << 5) - hash);
            }
            const randomDistance = (hash & 0xffff) / 65535 * 25 + 5;
            setDistance(randomDistance);
        } else {
            setDistance(0);
        }
    }, [startLocation, endLocation]);

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const UserCard: React.FC<{ user: RideUser }> = ({ user }) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.distance} km from your start</p>
                </div>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow">
                Request
            </button>
        </div>
    );
    
    if (step === 2) {
         return (
            <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
                <Header title="Available Ride Givers" onBack={() => setStep(1)} />
                <div className="p-4">
                    <MapPlaceholder />
                </div>
                <div className="p-4 space-y-4">
                    {mockGivers.map(giver => <UserCard key={giver.id} user={giver} />)}
                </div>
            </div>
        );
    }
    

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
            <Header title="Find a Ride" onBack={() => setCurrentPage(Page.OnDemand)} />
            <div className="p-4">
                <MapPlaceholder />
            </div>
            <form onSubmit={handleConfirm} className="p-4 space-y-4 flex-grow flex flex-col">
                <input type="text" placeholder="Start Location" value={startLocation} onChange={e => setStartLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                <input type="text" placeholder="End Location" value={endLocation} onChange={e => setEndLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                {distance > 0 && <p className="text-center text-gray-600 dark:text-gray-400 -mt-2">Estimated distance: {distance.toFixed(1)} km</p>}
                <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500" required style={{colorScheme: 'dark'}} />
                
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Number of Passengers: {passengers}</label>
                    <input type="range" min="1" max="8" value={passengers} onChange={e => setPassengers(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                </div>
                
                <div className="flex-grow"></div>

                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition sticky bottom-4 shadow-lg">
                    Confirm & Find Givers
                </button>
            </form>
        </div>
    );
};

export default RideTakerPage;