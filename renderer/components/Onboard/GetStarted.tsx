
export function GetStarted({ onComplete }: { onComplete: () => void}) {
    return (
        <>
            <p className="text-4xl font-semibold">Cortex</p>
            <div className="pt-[2.5vh]  flex flex-col gap-1">
                <p className="text-md">Control all your apps in one place</p>
                <p className="text-md">All your data lives <span className="italic">on-device</span> by default</p>
                <p className="text-md">Get started by connecting to data from your accounts</p>
                <button 
                    className="mt-[2.5vh] bg-[#5E5A5B] rounded-lg p-2 text-white font-light max-w-[40%]" 
                    onClick={() => onComplete()}
                >
                    Get Started
                </button>
            </div>
        </>
    )
}