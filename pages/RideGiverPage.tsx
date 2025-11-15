import React, { useState, useEffect } from 'react';
import { Page, Car, RideUser } from '../types';
import Header from '../components/Header';
import MapPlaceholder from '../components/MapPlaceholder';

interface RideGiverPageProps {
  setCurrentPage: (page: Page) => void;
}

const mockTakers: RideUser[] = [
    { id: '1', name: 'Alice', avatar: 'https://picsum.photos/seed/user1/100', distance: 1.2 },
    { id: '2', name: 'Bob', avatar: 'https://picsum.photos/seed/user2/100', distance: 2.5 },
    { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/seed/user3/100', distance: 3.1 },
];

const RideGiverPage: React.FC<RideGiverPageProps> = ({ setCurrentPage }) => {
    const [step, setStep] = useState(1); // 1: Form, 2: Confirmation, 3: Available Takers
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [distance, setDistance] = useState(0);
    const [car, setCar] = useState<Car>({ name: '', number: '', seats: 4 });
    const [saveCar, setSaveCar] = useState(false);
    const [radius, setRadius] = useState(5);

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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.distance} km away</p>
                </div>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition shadow">
                Accept
            </button>
        </div>
    );
    
    if (step === 3) {
        return (
            <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
                <Header title="Available Ride Takers" onBack={() => setStep(1)} />
                <div className="p-4">
                    <MapPlaceholder />
                </div>
                <div className="p-4 space-y-4">
                    {mockTakers.map(taker => <UserCard key={taker.id} user={taker} />)}
                </div>
            </div>
        );
    }
    
    if (step === 2) {
        return (
            <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
                <Header title="Confirm Your Ride" onBack={() => setStep(1)} />
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Ride Details</h2>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-2 shadow-md border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">From:</span> {startLocation}</p>
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">To:</span> {endLocation}</p>
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">Distance:</span> {distance.toFixed(1)} km</p>
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">Car:</span> {car.name} ({car.number})</p>
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">Seats:</span> {car.seats}</p>
                            <p className="text-gray-800 dark:text-gray-200"><span className="font-semibold text-gray-500 dark:text-gray-400">Radius:</span> {radius} km</p>
                        </div>
                    </div>
                    <button onClick={() => setStep(3)} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-md">
                        Find Ride Takers
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
            <Header title="Offer a Ride" onBack={() => setCurrentPage(Page.OnDemand)} />
            <div className="p-4">
                <MapPlaceholder />
            </div>
            <form onSubmit={handleConfirm} className="p-4 space-y-4 flex-grow flex flex-col">
                <input type="text" placeholder="Start Location" value={startLocation} onChange={e => setStartLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                <input type="text" placeholder="End Location" value={endLocation} onChange={e => setEndLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Car Details</h3>
                    <input type="text" placeholder="Car Name (e.g., Toyota Camry)" value={car.name} onChange={e => setCar({...car, name: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600" required />
                    <input type="text" placeholder="Car Number (e.g., ABC-123)" value={car.number} onChange={e => setCar({...car, number: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600" required />
                    <input type="number" placeholder="Seats Available" value={car.seats} onChange={e => setCar({...car, seats: parseInt(e.target.value)})} className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600" min="1" max="8" required />
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <input type="checkbox" checked={saveCar} onChange={e => setSaveCar(e.target.checked)} className="form-checkbox h-5 w-5 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded text-yellow-500 focus:ring-yellow-500" />
                        <span>Save Car for future rides</span>
                    </label>
                </div>
                
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Search Radius: {radius} km</label>
                    <input type="range" min="1" max="20" value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                </div>
                
                <div className="flex-grow"></div>
                
                <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition sticky bottom-4 shadow-lg">
                    Confirm & Show Takers
                </button>
            </form>
        </div>
    );
};

export default RideGiverPage;