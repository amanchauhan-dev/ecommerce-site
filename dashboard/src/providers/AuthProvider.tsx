import { getMyDetailsApi } from "@/api/users_api";
import { fetchCookieToken } from "@/functions/GetCookie";
import { useAppDispatch } from "@/hooks/redux.hook";
import { setMyDetails } from "@/store/slices/UserSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [auth, setAuth] = useState<boolean>(false);
  const navigate = useNavigate();
  // function to fetch user details
  let fetchUserDetails = async () => {
    setLoading(true);
    try {
      let token = fetchCookieToken();
      // console.log(token);

      let { data } = await axios.get(getMyDetailsApi, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token, // Add the token to the headers
        },
      });
      setLoading(false);
      setAuth(true);      
      dispatch(setMyDetails({ ...data }));
    } catch (error: any) {
      // if error occurs
      // console.log(error);

      setLoading(false);
      navigate("/login");
    }
  };

  // when screen load
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // loading  state
  if (loading) return <>Loading...</>;
  // return authenticated
  if (auth) return <>{children}</>;
};

export default AuthProvider;
