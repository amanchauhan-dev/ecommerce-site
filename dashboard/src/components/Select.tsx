import { useAppSelector } from "@/hooks/redux.hook";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: any;
}

const Select: React.FC<SelectProps> = ({ children, className, ...props }) => {
  const theme = useAppSelector((s) => s.Theme.value);

  return (
    <select
      className={`text-slate-600 bg-transparent  focus:border-zinc-900  p-1.5 border-[1px] text-sm rounded-md ${
        theme == "dark"
          ? "border-zinc-700  focus:border-zinc-200  !text-slate-200"
          : ""
      } ${className || ""}`}
      {...props}
    >
      {children}
    </select>
  );
};

interface SelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  variant?: any;
}

export const SelectOption: React.FC<SelectOptionProps> = ({
  children,
  className,
  ...props
}) => {
  const theme = useAppSelector((s) => s.Theme.value);
  return (
    <option
      className={`${theme == "dark" ? "!bg-zinc-800 " : "bg-white"} ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </option>
  );
};

export default Select;
