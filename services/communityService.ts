import { Community, CommunityMember, Role, VehicleType, SubCommunity, ChatMessage } from '../types';
import { GoogleGenAI } from "@google/genai";


// Mock data of other users in the system
const MOCK_USERS: CommunityMember[] = [
    { id: 'u1', name: 'John Doe', role: Role.Giver, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u2', name: 'Jane Smith', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u3', name: 'Peter Jones', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u4', name: 'Mary Williams', role: Role.Giver, vehicleType: VehicleType.Car, schedule: ['Tue', 'Thu'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u5', name: 'David Brown', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Tue', 'Thu'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u6', name: 'Sarah Miller', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u7', name: 'Chris Wilson', role: Role.Giver, vehicleType: VehicleType.Bike, schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startLocation: 'Suburb A', endLocation: 'City Center', areaName: 'Suburbia' },
    { id: 'u8', name: 'Emily Davis', role: Role.Taker, vehicleType: VehicleType.Bike, schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startLocation: 'Suburb A', endLocation: 'City Center', areaName: 'Suburbia' },
    { id: 'u9', name: 'Mark Taylor', role: Role.Giver, vehicleType: VehicleType.Car, schedule: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
    { id: 'u10', name: 'Laura Green', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Uptown', endLocation: 'Business District', areaName: 'City North' },
    { id: 'u11', name: 'Kevin White', role: Role.Giver, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Uptown', endLocation: 'Business District', areaName: 'City North' },
];

let MOCK_COMMUNITIES: Community[] = [
    {
        id: 'comm-1',
        name: 'Metro Morning Carpool',
        areaName: 'Metro Area',
        startLocation: 'Downtown',
        endLocation: 'Tech Park',
        subCommunities: [
            {
                id: 'sub-1',
                vehicleType: VehicleType.Car,
                members: [
                    { id: 'currentUser', name: 'You', role: Role.Taker, vehicleType: VehicleType.Car, schedule: ['Mon', 'Wed', 'Fri'], startLocation: 'Downtown', endLocation: 'Tech Park', areaName: 'Metro Area' },
                    MOCK_USERS[0],
                    MOCK_USERS[1],
                ],
                messages: [{ id: '1', sender: 'Alex (Bot)', text: "Hey everyone! Ready for another week of smooth rides?", timestamp: Date.now() - 10000 }]
            }
        ]
    },
    {
        id: 'comm-2',
        name: 'City North Commuters',
        areaName: 'City North',
        startLocation: 'Uptown',
        endLocation: 'Business District',
        subCommunities: [
            {
                id: 'sub-2',
                vehicleType: VehicleType.Car,
                members: [MOCK_USERS[10], MOCK_USERS[9]],
                messages: [{ id: '1', sender: 'Alex (Bot)', text: "Welcome to the City North group!", timestamp: Date.now() - 20000 }]
            }
        ]
    }
];

export const getYourCommunities = (userId: string): Community[] => {
    const userCommunities: Community[] = [];
    MOCK_COMMUNITIES.forEach(community => {
        const userSubCommunities = community.subCommunities.filter(sub =>
            sub.members.some(member => member.id === userId)
        );
        if (userSubCommunities.length > 0) {
            userCommunities.push({ ...community, subCommunities: userSubCommunities });
        }
    });
    return userCommunities;
};

export const findAvailableCommunities = (searchCriteria: Omit<CommunityMember, 'id' | 'name'>): Community[] => {
    const availableCommunities: Community[] = [];
    MOCK_COMMUNITIES.forEach(community => {
        if (
            community.areaName === searchCriteria.areaName &&
            community.startLocation === searchCriteria.startLocation &&
            community.endLocation === searchCriteria.endLocation
        ) {
            const availableSubCommunities = community.subCommunities.filter(sub => {
                const isMember = sub.members.some(m => m.id === 'currentUser');
                if (isMember) return false; // Already a member

                const givers = sub.members.filter(m => m.role === Role.Giver).length;
                const takers = sub.members.filter(m => m.role === Role.Taker).length;
                
                if (searchCriteria.role === Role.Taker && (givers * 2) > takers) return true;
                if (searchCriteria.role === Role.Giver && (givers + 1) * 2 >= takers) return true;

                return false;
            });

            if (availableSubCommunities.length > 0) {
                availableCommunities.push({ ...community, subCommunities: availableSubCommunities });
            }
        }
    });

    if (availableCommunities.length === 0) {
        const dummyCommunity: Community = {
            id: 'comm-dummy-1',
            name: `New ${searchCriteria.areaName} Group`,
            areaName: searchCriteria.areaName,
            startLocation: searchCriteria.startLocation,
            endLocation: searchCriteria.endLocation,
            subCommunities: [
                {
                    id: 'sub-dummy-1',
                    vehicleType: searchCriteria.vehicleType,
                    members: [
                        { id: 'dummy-giver-1', name: 'Alex Rider', role: Role.Giver, ...searchCriteria },
                        { id: 'dummy-taker-1', name: 'Ben Cruising', role: Role.Taker, ...searchCriteria },
                    ],
                }
            ]
        };
        return [dummyCommunity];
    }


    return availableCommunities;
};

export const joinCommunity = (communityId: string, subCommunityId: string, user: CommunityMember) => {
    if (communityId.includes('dummy')) {
        const community = createCommunity(user);
        if(community) {
            MOCK_COMMUNITIES.push(community);
        }
        return;
    }
    const community = MOCK_COMMUNITIES.find(c => c.id === communityId);
    if (community) {
        const subCommunity = community.subCommunities.find(sc => sc.id === subCommunityId);
        if (subCommunity && !subCommunity.members.some(m => m.id === user.id)) {
            subCommunity.members.push(user);
        }
    }
};

export const leaveCommunity = (communityId: string, subCommunityId: string, userId: string): boolean => {
    const communityIndex = MOCK_COMMUNITIES.findIndex(c => c.id === communityId);
    if (communityIndex > -1) {
        const community = MOCK_COMMUNITIES[communityIndex];
        const subCommunityIndex = community.subCommunities.findIndex(sc => sc.id === subCommunityId);
        
        if (subCommunityIndex > -1) {
            const subCommunity = community.subCommunities[subCommunityIndex];
            const memberIndex = subCommunity.members.findIndex(m => m.id === userId);

            if (memberIndex > -1) {
                subCommunity.members.splice(memberIndex, 1);
                
                if (subCommunity.members.length === 0) {
                    community.subCommunities.splice(subCommunityIndex, 1);
                }

                if (community.subCommunities.length === 0) {
                    MOCK_COMMUNITIES.splice(communityIndex, 1);
                }
                return true;
            }
        }
    }
    return false;
};


export const createCommunity = (currentUser: CommunityMember): Community | null => {
    const potentialMatches = MOCK_USERS.filter(user =>
        user.areaName === currentUser.areaName &&
        user.startLocation === currentUser.startLocation &&
        user.endLocation === currentUser.endLocation &&
        user.schedule.some(day => currentUser.schedule.includes(day)) &&
        user.vehicleType === currentUser.vehicleType
    );

    const givers = [currentUser, ...potentialMatches].filter(u => u.role === Role.Giver);
    const takers = [currentUser, ...potentialMatches].filter(u => u.role === Role.Taker);
    
    if ((currentUser.role === Role.Giver && takers.length > 0) || (currentUser.role === Role.Taker && givers.length > 0)) {
        const newSubCommunity: SubCommunity = {
            id: `sub-${Date.now()}`,
            vehicleType: currentUser.vehicleType,
            members: [currentUser],
            messages: [{ id: '1', sender: 'Alex (Bot)', text: `Welcome to the new group! I can help coordinate things.`, timestamp: Date.now()}]
        };

        if (currentUser.role === Role.Giver) {
            newSubCommunity.members.push(takers[0]);
            if (takers.length > 1) newSubCommunity.members.push(takers[1]);
        } else { // Current user is a Taker
            newSubCommunity.members.push(givers[0]);
        }

        const newCommunity: Community = {
            id: `comm-${Date.now()}`,
            name: `${currentUser.areaName} ${currentUser.vehicleType} Group`,
            areaName: currentUser.areaName,
            startLocation: currentUser.startLocation,
            endLocation: currentUser.endLocation,
            subCommunities: [newSubCommunity]
        };
        
        MOCK_COMMUNITIES.push(newCommunity);
        return newCommunity;
    }
    
    return null;
};

export const generateBotResponse = async (chatHistory: ChatMessage[], userName: string): Promise<string> => {
    if (!process.env.API_KEY) {
        const responses = ["That sounds like a plan!", "Got it, thanks for the update.", "Haha, that's a good one.", "Sure thing, see you then."];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const historyPrompt = chatHistory
        .map(msg => `${msg.sender === 'You' ? userName : msg.sender}: ${msg.text}`)
        .join('\n');

    const prompt = `You are a friendly and helpful commuter named Alex in a carpool chat group. Your persona is cheerful and slightly humorous. Keep your responses concise and natural (1-2 sentences).

The current user you are talking to is '${userName}'.

Here is the conversation so far:
${historyPrompt}

Now, respond naturally to the last message from '${userName}'. Do not prefix your response with your name (e.g., "Alex: ..."). Just write the response.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating bot response:", error);
        return "I seem to be having some trouble thinking of a reply right now.";
    }
};