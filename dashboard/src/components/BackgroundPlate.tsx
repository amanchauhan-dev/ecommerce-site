import { useAppSelector } from "@/hooks/redux.hook";

interface divProps extends React.HTMLAttributes<HTMLDivElement> {
  lightBack?: string;
  darkBack?: string;
}

const BackgroundPlate: React.FC<divProps> = ({
  lightBack = "white",
  darkBack = "gray",
  children,
  style,
  ...rest
}) => {
  const mode = useAppSelector((e) => e.Theme.value);
  return (
    <div
      style={{
        backgroundColor: mode == "dark" ? darkBack : lightBack,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default BackgroundPlate;
