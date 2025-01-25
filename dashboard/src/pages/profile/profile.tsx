import AvatarComp from "@/components/AvatarComp";
import ColorText from "@/components/ColorText";
import { Card } from "@/components/ui/card";
import { formatReadableDateTime } from "@/functions/DateFormater";
import { useAppSelector } from "@/hooks/redux.hook";
import UpdateProfile from "./Update";

const Profile: React.FC = () => {
  const user = useAppSelector((s) => s.User.user);
  const role = useAppSelector((s) => s.User.role);
  return (
    <div className="p-3 pt-7">
      <Card className="p-5 relative px-8 flex gap-2 max-w-[800px] mx-auto flex-wrap">
        <UpdateProfile
          id={user.id}
          fname={user.fname}
          lname={user.lname}
          phone_number={user?.phone_number as any}
          email={user.email}
        />
        {/* image  */}
        <div>
          <AvatarComp
            className="!h-32 !w-32"
            alt={user.fname + " " + user.lname}
            src={user.avatar}
          />
        </div>
        {/* data  */}
        <div className="flex flex-col gap-1">
          <ColorText>{user.fname + " " + user.lname}</ColorText>
          <ColorText>{role}</ColorText>
          <ColorText>{user.email}</ColorText>
          <ColorText>{user.phone_number}</ColorText>
          <ColorText>{user.status}</ColorText>
          <ColorText>
            {user.created_at &&
              " Created On:" +
                formatReadableDateTime(user.created_at.toString())}
          </ColorText>
          <ColorText>
            {user.updated_at &&
              " Updated On:" +
                formatReadableDateTime(user.updated_at.toString())}
          </ColorText>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
