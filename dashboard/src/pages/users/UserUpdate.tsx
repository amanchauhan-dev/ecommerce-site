import { userApi } from "@/api/users_api";
import ColorText from "@/components/ColorText";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Label } from "@/components/ui/label";
import { fetchCookieToken } from "@/functions/GetCookie";
import { handleImagePreview } from "@/functions/ImagePreview";
import { User } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface UserUpdateProps extends User {
  setRefresh?: any;
}

// schema of form
const formSchema = z.object({
  fname: z.string().min(1, {
    message: "First name is required.",
  }),
  lname: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  phone: z.string().length(10, {
    message: "Invalid Indian number",
  }),
});

const UserUpdate: React.FC<UserUpdateProps> = (props) => {
  const { setRefresh = () => {} } = props;
  const token = fetchCookieToken();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState<"admin" | "employee" | "customer">(
    "employee"
  );
  const [status, setStatus] = useState<"active" | "inactive" | "block">(
    "inactive"
  );
  const avatarPreviewRef = useRef<HTMLImageElement>(null);
  const avatarSelectorRef = useRef<HTMLInputElement>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
    },
  });
  const [reset, setReset] = useState<number>(0);
  // 2. Define your submit function.
  useEffect(() => {
    form.setValue("fname", props.fname || "");
    form.setValue("lname", props.lname || "");
    form.setValue("email", props.email || "");
    form.setValue("phone", props.phone_number || "");
    setRole(props.role);
    setStatus(props.status);
    let url = import.meta.env.VITE_SERVER_IMAGES_URL + "/" + props.avatar;
    avatarPreviewRef &&
      avatarPreviewRef.current &&
      (avatarPreviewRef.current.src = url);
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
    formData.append("email", values.email);
    formData.append("phone_number", values.phone);
    formData.append("role", role);
    formData.append("status", status);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    // create a new user
    const loading = toast.loading("Please wait...");

    try {
      // axios call
      let { data } = await axios.put(userApi + "/" + props.id, formData, {
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
        <Button variant="ghost">
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
              <div className="flex flex-col">
                <div className="border-2 w-40 h-40  dark:border-slate-600 overflow-hidden rounded-full">
                  <img
                    src={
                      import.meta.env.VITE_SERVER_IMAGES_URL +
                      "/" +
                      props.avatar
                    }
                    className="w-full h-full border-none rounded-full object-cover"
                    ref={avatarPreviewRef}
                    alt=""
                  />
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
              <div className="flex-auto w-[400px] max-[800px]:w-full flex gap-6 gap-y-8 !flex-wrap">
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
                {/* email */}
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="text" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* role */}
                <div className={`flex-auto w-[250px] flex flex-col gap-2 `}>
                  <label htmlFor="role">Role *</label>
                  <select
                    name="role"
                    id="role"
                    className={`bg-transparent p-1.5 border-[1px] text-sm rounded-md`}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="employee" selected>
                      Employee
                    </option>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
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
                {/* active checkbox */}
                <div className="flex-auto w-full flex gap-2 items-center">
                  <Checkbox
                    id="isActive"
                    checked={status == "active" ? true : false}
                    onClick={() => {
                      status == "active"
                        ? setStatus("inactive")
                        : setStatus("active");
                    }}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer text-sm">
                    Activate
                    <span className="text-sm !font-[400]">
                      (It will not activate until checked, it will saved as
                      draft)
                    </span>
                  </Label>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdate;
