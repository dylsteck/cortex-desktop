
export type Step = {
    number: number;
    name: string;
}

export type Source = {
    name: string;
    image: string;
}

export type OnCompleteProps = {
    onComplete: () => void;
}