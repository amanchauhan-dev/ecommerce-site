import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import { toggleTheme } from "@/store/slices/ThemeToggleSlice";
interface ThemeChangerProps {
  className?: string;
}

const ThemeChanger: React.FC<ThemeChangerProps> = ({className=''}) => {
  const theme = useAppSelector((s) => s.Theme.value);
  const dispatch = useAppDispatch();
  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };
  return (
    <div
      className={`${
        theme == "dark" ? "text-white" : "text-zinc-950"
      } cursor-pointer select-none ${className}`}
      onClick={handleThemeChange}
    >
      {theme}
    </div>
  );
};

export default ThemeChanger;
