import { useEffect, useState } from "react";
import { cn } from "~/utils/common";


type ChipsGroupProps = {
    options?: string[];
    value?: string;
    onChange?: (value: string) => void;
}

export default function ChipsGroup({ value, onChange, options }: ChipsGroupProps) {
    const [activeChip, setActiveChip] = useState<string | undefined>(value);


    useEffect(() => {
        if (activeChip) onChange?.(activeChip)
    }, [activeChip])

    useEffect(() => {
        setActiveChip(value)
    }, [value])


    return (
        <div className="flex items-center gap-4 px-3 py-2 border border-slate-200 rounded-md w-full">
            {
                options?.map((opt) => (
                    <button type="button" key={opt}
                        onClick={() => setActiveChip(opt)}
                        className={cn(
                            "outline-none border border-pink-500 px-5 py-1.5 rounded-md text-xs font-medium",
                            opt === activeChip && "bg-gradient-to-l from-pink-500 to-red-500 text-white",
                        )}>
                        {opt}
                    </button>
                ))
            }
        </div>
    )
}