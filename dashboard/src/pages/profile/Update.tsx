import {
  getMyDetailsApi,
  resetPassword,
  updateDetailsApi,
  verifyMyAccountApi,
  verifyMyEmailApi,
} from "@/api/users_api";
import AvatarComp from "@/components/AvatarComp";
import ColorText from "@/components/ColorText";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchCookieToken } from "@/functions/GetCookie";
import { handleImagePreview } from "@/functions/ImagePreview";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import { setMyDetails, User } from "@/store/slices/UserSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface UpdateProfileProps {
  setRefresh?: any;
  id: number;
  fname: string;
  lname?: string;
  avatar?: string;
  email: string;
  phone_number?: string;
}

// schema of form
const formSchema = z.object({
  fname: z.string().min(1, {
    message: "First name is required.",
  }),
  lname: z.string().min(1, {
    message: "Last name is required.",
  }),
  phone: z.string().length(10, {
    message: "Invalid Indian number",
  }),
});

const UpdateProfile: React.FC<UpdateProfileProps> = (props) => {
  // update password
  const [password, setPassword] = useState<string>("");

  const [verified, setVerified] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [openVerify, setOpenVerify] = useState<boolean>(false);
  const { setRefresh = () => {} } = props;
  const token = fetchCookieToken();
  const [avatar, setAvatar] = useState<File | null>(null);

  const avatarPreviewRef = useRef<HTMLImageElement>(null);
  const avatarSelectorRef = useRef<HTMLInputElement>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: props.fname || "",
      lname: props.lname || "",
      phone: props.phone_number || "",
    },
  });
  const [reset, setReset] = useState<number>(0);
  // 2. Define your submit function.
  useEffect(() => {
    form.setValue("fname", props.fname || "");
    form.setValue("lname", props.lname || "");
    form.setValue("phone", props.phone_number || "");
  }, [reset]);

  // handle file change
  const handleFileChange = () => {
    handleImagePreview(avatarSelectorRef, avatarPreviewRef);
    if (avatarSelectorRef.current?.files) {
      setAvatar(avatarSelectorRef.current.files[0]);
    }
  };

  // handle avatar cancel
  const handleFileCancel = () => {
    avatarPreviewRef.current!.src = "";
    setAvatar(null);
  };
  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // create a formData
    const formData = new FormData();
    formData.append("fname", values.fname);
    formData.append("lname", values.lname);
    formData.append("phone_number", values.phone);

    if (avatar) {
      formData.append("avatar", avatar);
    }
    // create a new user
    const loading = toast.loading("Please wait...");

    try {
      // axios call
      let { data } = await axios.put(updateDetailsApi + props.id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      setRefresh((e: any) => e + 1);
      setOpen(false);
      toast.success(data.message, {
        id: loading,
      });
      let result = await axios.get(getMyDetailsApi, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const user: User = result.data;
      dispatch(setMyDetails(user));
    } catch (error: any) {
      // error handling
      toast.error(error.message, {
        id: loading,
      });
      console.log("error: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={"ghost"} className="absolute right-2 top-1">
          <ColorText variant="green">Edit</ColorText>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="h-[90vh] overflow-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-fit flex-wrap flex-col items-center gap-3 overflow-auto"
            >
              {/* // image part  */}
              <div className="flex flex-col ">
                <div className="border-2 w-40 h-40  dark:border-slate-600 overflow-hidden rounded-full">
                  <img ref={avatarPreviewRef} />
                  {avatarPreviewRef &&
                  avatarPreviewRef.current &&
                  avatarPreviewRef.current.src == "" ? (
                    <AvatarComp
                      className="!w-40 !h-40"
                      alt={props.fname + " " + props.lname}
                      src={
                        import.meta.env.VITE_SERVER_IMAGES_URL +
                        "/" +
                        props.avatar
                      }
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="mt-3">
                  <input
                    type="file"
                    id="userAvatar"
                    accept="image/*"
                    ref={avatarSelectorRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="userAvatar">Select</label>
                  <Button
                    variant="ghost"
                    className="!text-red-500"
                    type="button"
                    onClick={handleFileCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="flex-auto w-[400px] max-[800px]:w-full flex gap-6 gap-y-8 px-1 !flex-wrap">
                {/* first name */}
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="fname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* last name */}
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="lname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Name"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* phone number */}
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone number"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-auto flex gap-2 w-full">
                  <Button
                    type="button"
                    onClick={() => {
                      setReset((e) => e + 1);
                    }}
                    className="w-full !bg-green-600 hover:!bg-green-700 dark:hover:!bg-green-500"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="w-full !bg-sky-600 hover:!bg-sky-700 dark:hover:!bg-sky-500"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          {/* email */}
          <div className="mt-3 px-1">
            <ColorText>
              Verification required to change{"  "}
              <VerifyIdentity
                verified={verified}
                open={openVerify}
                password={password}
                setPassword={setPassword}
                setVerified={setVerified}
                setOpen={setOpenVerify}
              />
            </ColorText>
            <EmailChange
              userId={props.id}
              verified={verified}
              email={props.email}
            />
            <Card className="my-2"></Card>
            <PasswordChange oldPassword={password} verified={verified} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;

interface VerifyIdentityProps {
  open?: boolean;
  setOpen?: any;
  setVerified?: any;
  verified: boolean;
  password: string;
  setPassword: any;
}
const VerifyIdentity: React.FC<VerifyIdentityProps> = ({
  open,
  setOpen,
  setVerified,
  verified,
  password,
  setPassword,
}) => {
  const userId = useAppSelector((s) => s.User.user.id);

  const verifyIdentity = async (e: any) => {
    e.preventDefault();
    let verifyLoading = toast.loading("Please wait...");
    try {
      const { data } = await axios.put(
        verifyMyAccountApi + userId,
        { password: password },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + fetchCookieToken(),
          },
        }
      );
      setOpen(false);
      setVerified(true);
      toast.success(data.message, { id: verifyLoading });
    } catch (error: any) {
      setVerified(false);
      if (error.code !== 500) {
        toast.error(error.response.data.message, { id: verifyLoading });
      } else {
        toast.error("Internal Server Error", { id: verifyLoading });
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {verified ? (
        <ColorText variant="green">Verified</ColorText>
      ) : (
        <DialogTrigger>
          <Button size="sm" variant={"ghost"}>
            <ColorText variant="red">Verify</ColorText>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <form action="" onSubmit={verifyIdentity}>
          <label htmlFor="password">
            <ColorText>Password</ColorText>
          </label>
          <Input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            id="password"
            type="password"
            placeholder="Enter Password"
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit">Verify</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// email change

const EmailChange: React.FC<{
  email: string;
  verified: boolean;
  userId: number;
}> = ({ email, verified, userId }) => {
  const [newEmail, setNewEmail] = useState<string>(email);
  const ChangeEmail = async () => {
    if (newEmail.length == 0) {
      toast.error("Email is required");
      return;
    }
    let loading = toast.loading("Sending verification email...");
    try {
      const { data } = await axios.put(
        verifyMyEmailApi + userId,
        {
          email: newEmail,
          redirectionURL: "http://localhost:5173/email-verify/",
        },
        {
          withCredentials: true,
          headers: { Authorization: "Bearer " + fetchCookieToken() },
        }
      );

      toast.success(data.message || "Email sent", { id: loading });
    } catch (error: any) {
      toast.error("Not sent", { id: loading });
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="email">
        <ColorText>Email</ColorText>
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="email"
          defaultValue={email}
          disabled={!verified}
          className="mt-2"
          type="text"
          onChange={(e) => {
            setNewEmail(e.target.value);
          }}
        />
        <Button onClick={ChangeEmail} size="sm" disabled={!verified}>
          Verify
        </Button>
      </div>
    </div>
  );
};

// password change
const PasswordChange: React.FC<{ verified: boolean; oldPassword: string }> = ({
  verified,
  oldPassword,
}) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [ConNewPassword, setConNewPassword] = useState<string>("");
  const updatePassword = async () => {
    if (newPassword.trim().length < 5) {
      return toast.error("Password should be minimum 6 char long");
    }
    if (newPassword !== ConNewPassword) {
      return toast.error("Passwords are not matching");
    }
    let loading = toast.loading("Please wait...");
    try {
      const { data } = await axios.put(
        resetPassword,
        {
          type: "oldPass",
          newPass: newPassword,
          oldPAss: oldPassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + fetchCookieToken(),
          },
        }
      );
      toast.error("Password updated", { id: loading });
      console.log(data);
    } catch (error: any) {
      toast.error("Error occur", { id: loading });
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <label htmlFor="email">
        <ColorText>Password</ColorText>
      </label>
      <div className="flex items-center gap-2">
        <div className="w-full flex flex-col gap-2">
          <Input
            placeholder="Password"
            type="password"
            disabled={!verified}
            className="mt-2"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <Input
            placeholder="ConfirmPassword"
            type="password"
            disabled={!verified}
            className="mt-2"
            // value={ConNewPassword}
            onChange={(e) => {
              setConNewPassword(e.target.value);
            }}
          />
        </div>
        <Button size="sm" onClick={updatePassword} disabled={!verified}>
          Change
        </Button>
      </div>
    </div>
  );
};
