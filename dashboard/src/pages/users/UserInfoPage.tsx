import { userApi } from "@/api/users_api";
import AvatarComp from "@/components/AvatarComp";
import ColorText from "@/components/ColorText";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatReadableDateTime } from "@/functions/DateFormater";
import { fetchCookieToken } from "@/functions/GetCookie";
import { User } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserUpdate from "./UserUpdate";
import WarnDialog from "@/components/WarnDialog";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux.hook";

interface UserInfoPageProps {}

const UserInfoPage: React.FC<UserInfoPageProps> = () => {
  const curUser = useAppSelector((e) => e.User);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [refresh, setRefresh] = useState<number>(0);
  const param = useParams();

  const fetchUserFromUserID = async (id: number) => {
    try {
      // axios call
      let token = fetchCookieToken();
      const { data } = await axios.get(userApi + "/" + id, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUser({ ...data });
    } catch (error: any) {
      setUser(null);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchUserFromUserID(user.id);
    }
  }, [refresh]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (userId != null) {
      if (!isNaN(userId)) {
        fetchUserFromUserID(userId);
      }
    }
  };

  useEffect(() => {
    if (param.id) {
      if (!isNaN(param.id as any)) {
        fetchUserFromUserID(Number(param.id));
        setUserId(param.id as any);
      }
    }
  }, []);
  // handle delete
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const handleDelete = async () => {
    if (!user) {
      return;
    }
    let loading = toast.loading("Please wait...");
    try {
      await axios.delete(userApi + "/" + user.id, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + fetchCookieToken(),
        },
      });
      setOpenDelete(false);
      setRefresh((e) => e + 1);
      toast.success("Deleted successfully", { id: loading });
    } catch (error) {
      toast.error("Error occur", { id: loading });
    }
  };
  return (
    <div className="p-7">
      {/* search  */}
      <div>
        <form onSubmit={handleSubmit} className="flex w-96 gap-3">
          <Input
            placeholder="Please Enter user id"
            type="number"
            defaultValue={userId !== null ? userId : ""}
            onChange={(e) => {
              setUserId(Number(e.target.value));
            }}
            min={0}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>
      {/* // loading  */}
      <div className="mt-3">
        {user == null ? (
          <ColorText className="text-lg" variant="yellow">
            User not found
          </ColorText>
        ) : (
          <ColorText className="text-lg">User Information </ColorText>
        )}
      </div>
      {/* detail  */}
      {loading && "loading..."}
      {user !== null && (
        <Card className="p-5 mt-5">
          <div className="flex justify-end gap-1 m-1">
            {curUser.role == "admin" && user.role != "admin" && (
              <WarnDialog
                open={openDelete}
                setOpen={setOpenDelete}
                openElement={
                  <Button variant={"ghost"}>
                    <ColorText variant="red">Delete</ColorText>
                  </Button>
                }
                onAccept={handleDelete}
              />
            )}
            <UserUpdate {...user} setRefresh={setRefresh} />
          </div>
          <div className="grid grid-cols-1 items-center sm:grid-cols-2 gap-6">
            {/* <!-- Avatar --> */}
            <div className="md:col-span-2 m-auto">
              <AvatarComp
                className="w-32 h-32 sm:w-64 sm:h-64 "
                src={user.avatar}
                alt={user.fname + " " + user.lname}
              />
            </div>
            {/* <!-- First Name and last name --> */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-600">
                First Name
              </h3>
              <ColorText className="text-gray-900">{user.fname}</ColorText>
              <h3 className="text-sm font-semibold text-gray-600">Last Name</h3>
              <ColorText className="text-gray-900">{user.lname}</ColorText>
            </div>
            {/* <!-- Email --> */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Email</h3>
              <ColorText className="text-gray-900">{user.email}</ColorText>
            </div>
            {/* <!-- Phone Number --> */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600">
                Phone Number
              </h3>
              <ColorText className="text-gray-900">
                {user.phone_number}
              </ColorText>
            </div>
            {/* <!-- Role --> */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Role</h3>
              <ColorText
                variant={
                  user.role == "admin"
                    ? "red"
                    : user.role == "employee"
                    ? "yellow"
                    : "green"
                }
              >
                {user.role}
              </ColorText>
            </div>
            {/* <!-- Email Verification Status --> */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600">
                Email Verified
              </h3>
              <ColorText variant={user.is_email_verified ? "green" : "red"}>
                {user.is_email_verified ? "Verified" : "Not Verified"}
              </ColorText>
            </div>
            {/* <!-- Account Status --> */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Status</h3>
              <ColorText
                variant={
                  user.status == "active"
                    ? "green"
                    : "red"
                }
              >
                {user.status}
              </ColorText>
            </div>
            {/* <!-- Created At and updated at --> */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-600">
                Created At
              </h3>
              <ColorText className="text-gray-900">
                {formatReadableDateTime(user.created_at.toString())}
              </ColorText>
              <h3 className="text-sm font-semibold text-gray-600">
                Last Updated
              </h3>
              <ColorText className="text-gray-900">
                {formatReadableDateTime(user.updated_at.toString())}
              </ColorText>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserInfoPage;
