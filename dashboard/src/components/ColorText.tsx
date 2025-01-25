interface ColorTextProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  variant?: "red" | "green" | "sky" | "yellow" | "pink" | "default";
  onClick?: any;
}

const ColorText: React.FC<ColorTextProps> = ({
  children = <></>,
  className = "",
  variant = "default",
  title = " ",
  onClick = () => {},
}) => {
  let baseCSS = "font-medium transition-all text-sm cursor-pointer";
  switch (variant) {
    case "red":
      baseCSS +=
        " text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300";
      break;
    case "green":
      baseCSS +=
        " text-green-600 hover:text-green-700  dark:text-green-400 dark:hover:text-green-300";
      break;
    case "sky":
      baseCSS +=
        " text-sky-600 hover:text-sky-700  dark:text-sky-400 dark:hover:text-sky-300";
      break;
    case "yellow":
      baseCSS +=
        " text-yellow-600 hover:text-yellow-700  dark:text-yellow-400 dark:hover:text-yellow-300";
      break;
    case "pink":
      baseCSS +=
        " text-pink-600 hover:text-pink-700  dark:text-pink-400 dark:hover:text-pink-300";
      break;
    default:
      baseCSS +=
        " text-slate-600 hover:text-slate-700  dark:text-slate-300 dark:hover:text-slate-200";
      break;
  }

  return (
    <span onClick={onClick} title={title} className={`${baseCSS} ${className}`}>
      {children}
    </span>
  );
};

export default ColorText;
