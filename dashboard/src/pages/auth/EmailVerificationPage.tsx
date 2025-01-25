import { updateMyVerifiedEmailApi } from "@/api/users_api";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useSearchParams } from "react-router-dom";

const EmailVerificationPage: React.FC = () => {
  const [updated, setUpdated] = useState<boolean>(false);
  let [searchParams] = useSearchParams();
  const handleVerifyEmail = async () => {
    let loading = toast.loading("Please wait...");
    try {
      if (!searchParams.get("token")) {
        return toast.error("Link is expired or invalid");
      }
      let token = searchParams.get("token");
      const { data } = await axios.get(updateMyVerifiedEmailApi, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data);
      if (data.message == "Email updated successfully") {
        toast.success(data.message, { id: loading });
        setUpdated(true);
      } else {
        toast(data.message, { id: loading });
      }
    } catch (error: any) {
      if (error.status == 401) {
        toast.error("Either link is expired or invalid", {
          id: loading,
        });
      } else {
        toast.error(error.message, {
          id: loading,
        });
      }
    }
  };
  return (
    <div className="w-full mt-24 flex justify-center items-center">
      {updated ? (
        <span>
          <NavLink to="/">click to go back to dashboard </NavLink>
        </span>
      ) : (
        <Button onClick={handleVerifyEmail}>
          <span>EmailVerificationPage</span>
        </Button>
      )}
    </div>
  );
};

export default EmailVerificationPage;
