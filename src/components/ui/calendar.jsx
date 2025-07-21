import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Calendar({ className }) {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className={className}>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        className="p-2 rounded border border-gray-300 w-full"
      />
    </div>
  );
}
