import React, { useState, useEffect } from 'react';
import { Page, Bus } from '../types';
import Header from '../components/Header';
import MapPlaceholder from '../components/MapPlaceholder';
import { BusIcon } from '../components/icons/BusIcon';
import { BusStopIllustration } from '../components/illustrations/BusStopIllustration';

const initialBuses: Bus[] = [
    { id: 'B101', name: 'Metro Express', eta: 5, availableSeats: 12, route: ['Downtown', 'Midtown', 'Uptown'], livePosition: { lat: 0, lng: 0 } },
    { id: 'C202', name: 'City Circle', eta: 12, availableSeats: 5, route: ['East Side', 'West Side', 'City Hall'], livePosition: { lat: 0, lng: 0 } },
    { id: 'S303', name: 'Suburb Link', eta: 18, availableSeats: 25, route: ['Suburb A', 'Suburb B', 'Main Station'], livePosition: { lat: 0, lng: 0 } },
];

const BusesPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    const [buses, setBuses] = useState<Bus[]>(initialBuses);
    const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setBuses(prevBuses =>
                prevBuses.map(bus => ({
                    ...bus,
                    eta: Math.max(1, bus.eta - 1),
                    livePosition: {
                        lat: bus.livePosition.lat + (Math.random() - 0.5) * 0.001,
                        lng: bus.livePosition.lng + (Math.random() - 0.5) * 0.001,
                    }
                })).sort((a, b) => a.eta - b.eta)
            );
        }, 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    const BusCard: React.FC<{ bus: Bus }> = ({ bus }) => (
        <div
            onClick={() => setSelectedBus(bus)}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between cursor-pointer transition-transform transform hover:scale-[1.03] shadow-md border border-gray-200 dark:border-gray-700"
        >
            <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mr-4">
                    <BusIcon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{bus.name} <span className="text-sm text-gray-500 dark:text-gray-400">({bus.id})</span></p>
                    <p className="text-sm text-green-600 dark:text-green-400 font-semibold">{bus.eta > 1 ? `${bus.eta} min ETA` : 'Arriving now'}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">{bus.availableSeats} seats</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">available</p>
            </div>
        </div>
    );
    
    if (selectedBus) {
        return (
             <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
                <Header title={`${selectedBus.name} (${selectedBus.id})`} onBack={() => setSelectedBus(null)} />
                <div className="p-4">
                    <MapPlaceholder />
                </div>
                <div className="p-4 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Route Details</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <ul className="space-y-3">
                        {selectedBus.route.map((stop, index) => (
                            <li key={index} className="flex items-center">
                                <div className={`flex flex-col items-center mr-4`}>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    {index < selectedBus.route.length - 1 && <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>}
                                </div>
                                <p className="text-gray-800 dark:text-gray-200">{stop}</p>
                            </li>
                        ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
            <Header title="Nearby Buses" onBack={() => setCurrentPage(Page.Home)} />
             <div className="p-4">
                <MapPlaceholder />
            </div>
            <div className="p-4 space-y-4">
                 <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Buses Arriving Soon</h2>
                {buses.length > 0 ? (
                    buses.map(bus => <BusCard key={bus.id} bus={bus} />)
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8 flex flex-col items-center">
                        <BusStopIllustration className="w-48 h-48 text-gray-400 dark:text-gray-500" />
                        <p className="mt-4 text-lg">No buses nearby at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusesPage;