import Image from "next/image";
import chevronLeftWhite from '../../../public/images/chevronLeftWhite.png';
import BraveSourceItem from "./BraveSource";
import FarcasterSourceItem from "./FarcasterSource";
import NotesSourceItem from "./NotesSource";

export function ChooseSourcesItem({ onComplete, onChevronClick }) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row gap-2">
                <div className="pt-[1.5vh]" onClick={() => onChevronClick()}>
                    <Image src={chevronLeftWhite} alt="Chevron icon" width="15" height="12" objectFit="contain" />
                </div>
                <div>
                    <p className="pt-[1vh] text-xl font-medium">Choose sources</p>
                </div>
            </div>
            <p className="text-md pt-[2.5vh] pb-[1.5vh]">Sync data from your favorite apps</p>
            <div className="flex flex-col gap-2 bg-[#565350] rounded-md">
                <BraveSourceItem />
                <FarcasterSourceItem />
                <NotesSourceItem />
            </div>
            <button 
                className="bg-[#5E5A5B] rounded-lg p-2 mt-[2.5vh] max-w-[40%] text-white font-light" 
                onClick={() => onComplete()}
            >
                Finish Setup
            </button>
        </div>
    )
}