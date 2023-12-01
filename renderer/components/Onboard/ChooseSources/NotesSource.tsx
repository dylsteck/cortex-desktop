import Image from "next/image";
import { useState } from "react";
import { sources } from "../utils";

export default function NotesSourceItem() {
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
        <div className="flex flex-row gap-2 p-2 items-center">
            <Image src={notes.image} alt={`${notes.name} image`} width="25" height="23" objectFit="contain"/>
            <p className="text-lg">{notes.name}</p>
            {isSynced ? 
                <p className="pl-2 font-medium">Completed sync!</p> : 
                <button onClick={handleOnClick} className="text-white p-1.5 font-medium ml-6">
                    Sync
                </button>
            }
        </div>
    )
}