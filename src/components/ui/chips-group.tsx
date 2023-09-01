import { useEffect, useState } from "react";
import { cn } from "~/utils/common";
import Image from 'next/image'


type ChipOption = {
    value: string;
    icon: (active: boolean) => JSX.Element;
}


type ChipsGroupProps = {
    options?: ChipOption[];
    value?: string;
    onChange?: (value: string) => void;
    chipClassName?: string;
}

export default function ChipsGroup({ value, onChange, options, chipClassName }: ChipsGroupProps) {
    const [activeChip, setActiveChip] = useState<ChipOption | undefined>(options?.find((opt) => opt.value === value));


    useEffect(() => {
        if (activeChip) onChange?.(activeChip.value)
    }, [activeChip])

    useEffect(() => {
        setActiveChip(options?.find((opt) => opt.value === value))
    }, [value])


    return (
        <div className="flex items-center gap-4 rounded-md w-full">
            {
                options?.map((opt) => (
                    <button type="button" key={opt.value}
                        onClick={() => setActiveChip(opt)}
                        className={cn(
                            "outline-none border border-primary px-5 py-1.5 rounded-full text-sm font-light capitalize text-secondary",
                            "flex items-center justify-center gap-2",
                            opt.value === activeChip?.value && "bg-primary shadow-lg text-white",
                            chipClassName
                        )}>
                        <span className="fill-primary">
                            {opt.icon(opt.value === activeChip?.value)}
                        </span>
                        <span>{opt.value.toLowerCase()}</span>
                    </button>
                ))
            }
        </div >
    )
}