import { cn } from "@/lib/utils";
import { useId } from "react";

type PropsType = {
  variant?: "dot" | "circle";
  label: string;
  name?: string;
  value?: string;
  minimal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
};

export function RadioInput({
  label,
  variant = "dot",
  name,
  value,
  minimal,
  onChange , 
   checked = false,
}: PropsType) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white"
      >
        <div className="relative">
          <input
            type="radio"
            name={name}
            id={id}
            className="peer sr-only"
            value={value}
            onChange={onChange}
             checked={checked}
          />
          <div
            className={cn(
              "mr-2 flex size-5 items-center justify-center rounded-full border peer-checked:[&>*]:block",
              {
                "border-primary peer-checked:border-6": variant === "circle",
                "border-dark-5 peer-checked:border-primary peer-checked:bg-gray-2 dark:border-dark-6 dark:peer-checked:bg-dark-2":
                  variant === "dot",
              },
              minimal && "border-stroke dark:border-dark-3",
            )}
          >
            <span
              className={cn(
                "hidden size-2.5 rounded-full bg-primary",
                variant === "circle" && "bg-transparent",
              )}
            />
          </div>
        </div>
        <span>{label}</span>
      </label>
    </div>
  );
}
