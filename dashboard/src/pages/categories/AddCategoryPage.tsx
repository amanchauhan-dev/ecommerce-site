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
// import { useAppSelector } from "@/hooks/redux.hook";
import toast from "react-hot-toast";
import { fetchCookieToken } from "@/functions/GetCookie";
import axios from "axios";
import { categoryApi } from "@/api/category_api";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import Select, { SelectOption } from "@/components/Select";
import ColorText from "@/components/ColorText";

// schema of form
const formSchema = z.object({
  name: z.string().min(1, {
    message: "First name is required.",
  }),
});

const AddCategoryPage: React.FC = () => {
  //   const theme = useAppSelector((s) => s.Theme.value);
  const token = fetchCookieToken();
  const [parents, setParents] = useState<
    { id: number; category_name: string }[]
  >([]);
  const [parent, setParent] = useState<number>(0);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // fetch parents
  const fetchParents = async () => {
    try {
      const { data } = await axios.get(`${categoryApi}?isSub=false`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setParents([...data.data]);
    } catch (error: any) {
      console.log(error);
    }
  };

  // handle select parent

  useEffect(() => {
    fetchParents();
  }, []);
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // create a new category
    const loading = toast.loading("Please wait...");

    try {
      let formData: any = { category_name: values.name, status: status };

      // axios call
      if (parent !== null && parent != 0) {
        formData.parent_cat_id = parent; // if parent is selected
      }

      let { data } = await axios.post(
        categoryApi,
        { ...formData },
        {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
       fetchParents()
      toast.success(data.message, {
        id: loading,
      });
      setParent(0);
      form.reset();
    } catch (error: any) {
      // error handling
      toast.error(error.message, {
        id: loading,
      });
      console.log("error: ", error);
    }
  };

  return (
    <Card className=" mt-5 mx-5  h-fit border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Create New Category</CardTitle>
        <CardDescription>All fields marked * are required</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-wrap gap-2"
          >
            <div className="flex-auto w-[400px] items-center flex gap-6 gap-y-8 flex-wrap">
              {/*  name */}
              <div className="flex-auto w-[250px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
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
              {/*  parents */}
              <div className="flex-auto w-[250px] flex flex-col gap-2 ">
                <label className="text-sm">Sub Category Of</label>
                <Select
                  name="parents"
                  onClick={(e: any) => {
                    setParent(e.target.value);
                  }}
                >
                  <SelectOption selected={parent == 0 && true} value={0}>
                    None
                  </SelectOption>
                  {parents.map((e) => {
                    return (
                      <SelectOption
                        selected={parent == e.id && true}
                        key={e.id}
                        value={e.id}
                      >
                        {e.category_name}
                      </SelectOption>
                    );
                  })}
                </Select>
                <ColorText>Select only if it has a parent category</ColorText>
              </div>
              {/* active checkbox */}
              <div className="flex-auto w-full flex gap-2 items-center">
                <input
                  type="checkbox"
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
              {/* action */}
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

export default AddCategoryPage;
