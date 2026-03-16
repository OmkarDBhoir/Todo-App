import { type Filter } from "../types";

interface FiltersProps {
  currentFilter: Filter;
  onFilterChange: (filter: Filter) => void;
}

const filterOptions: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export function Filters({ currentFilter, onFilterChange }: FiltersProps) {
  return (
    <section className="filters">
      {filterOptions.map((f) => (
        <button
          key={f.id}
          className={f.id === currentFilter ? "active" : ""}
          onClick={() => onFilterChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </section>
  );
}