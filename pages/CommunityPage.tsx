import React, { useState, useRef, useEffect } from 'react';
import { Page, Role, VehicleType, Community, CommunityMember, SubCommunity, ChatMessage } from '../types';
import Header from '../components/Header';
import { getYourCommunities, findAvailableCommunities, createCommunity, joinCommunity, generateBotResponse, leaveCommunity } from '../services/communityService';
import { CarIcon } from '../components/icons/CarIcon';
import MapPlaceholder from '../components/MapPlaceholder';
import { CommunityIllustration } from '../components/illustrations/CommunityIllustration';

const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ScheduleCalendar: React.FC<{ schedule: string[] }> = ({ schedule }) => {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = Array.from({ length: firstDayOfMonth }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4">
            <h3 className="text-lg font-bold text-center mb-2 text-gray-800 dark:text-gray-200">{today.toLocaleString('default', { month: 'long' })} {year}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                {dayMap.map(d => <div key={d}>{d.slice(0, 1)}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`}></div>;
                    const date = new Date(year, month, day);
                    const dayOfWeek = dayMap[date.getDay()];
                    const isActive = schedule.includes(dayOfWeek);
                    return (
                        <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-red-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const CommunityPage: React.FC<{ setCurrentPage: (page: Page) => void }> = ({ setCurrentPage }) => {
    type CommunityView = 'your' | 'find' | 'create' | 'chat';
    const [view, setView] = useState<CommunityView>('your');
    const [yourCommunities, setYourCommunities] = useState<Community[]>([]);
    const [foundCommunities, setFoundCommunities] = useState<Community[]>([]);
    
    const [selectedSubCommunity, setSelectedSubCommunity] = useState<SubCommunity | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Form state (used for both find and create)
    const [startLocation, setStartLocation] = useState('Downtown');
    const [endLocation, setEndLocation] = useState('Tech Park');
    const [distance, setDistance] = useState(0);
    const [radius, setRadius] = useState(2);
    const [areaName, setAreaName] = useState('Metro Area');
    const [role, setRole] = useState<Role>(Role.Taker);
    const [schedule, setSchedule] = useState<string[]>(['Mon', 'Wed', 'Fri']);
    const [vehicle, setVehicle] = useState<VehicleType>(VehicleType.Car);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    useEffect(() => {
        if (view === 'your') {
            setYourCommunities(getYourCommunities('currentUser'));
        }
    }, [view]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedSubCommunity?.messages, isBotTyping]);

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

    const toggleDay = (day: string) => {
        setSchedule(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchCriteria = { role, vehicleType: vehicle, schedule, startLocation, endLocation, areaName };
        const results = findAvailableCommunities(searchCriteria);
        setFoundCommunities(results);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const userPrefs: CommunityMember = {
            id: 'currentUser', name: 'You', role,
            vehicleType: role === Role.Giver ? vehicle : VehicleType.Car,
            schedule, startLocation, endLocation, areaName,
        };
        const newCommunity = createCommunity(userPrefs);
        if (newCommunity) {
            alert('Community created successfully!');
            setView('your');
        } else {
            alert('Could not find enough members to create a new community.');
        }
    };
    
    const handleJoin = (communityId: string, subCommunityId: string) => {
        const user: CommunityMember = {
            id: 'currentUser', name: 'You', role,
            vehicleType: role === Role.Giver ? vehicle : VehicleType.Car,
            schedule, startLocation, endLocation, areaName,
        };
        joinCommunity(communityId, subCommunityId, user);
        alert(`Joined ${subCommunityId} in ${communityId}!`);
        setFoundCommunities([]);
        setView('your');
    };

    const handleLeaveCommunity = (communityId: string, subCommunityId: string) => {
        if (window.confirm("Are you sure you want to leave this community group?")) {
            const success = leaveCommunity(communityId, subCommunityId, 'currentUser');
            if (success) {
                alert("You have left the community.");
                setYourCommunities(getYourCommunities('currentUser'));
            } else {
                alert("Failed to leave the community. Please try again.");
            }
        }
    };

    const handleSelectSubCommunity = (sub: SubCommunity, community: Community) => {
        setSelectedSubCommunity(sub);
        setSelectedCommunity(community);
        setView('chat');
    };
    
    const handleSendMessage = async (text: string) => {
        if (!selectedSubCommunity || !selectedCommunity) return;

        const userMessage: ChatMessage = { id: `msg-${Date.now()}`, sender: 'You', text, timestamp: Date.now() };
        const updatedMessages = [...(selectedSubCommunity.messages || []), userMessage];
        
        const updateSubCommunityMessages = (msgs: ChatMessage[]) => {
            setSelectedSubCommunity(prev => prev ? { ...prev, messages: msgs } : null);
            setYourCommunities(prevComms => prevComms.map(c => 
                c.id === selectedCommunity.id ? {
                    ...c,
                    subCommunities: c.subCommunities.map(sc => 
                        sc.id === selectedSubCommunity.id ? { ...sc, messages: msgs } : sc
                    )
                } : c
            ));
        }

        updateSubCommunityMessages(updatedMessages);
        setIsBotTyping(true);
        const botResponseText = await generateBotResponse(updatedMessages, 'You');
        const botMessage: ChatMessage = { id: `msg-${Date.now() + 1}`, sender: 'Alex (Bot)', text: botResponseText, timestamp: Date.now() };
        updateSubCommunityMessages([...updatedMessages, botMessage]);
        setIsBotTyping(false);
    };

    const ChatView = () => {
        const [message, setMessage] = useState('');
        if (!selectedSubCommunity) return null;
        
        const chatSchedule = selectedSubCommunity.members.find(m => m.id === 'currentUser')?.schedule ?? [];

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (message.trim()) {
                handleSendMessage(message.trim());
                setMessage('');
            }
        };

        return (
            <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
                <Header title={`${selectedSubCommunity.vehicleType} Chat`} onBack={() => setView('your')} />
                <div className="p-4">
                    <MapPlaceholder />
                    <div className="mt-4">
                        <ScheduleCalendar schedule={chatSchedule} />
                    </div>
                </div>
                <div className="flex-grow p-4 pt-0 overflow-y-auto space-y-4">
                    {selectedSubCommunity.messages?.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'You' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                <p className="font-bold text-sm">{msg.sender}</p><p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isBotTyping && (
                        <div className="flex justify-start">
                             <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white dark:bg-gray-700">
                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200">Alex (Bot)</p>
                                <div className="flex items-center space-x-1 mt-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 sticky bottom-0 flex items-center border-t border-gray-200 dark:border-gray-700">
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <button type="submit" className="ml-3 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    </button>
                </form>
            </div>
        );
    }
    
    const CommunityForm = ({ onSubmit, buttonText }: { onSubmit: (e: React.FormEvent) => void, buttonText: string }) => (
       <>
        <div className="p-4">
             <MapPlaceholder />
        </div>
        <form onSubmit={onSubmit} className="p-4 pt-0 space-y-5 flex-grow flex flex-col">
            <input type="text" placeholder="Start Location" value={startLocation} onChange={e => setStartLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            <input type="text" placeholder="End Location" value={endLocation} onChange={e => setEndLocation(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            {distance > 0 && <p className="text-center text-gray-600 dark:text-gray-400 -mt-3">Route distance: ~{distance.toFixed(1)} km</p>}
            <input type="text" placeholder="Society / Area Name" value={areaName} onChange={e => setAreaName(e.target.value)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Matching Radius: {radius} km</label>
                <input type="range" min="1" max="10" value={radius} onChange={e => setRadius(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Your Role</label>
                <div className="flex space-x-2">
                    <button type="button" onClick={() => setRole(Role.Taker)} className={`flex-1 p-3 rounded-lg font-semibold transition ${role === Role.Taker ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Ride Taker</button>
                    <button type="button" onClick={() => setRole(Role.Giver)} className={`flex-1 p-3 rounded-lg font-semibold transition ${role === Role.Giver ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Ride Giver</button>
                </div>
            </div>
             {role === Role.Giver && (
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Vehicle Type</label>
                    <select value={vehicle} onChange={e => setVehicle(e.target.value as VehicleType)} className="w-full p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value={VehicleType.Car}>Car</option>
                        <option value={VehicleType.Bike}>Bike</option>
                    </select>
                </div>
             )}
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Your Weekly Schedule</label>
                <div className="grid grid-cols-4 gap-2">
                    {days.map(day => (<button type="button" key={day} onClick={() => toggleDay(day)} className={`p-3 rounded-lg font-semibold text-center transition ${schedule.includes(day) ? 'bg-purple-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{day}</button>))}
                </div>
            </div>
            <div className="flex-grow"></div>
            <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition sticky bottom-4 shadow-lg">{buttonText}</button>
        </form>
       </>
    );

    if (view === 'chat') return <ChatView />;
    
    return (
        <div className="flex flex-col min-h-screen bg-[#FFFBEB] dark:bg-gray-900">
            <Header title="Community" onBack={() => view === 'your' ? setCurrentPage(Page.Home) : setView('your')} />

            <div className="p-4">
                <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                    <button onClick={() => setView('your')} className={`flex-1 py-2 rounded-md font-semibold transition ${view === 'your' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>Your Communities</button>
                    <button onClick={() => setView('find')} className={`flex-1 py-2 rounded-md font-semibold transition ${view === 'find' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>Find</button>
                    <button onClick={() => setView('create')} className={`flex-1 py-2 rounded-md font-semibold transition ${view === 'create' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-400'}`}>Create</button>
                </div>
            </div>

            {view === 'your' && (
                <div className="p-4">
                    {yourCommunities.length > 0 ? (
                        yourCommunities.map(community => (
                             <div key={community.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md mb-6">
                                <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">{community.name}</h2>
                                {community.subCommunities.map(sub => (
                                    <div key={sub.id} className="mb-4 last:mb-0 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                        <h3 className="text-lg font-semibold flex items-center mb-2 text-gray-800 dark:text-gray-200"><CarIcon className="w-5 h-5 mr-2" /> {sub.vehicleType} Group ({sub.members.length} members)</h3>
                                        <div className="flex space-x-2 mt-2">
                                            <button onClick={() => handleSelectSubCommunity(sub, community)} className="flex-1 text-center bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow">View & Chat</button>
                                            <button onClick={() => handleLeaveCommunity(community.id, sub.id)} className="flex-1 text-center bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition shadow">Leave</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8 p-4 flex flex-col items-center">
                            <CommunityIllustration className="w-56 h-56 text-gray-400 dark:text-gray-600" />
                            <p className="mt-4 text-lg">You haven't joined any communities yet.</p>
                            <button onClick={() => setView('find')} className="mt-4 text-purple-600 dark:text-purple-400 font-bold">Find a community to join!</button>
                        </div>
                    )}
                </div>
            )}
            
            {view === 'find' && (
                <div>
                    <CommunityForm onSubmit={handleSearch} buttonText="Find Communities" />
                    {foundCommunities.length > 0 && (
                        <div className="p-4 -mt-12">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Search Results</h2>
                             {foundCommunities.map(community => (
                                <div key={community.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md mb-4">
                                    <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400">{community.name}</h3>
                                    {community.subCommunities.map(sub => (
                                        <div key={sub.id} className="mt-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-200">{sub.vehicleType} Group</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{sub.members.length} members</p>
                                            </div>
                                            <button onClick={() => handleJoin(community.id, sub.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 shadow">Join</button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'create' && (
                <div>
                    <CommunityForm onSubmit={handleCreate} buttonText="Create Community" />
                </div>
            )}
        </div>
    );
};

export default CommunityPage;