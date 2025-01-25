import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/hooks/redux.hook";
import { useRef, useState } from "react";
import { handleImagePreview } from "@/functions/ImagePreview";
import toast from "react-hot-toast";
import axios from "axios";
import { userApi } from "@/api/users_api";
import { fetchCookieToken } from "@/functions/GetCookie";

// schema of form
const formSchema = z.object({
  fname: z.string().min(1, {
    message: "First name is required.",
  }),
  lname: z.string().min(1, {
    message: "Last name is required.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  conPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  phone: z.string().length(10, {
    message: "Invalid Indian number",
  }),
});

const AddUserPage: React.FC = () => {
  const theme = useAppSelector((s) => s.Theme.value);
  const token = fetchCookieToken();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [role, setRole] = useState<"admin" | "employee" | "customer">(
    "employee"
  );
  const [status, setStatus] = useState<"active" | "inactive">("inactive");
  const avatarPreviewRef = useRef<HTMLImageElement>(null);
  const avatarSelectorRef = useRef<HTMLInputElement>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      password: "",
      conPassword: "",
      email: "",
      phone: "",
    },
  });

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

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // create a formData
    const formData = new FormData();
    formData.append("fname", values.fname);
    formData.append("lname", values.lname);
    formData.append("password", values.password);
    formData.append("conPassword", values.conPassword);
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
      let { data } = await axios.post(userApi, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        withCredentials: true,
      });
      toast.success(data.message, {
        id: loading,
      });
      form.reset();
      handleFileCancel();
    } catch (error: any) {
      // error handling
      toast.error(error.response.data.message, {
        id: loading,
      });
      console.log("error: ", error);
    }
  };

  return (
    <Card className=" mt-5 mx-5  h-fit border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Create New User</CardTitle>
        <CardDescription>All fields marked * are required</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap gap-2"
          >
            <div className="flex-auto w-[200px] max-[800px]:w-full flex flex-wrap flex-col items-center ">
              <div className="border-2 w-40 h-40  dark:border-slate-600 overflow-hidden rounded-full">
                <img
                  src=""
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
              <div className="flex-auto w-[150px]">
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
              <div className="flex-auto w-[150px]">
                <FormField
                  control={form.control}
                  name="lname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex-auto w-[600px] max-[800px]:w-full mt-3 flex gap-6 gap-y-8 !flex-wrap">
              {/* email */}
              <div className="flex-auto w-[250px]">
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
              <div
                className={`flex-auto w-[250px] flex flex-col gap-2  ${
                  theme == "dark" ? "" : ""
                }`}
              >
                <label htmlFor="role">Role *</label>
                <select
                  name="role"
                  id="role"
                  className={`bg-transparent p-1.5 border-[1px] text-sm rounded-md ${
                    theme == "dark" ? "border-zinc-700" : ""
                  }`}
                  onChange={(e: any) => setRole(e.target.value)}
                >
                  <option
                    className={`${theme == "dark" ? "bg-zinc-800" : ""}`}
                    value="employee"
                    selected
                  >
                    Employee
                  </option>
                  <option
                    className={`${theme == "dark" ? "bg-zinc-800" : ""}`}
                    value="customer"
                  >
                    Customer
                  </option>
                  <option
                    className={`${theme == "dark" ? "bg-zinc-800" : ""}`}
                    value="admin"
                  >
                    Admin
                  </option>
                </select>
              </div>

              {/* phone number */}
              <div className="flex-auto w-[250px]">
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
              {/* password */}
              <div className="flex-auto w-[250px]">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* confirm password */}
              <div className="max-[600px]:flex-auto w-[250px]">
                <FormField
                  control={form.control}
                  name="conPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
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
                    (It will not activate until checked, it will saved as draft)
                  </span>
                </Label>
              </div>
              <div className="flex-auto w-full">
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
      </CardContent>
    </Card>
  );
};

export default AddUserPage;
