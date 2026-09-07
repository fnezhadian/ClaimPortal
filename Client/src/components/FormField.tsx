interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'number';
  value: string;
  onChange: (value: string) => void;
}

export function FormField({ id, label, type, value, onChange }: FormFieldProps) {
    return (
        <div>   
            <label htmlFor={id}>{label}</label>
            <input 
                id={id}
                type={type}
                value={value}   
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}   