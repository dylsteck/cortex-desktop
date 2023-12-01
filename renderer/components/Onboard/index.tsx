import { useState } from "react";
import { useCortex } from "../../context/CortexContext";
import { sources, steps } from "./utils";
import Image from "next/image";
import { GetStarted } from "./GetStarted";
import { ChooseSourcesItem } from "./ChooseSources";

export default function Onboard() {
    const [step, setStep] = useState(steps[0]);
    const { onboarded, setOnboarded } = useCortex();

    const handleOnComplete = (nextStepNumber) => {
        const nextStep = steps.find(s => s.number === nextStepNumber);
        if (nextStep) {
            setStep(nextStep);
        }
    };

    const handleCompleteOnboard = () => {
        setOnboarded(true);
    };

    return (
        <div className="w-full h-full">
            <div 
                className="w-[40vw] h-[50vh] p-2 rounded-lg text-black m-auto mt-[15vh]"
            >
                <div className="flex flex-col float-left">
                        <div className="w-[20%] h-[20%] mt-[4vh]">
                            <Image
                                src="/images/cortexLogo.png"
                                alt="Cortex logo"
                                width="600" height="516"
                            />
                        </div>
                        {step.number === 1 && <GetStarted onComplete={() => handleOnComplete(2)} />}
                        {step.number === 2 && <ChooseSourcesItem onComplete={handleCompleteOnboard} onChevronClick={() => handleOnComplete(1)} />}
                    </div>
                </div>
        </div>
    )
}