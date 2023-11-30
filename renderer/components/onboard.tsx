import Image from "next/image";
import { useState } from "react";
import chevronLeftBlack from '../public/images/chevronLeftBlack.png';

const steps = [
    {
        number: 1,
        name: 'Get Started'
    },
    {
        number: 2,
        name: 'Choose Sources'
    },
];

const sources = [
    { name: 'Brave', image: '/images/braveIcon.png' },
    { name: 'Farcaster', image: '/images/farcasterIcon.png' },
    { name: 'Notes', image: '/images/notesIcon.png' }
];

function GetStarted({ onComplete }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-[25%] h-[25%] mt-[2.5vh]">
                <Image
                    src="/images/cortexLogoCircle.png"
                    alt="Cortex logo"
                    width="256" height="256"
                />
            </div>
            <p className="pt-[1vh] text-xl font-medium">Cortex</p>
            <p className="text-md">iCloud for your web apps</p>
            <button 
                className="mt-[1vh] bg-gray-900 rounded-lg p-2 text-white" 
                onClick={() => onComplete()}
            >
                Get Started
            </button>
        </div>
    )
}

function BraveSourceItem() {
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
        <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-950 text-white max-w-[25vw] max-h-[25vh]">
            <Image src={brave.image} alt={`${brave.name} image`} width="24" height="28" objectFit="contain" />
            <p className="font-medium text-lg">{brave.name}</p>
            {isLoading ? (
                <p>Loading...</p>
            ) : isSynced ? (
                <p>Completed sync!</p>
            ) : (
                <button onClick={handleOnClick} className="bg-white text-[#000000] rounded-lg p-1">
                    Sync
                </button>
            )}
        </div>
    )
}

function FarcasterSourceItem() {
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
        <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-950 text-white max-w-[25vw] max-h-[25vh]">
            <Image src={farcaster.image} alt={`${farcaster.name} image`} width="25" height="23" objectFit="contain"/>
            <p className="font-medium text-lg">{farcaster.name}</p>
            {isLoading ? (
                <p>Loading...</p>
            ) : isSynced ? (
                <p>Completed sync!</p>
            ) : (
                <button onClick={handleOnClick} className="bg-white text-[#000000] rounded-lg p-1">
                    Sync
                </button>
            )}
        </div>
    )
}

function NotesSourceItem() {
    const [isSynced, setIsSynced] = useState(false);
    const notes = sources.find((s) => s.name === 'Notes');

    const handleOnClick = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.md';
        fileInput.multiple = true;

        fileInput.onchange = async (e) => {
            const files = e.target.files;
            const fileContents = [];
            let filesRead = 0;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e) => {
                    fileContents.push({ fileName: file.name, text: e.target.result });
                    filesRead++;

                    if (filesRead === files.length) {
                        fetch('/api/addNote', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(fileContents),
                        });
                        setIsSynced(true);
                    }
                };

                reader.readAsText(file);
            }
        };

        fileInput.click();
    };

    return (
        <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-950 text-white max-w-[25vw] max-h-[25vh]">
            <Image src={notes.image} alt={`${notes.name} image`} width="25" height="23" objectFit="contain"/>
            <p>{notes.name}</p>
            {isSynced ? 
                <p>Completed sync!</p> : 
                <button onClick={handleOnClick} className="bg-white text-[#000000] rounded-lg p-1">
                    Sync
                </button>
            }
        </div>
    )
}

function ChooseSources({ onComplete, onChevronClick }) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row gap-4 justify-between items-center">
                <div className="pt-[1vh]" onClick={() => onChevronClick()}>
                    <Image src={chevronLeftBlack} alt="Chevron icon" width="15" height="12" objectFit="contain" />
                </div>
                <div>
                    <p className="pt-[1vh] text-xl font-medium">Choose sources</p>
                </div>
            </div>
            <p className="text-md pt-[2.5vh]">Start building your app sources</p>
            <div className="flex flex-row gap-2 pt-[2.5vh]">
                <BraveSourceItem />
                <FarcasterSourceItem />
                <NotesSourceItem />
            </div>
            <button 
                className="bg-gray-900 rounded-lg p-2 mt-[2.5vh] text-white" 
                onClick={() => onComplete()}
            >
                Finish Setup
            </button>
        </div>
    )
}

export default function Onboard() {
    const [step, setStep] = useState(steps[0]);

    const handleOnComplete = (nextStepNumber) => {
        const nextStep = steps.find(s => s.number === nextStepNumber);
        if (nextStep) {
            setStep(nextStep);
        }
    };

    const handleCompleteOnboard = () => {
        // Finish onboarding logic goes here
    };

    return (
        <div className="w-full h-full">
            <div className="w-[40vw] h-[50vh] p-2 rounded-lg bg-gray-200 text-black m-auto mt-[15vh]">
                {step.number === 1 && <GetStarted onComplete={() => handleOnComplete(2)} />}
                {step.number === 2 && <ChooseSources onComplete={handleCompleteOnboard} onChevronClick={() => handleOnComplete(1)} />}
            </div>
        </div>
    )
}