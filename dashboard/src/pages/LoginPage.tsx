import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import ThemeChanger from "@/components/ThemeChanger";
import axios from "axios";
import { dashboardLogin } from "@/api/users_api";
import toast from "react-hot-toast";
import { setToken } from "@/store/slices/UserSlice";
import { useNavigate } from "react-router-dom";

// schema of form
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string().min(1, {
    message: "Field is required",
  }),
});

const LoginPage: React.FC = () => {
  const theme = useAppSelector((s) => s.Theme.value);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const loading = toast.loading("Please wait...");
    try {
      // axios call
      const { data } = await axios.post(
        dashboardLogin,
        { ...values },
        { withCredentials: true }
      );

      toast.success(data.message, { id: loading });
      dispatch(setToken(data.token));
      navigate("/");
      form.reset(); // reset the form if login
    } catch (error: any) {
      // handle error
      if (error.status === 400) {
        toast.error("Either password or email is invalid", { id: loading });
      } else {
        toast.error("Something went wrong please try again later...", { id: loading });
      }
    }
  };

  return (
    <div
      className={`${
        theme == "dark" ? "bg-zinc-950" : "bg-white"
      } ${theme} h-[100vh] flex justify-center items-center`}
    >
      <ThemeChanger className="absolute top-5 right-8" />
      <Card className="w-[400px] max-[600px]:w-[95%]  m-auto h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* username */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
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
              <Button
                type="submit"
                className="w-full !bg-sky-600 hover:!bg-sky-700 dark:hover:!bg-sky-500 dark:text-white"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
