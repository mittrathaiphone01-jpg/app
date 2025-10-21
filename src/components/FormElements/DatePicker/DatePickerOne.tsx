"use client";

import { Calendar } from "@/components/Layouts/sidebar/icons";
import flatpickr from "flatpickr";
import { useEffect, useRef } from "react";
import { Thai } from "flatpickr/dist/l10n/th.js";
import moment from "moment";

interface propsType {
  label?: string
  className?: string
  name?: string
  value?: string;
   disabled?: boolean;

  onChange?: (date: string | Date | null) => void;
}

const DatePickerOne = ({ label, name, onChange, value, disabled }: propsType) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: "single",
        dateFormat: "d M Y", // แสดงวันที่แบบ 01 ม.ค. 2566
        defaultDate:  value && moment(value, "YYYY-MM-DD").isValid()
        ? moment(value, "YYYY-MM-DD").toDate()
        : new Date()
        
        ,
        locale: {
          ...Thai,
          firstDayOfWeek: 1, // อาทิตย์เป็นวันแรก
          weekdays: {
            shorthand: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
            longhand: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
          },
          months: {
            shorthand: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            longhand: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
          },
        },
        onChange: (selectedDates) => {
          if (!selectedDates.length) return;
          const d = selectedDates[0];
          const formattedDate = moment(d).format("YYYY-MM-DD"); // ปีสากล
          onChange?.(formattedDate);
        },
        disable: disabled ? ['*'] : []
      });
    }

  }, [value]);

  return (
    <div>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="relative ">
        <input
        ref={inputRef}
          className="form-datepicker w-full rounded-[7px]  border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
          placeholder="mm/dd/yyyy"
          data-class="flatpickr-right"
          name={name}
          defaultValue={value}
          readOnly
          disabled={disabled}
        />

        <div className="pointer-events-none absolute inset-0 left-auto right-5 flex items-center">
          <Calendar className="size-5 text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

export default DatePickerOne;
