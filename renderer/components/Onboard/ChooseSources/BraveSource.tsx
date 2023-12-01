import { useState } from "react";
import { sources } from "../utils";
import Image from "next/image";

export default function BraveSourceItem() {
    const [isSynced, setIsSynced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const brave = sources.find((s) => s.name === 'Brave');

    const handleOnClick = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/backfill/braveHistory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            setIsSynced(true);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            setIsSynced(false);
        } finally {
            setIsLoading(false);
        }
    };    

    return (
        <div className="flex flex-row gap-2 p-2 items-center">
            <Image src={brave.image} alt={`${brave.name} image`} width="24" height="28" objectFit="contain" />
            <p className="text-lg">{brave.name}</p>
            {isLoading ? (
                <p className="pl-2 font-medium">Loading...</p>
            ) : isSynced ? (
                <p className="pl-2 font-medium">Completed sync!</p>
            ) : (
                <button onClick={handleOnClick} className="text-white p-1.5 font-medium ml-6">
                    Sync
                </button>
            )}
        </div>
    )
}