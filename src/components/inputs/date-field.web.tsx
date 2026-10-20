import { fromIsoDate, toIsoDate } from "@/utils/date";

import type { DateFieldProps } from "./date-field";

export function DateField({ value, onChange, minimumDate }: DateFieldProps) {
  return (
    <input
      type="date"
      value={value ? toIsoDate(value) : ""}
      min={minimumDate ? toIsoDate(minimumDate) : undefined}
      onChange={(e) => e.target.value && onChange(fromIsoDate(e.target.value))}
    />
  );
}
