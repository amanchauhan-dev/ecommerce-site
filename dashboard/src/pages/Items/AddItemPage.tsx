import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select, { SelectOption } from "@/components/Select";
import axios from "axios";
import { categoryApi } from "@/api/category_api";
import { fetchCookieToken } from "@/functions/GetCookie";
import { Button } from "@/components/ui/button";
import {
  handleImagePreview,
  handleImagePreviewCancel,
  handleMultipleImagePreview,
  handleMultipleImagePreviewCancel,
} from "@/functions/ImagePreview";
import ColorText from "@/components/ColorText";
import { Plus } from "lucide-react";
import { productApi } from "@/api/product_api";
import toast from "react-hot-toast";

// Define the schema using zod for validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  avatar: z.string().nonempty("Avatar is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.number().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  images: z.array(z.string()).min(2, "At least two images are required"),
  status: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateItemForm: React.FC = () => {
  const token = fetchCookieToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      status: true,
      images: [],
    },
  });

  // category
  const [parents, setParents] = useState<
    { id: number; category_name: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // variant state
  const [variants, setVariants] = useState<
    { color?: string; size?: string; price?: number; stock_quantity?: number }[]
  >([]);
  const [variant, setVariant] = useState<{
    color?: string;
    size?: string;
    price?: number;
    stock_quantity?: number;
  }>({ color: "", size: "", stock_quantity: 0, price: 0 });
  // add a new variant
  const handleAddVariant = () => {
    if (variant.color?.length == 0 && variant.size?.length == 0) {
      return;
    }
    setVariants((prev) => [{ ...variant }, ...prev]);
  };
  // delete variant
  const handleDeleteVariant = (index: any) => {
    let newVariants = variants.filter((e, i) => i !== index);
    setVariants([...newVariants]);
  };

  // image preview ref
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarImgRef = useRef<HTMLImageElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const imagesImgRef = useRef<HTMLDivElement>(null);
  // images state

  // fetch parents
  const fetchParents = async () => {
    try {
      const { data } = await axios.get(`${categoryApi}`, {
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
  useEffect(() => {
    fetchParents();
  }, []);

  const onSubmit = async (data: FormValues) => {
    // create a form data
    const formData = new FormData();
    // details
    formData.append("product_name", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock_quantity", data.stock.toString());
    if (data.status)
      formData.append("status", data.status == true ? "active" : "inactive");
    if (selectedCategory != "" && selectedCategory != "0")
      formData.append("category_id", selectedCategory);
    // add variants
    if (variants && variants.length > 0)
      formData.append("variants", JSON.stringify(variants));

    // add avatar
    if (avatarInputRef.current && avatarInputRef.current?.files) {
      formData.append("product_thumbnail", avatarInputRef.current.files[0]);
    }
    // add images
    if (imagesInputRef.current && imagesInputRef.current?.files) {
      // formData.append(`images`, imagesInputRef.current?.files[0]);
      Array.from(imagesInputRef.current.files).forEach((file) => {
        formData.append(`product_image`, file);
      });
    }

    let loading = toast.loading("Please wait...");
    try {
      // axios call
      const res = await axios.post(productApi, formData, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      toast.success(res.data.message, { id: loading });
      reset();
      handleImagePreviewCancel(avatarInputRef, avatarImgRef);
      handleMultipleImagePreviewCancel(imagesInputRef, imagesImgRef);
      setVariants([]);
    } catch (error: any) {
      let { response } = error;
      if (response.status === 409) {
        toast.error(response.data.message, { id: loading });
        return;
      }
      toast.error(error.message, { id: loading });
      console.log("error:", error);
    }
  };

  return (
    <div className="p-7">
      <Card className=" mx-auto p-6 w-full rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create Items</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* Avatar Field */}
            <div className="flex-auto w-[250px]">
              <label className="block text-sm font-medium" htmlFor="avatar">
                Avatar *
              </label>
              {/* hidden field */}
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                ref={avatarInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setValue("avatar", url);
                    handleImagePreview(avatarInputRef, avatarImgRef);
                  }
                }}
                className="mt-1 w-full p-2 rounded hidden"
              />
              <div className="w-32 h-40  border-2 rounded-md m-auto flex justify-center items-center">
                <img
                  src=""
                  ref={avatarImgRef}
                  className="h-full w-full object-cover hidden"
                  alt=""
                />
              </div>
              <div className="flex justify-center items-center gap-3 mt-3">
                <label htmlFor="avatar">
                  <Button className="pointer-events-none" size={"sm"}>
                    ADD
                  </Button>
                </label>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    setValue("avatar", "");
                    handleImagePreviewCancel(avatarInputRef, avatarImgRef);
                  }}
                  size={"sm"}
                >
                  DELETE
                </Button>
              </div>
              {errors.avatar && (
                <p className="text-red-500 text-xs">{errors.avatar.message}</p>
              )}
            </div>
            <div className="flex flex-col flex-auto  w-[300px] flex-wrap">
              {/* Title Field */}
              <div className="flex-auto ">
                <label className="block text-sm font-medium">
                  Title or Name *
                </label>
                <Input
                  {...register("title")}
                  type="text"
                  className="mt-1 w-full p-2 rounded border"
                  placeholder="Enter title"
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title.message}</p>
                )}
              </div>
              {/* Price Field */}
              <div className="flex-auto ">
                <label className="block text-sm font-medium">Price *</label>
                <Input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  className="mt-1 w-full p-2 rounded border"
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs">{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>
          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium">Description *</label>
            <Textarea
              {...register("description")}
              rows={5}
              className="mt-1 w-full p-2 rounded border"
              placeholder="Write description of item..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* category and stock */}
          <div className="flex flex-auto gap-3 flex-wrap">
            {/* Category Field */}
            <div className="flex-auto w-[250px]">
              <label className="block text-sm font-medium">Category *</label>
              <Select
                {...register("category")}
                className="mt-1 w-full p-2 rounded border "
                onChange={(e) => {
                  setValue("category", Number(e.target.value));
                  setSelectedCategory(e.target.value.toString());
                }}
              >
                <SelectOption
                  key={0}
                  selected={selectedCategory == "0" && true}
                  value={0}
                >
                  None
                </SelectOption>
                {parents.map((e) => {
                  return (
                    <SelectOption
                      selected={selectedCategory == e.id.toString() && true}
                      key={e.id}
                      value={e.id}
                    >
                      {e.category_name}
                    </SelectOption>
                  );
                })}

                {/* Add more category options here */}
              </Select>
              {errors.category && (
                <p className="text-red-500 text-xs">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Stock Field */}
            <div className="flex-auto w-[250px]">
              <label className="block text-sm font-medium">Stock *</label>
              <Input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                className="mt-1 w-full p-2 rounded border"
                placeholder="Enter stock"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs">{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Image Upload Field */}
          <div>
            <label htmlFor="images" className="block text-sm font-medium">
              Images (At least two) *
            </label>
            {/* hidden file field */}
            <input
              id="images"
              type="file"
              multiple
              ref={imagesInputRef}
              className="mt-1 w-full p-2 rounded border hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setValue(
                  "images",
                  files.map((file) => URL.createObjectURL(file))
                );
                handleMultipleImagePreview(imagesInputRef, imagesImgRef);
              }}
            />
            <div
              className="w-full h-40 rounded-lg border-2 p-3 mt-3 flex gap-2  items-center"
              ref={imagesImgRef}
            >
              images
            </div>
            <div className="flex  items-center gap-3 mt-3">
              <label htmlFor="images">
                <Button className="pointer-events-none" size={"sm"}>
                  ADD
                </Button>
              </label>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setValue("images", []);
                  handleMultipleImagePreviewCancel(
                    imagesInputRef,
                    imagesImgRef
                  );
                }}
                size={"sm"}
              >
                DELETE
              </Button>
            </div>
            {errors.images && (
              <p className="text-red-500 text-xs">{errors.images.message}</p>
            )}
          </div>

          {/* Variations */}

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Add Variations</h2>
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Color"
                className="w-1/4 p-2 rounded border "
                onChange={(e) => {
                  setVariant({ ...variant, color: e.target.value });
                }}
              />
              <Input
                type="text"
                placeholder="Size"
                onChange={(e) => {
                  setVariant({ ...variant, size: e.target.value });
                }}
                className="w-1/4 p-2 rounded border "
              />
              <Input
                type="number"
                placeholder="Price"
                className="w-1/4 p-2 rounded border "
                onChange={(e) => {
                  setVariant({ ...variant, price: Number(e.target.value) });
                }}
              />
              <Input
                type="number"
                placeholder="Stock"
                className="w-1/4 p-2 rounded border "
                onChange={(e) => {
                  setVariant({ ...variant, stock_quantity: Number(e.target.value) });
                }}
              />
              <Button type="button" size={"sm"} onClick={handleAddVariant}>
                Add
              </Button>
            </div>
            {variants.map((e, i) => {
              return (
                <Variant
                  key={i}
                  index={i}
                  handleDeleteVariant={handleDeleteVariant}
                  color={e.color}
                  size={e.size}
                  price={e.price}
                  stock={e.stock_quantity}
                />
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("status")}
              className="mr-2"
              id="status"
              onClick={() => {
                setValue("status", !getValues("status"));
              }}
            />
            <label htmlFor="status" className="text-sm">
              Activate (Will save as draft if not checked)
            </label>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateItemForm;

interface VariantProps {
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  index: number;
  handleDeleteVariant: any;
}

const Variant: React.FC<VariantProps> = ({
  color = "",
  size = "",
  price = 0,
  stock = 0,
  index,
  handleDeleteVariant = () => {},
}) => {
  return (
    <div className="flex gap-2 flex-wrap items-center p-2 rounded border-2">
      <Card className="p-2 !shadow-none !rounded-md flex-auto w-32">
        <ColorText className="">Color: </ColorText>
        <span
          style={{ backgroundColor: color }}
          className="w-3 h-3 relative top-0.5 inline-block rounded-sm shadow-md mx-1"
        ></span>
        <ColorText className="">{color} </ColorText>
      </Card>
      <Card className="p-2 !shadow-none !rounded-md flex-auto w-32">
        <ColorText className="">Size: </ColorText>
        <ColorText className="">{size} </ColorText>
      </Card>
      <Card className="p-2 !shadow-none !rounded-md flex-auto w-32">
        <ColorText className="">Price: </ColorText>
        <ColorText className="">{price} </ColorText>
      </Card>
      <Card className="p-2 !shadow-none !rounded-md flex-auto w-32">
        <ColorText className="">Stock: </ColorText>
        <ColorText className="">{stock} </ColorText>
      </Card>
      <Button
        variant={"destructive"}
        onClick={() => {
          handleDeleteVariant(index);
        }}
        size={"sm"}
      >
        <Plus className="rotate-45" />
      </Button>
    </div>
  );
};
