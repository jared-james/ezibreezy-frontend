// components/time-zone-select/time-zone-select.tsx

"use client";

import ReactTimezoneSelect, { type ITimezone } from "react-timezone-select";

interface TimeZoneSelectProps {
  value: string;
  onChange: (timezone: string) => void;
  disabled?: boolean;
}

export default function TimeZoneSelect({
  value,
  onChange,
  disabled,
}: TimeZoneSelectProps) {
  // Styles to match: components/onboarding/onboarding-form.tsx
  // "bg-transparent border-b-2 border-dotted border-foreground/30 py-2 font-serif text-xl"

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px dotted",
      // Matches border-foreground/30 (approximate rgba for black/30)
      borderColor: state.isFocused ? "var(--foreground)" : "rgba(0, 0, 0, 0.3)",
      borderRadius: 0,
      boxShadow: "none",
      padding: "8px 0",
      minHeight: "50px",
      fontSize: "1.25rem", // text-xl
      fontFamily: "var(--font-serif)",
      cursor: "pointer",
      "&:hover": {
        borderColor: "var(--foreground)",
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--foreground)",
      fontFamily: "var(--font-serif)",
      margin: 0,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      // Matches text-foreground/20
      color: "rgba(0, 0, 0, 0.2)",
      fontFamily: "var(--font-serif)",
      margin: 0,
    }),
    input: (provided: any) => ({
      ...provided,
      color: "var(--foreground)",
      fontFamily: "var(--font-serif)",
      margin: 0,
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#fdfbf7", // Matches bg-[#fdfbf7] / bg-surface
      border: "1px solid var(--foreground)",
      borderRadius: "2px",
      zIndex: 50,
      marginTop: "4px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(0, 0, 0, 0.05)" // Hover state
        : "transparent",
      color: "var(--foreground)",
      cursor: "pointer",
      fontFamily: "var(--font-serif)",
      fontSize: "1rem",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "var(--foreground)",
      opacity: 0.3,
      padding: 0,
      "&:hover": {
        color: "var(--foreground)",
        opacity: 1,
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: 0,
    }),
  };

  const handleChange = (selected: ITimezone) => {
    // react-timezone-select returns an object { value: "Australia/Sydney", label: "(GMT+10)..." }
    // We strictly want the IANA string for the backend.
    if (typeof selected === "string") {
      onChange(selected);
    } else if (selected && "value" in selected) {
      onChange(selected.value);
    }
  };

  return (
    <div className="w-full">
      <ReactTimezoneSelect
        value={value}
        onChange={handleChange}
        isDisabled={disabled}
        styles={customStyles}
        placeholder="Select Timezone"
        menuPlacement="auto"
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
}
