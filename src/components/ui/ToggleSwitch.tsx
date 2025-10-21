import { cn } from '@/lib/utils';
import React, { useId } from 'react'

type ToggleSwitchProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    title? : string
};

const ToggleSwitch = ({ checked, onChange, label, disabled = false, className, title }: ToggleSwitchProps) => {
    const id = useId();
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="text-body-sm font-medium text-dark dark:text-white"
            >
                {title}
            </label>

            <div
                className={cn(
                    "relative mt-3 [&_svg]:absolute [&_svg]:top-1/2 [&_svg]:-translate-y-1/2"

                )}
            >

                <label className="flex items-center gap-2 cursor-pointer">
                    <div
                        className={cn(
                            "relative w-12 h-6 rounded-full transition-colors duration-300",
                            checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => !disabled && onChange(!checked)}
                    >
                        <span
                            className={cn(
                                "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300",
                                checked && "translate-x-6"
                            )}
                        />
                    </div>
                    {label}
                </label>

            </div>


        </div>
    )
}

export default ToggleSwitch
