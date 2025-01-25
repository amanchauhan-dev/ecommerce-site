import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect } from "react";

interface AvatarCompProps {
  className?: string;
  src?: string;
  alt?: string;
}

const AvatarComp: React.FC<AvatarCompProps> = ({
  className = "",
  src = "",
  alt = "Alter Prop",
}) => {
  const serverUrl =
    import.meta.env.VITE_SERVER_IMAGES_URL || "http://localhost:8000/public/uploads/";
  const randomColors = [
    "#ef44440",
    "#22c55e",
    "#06b6d4",
    "#8b5cf6",
    "#f43f5e",
    "#6b21a8",
    "#6b21a8",
    "#065f46",
    "#dc2626",
    "#404040",
  ];
  let random = Math.floor(Math.random() * 10);
  useEffect(() => {
    random = Math.floor(Math.random() * 10);
    if (random > 9) random = 9;
  }, []);
  return (
    <div
      style={{ backgroundColor: randomColors[random] }}
      className={`w-7 h-7 overflow-hidden rounded-full ${className}`}
    >
      <Avatar className="h-full !object-cover w-full ">
        <AvatarImage
          className={`overflow-hidden object-cover h-7 w-7 ${className}`}
          src={serverUrl + src}
          alt={alt}
        />
        <AvatarFallback className="text-white  flex justify-center items-center h-full w-full">
          {alt.split(" ").map((e) => {
            return e.charAt(0);
          })}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarComp;
