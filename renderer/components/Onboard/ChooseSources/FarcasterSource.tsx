import Image from "next/image";
import { sources } from "../utils";
import { useState } from "react";

export default function FarcasterSourceItem() {
    const [isSynced, setIsSynced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const farcaster = sources.find((s) => s.name === 'Farcaster');

    const handleOnClick = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/backfill/casts', {
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
            <Image src={farcaster.image} alt={`${farcaster.name} image`} width="25" height="23" objectFit="contain"/>
            <div className="flex flex-row items-center justify-between">
                <p className="text-lg">{farcaster.name}</p>
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
        </div>
    )
}