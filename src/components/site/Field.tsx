const inputClass =
  "mt-2 w-full rounded-sm border border-input bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/70 focus:shadow-[var(--glow-primary)]";

export function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  placeholder,
  rows = 4,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  required = true,
}: {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <select id={name} name={name} required={required} className={inputClass} defaultValue="">
        <option value="" disabled>
          select…
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
