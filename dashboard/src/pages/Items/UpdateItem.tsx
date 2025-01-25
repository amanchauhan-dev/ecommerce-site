import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import { Product } from "@/types/types";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

// Define the schema using zod for validation
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.number().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductsState extends Product {
  category_name?: string;
  variants?: any;
  images?: string[];
  fetchUserFromUserID: any;
}
const UpdateItemForm: React.FC<ProductsState> = (props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<"active" | "inactive">(props.status);
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
      title: props.product_name,
      description: props.description,
      price: props.price,
      stock: props.stock_quantity,
      category: props.category_id,
    },
  });
  useEffect(() => {
    setValue("title", props.product_name);
    setValue("description", props.description || "");
    setValue("category", props.category_id);
    setValue("price", props.price);
    setValue("stock", props.stock_quantity);
  }, [props]);
  // category
  const [parents, setParents] = useState<
    { id: number; category_name: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  // variant state
  const [variants, setVariants] = useState<
    {
      color?: string;
      size?: string;
      price?: number;
      stock_quantity?: number;
      id?: number;
    }[]
  >([]);
  const [varianceChanged, setChangedVariance] = useState<boolean>(false);

  useEffect(() => {
    let temp: {
      color?: string;
      size?: string;
      price?: number;
      stock_quantity?: number;
      id?: number;
    }[] = [];
    props.variants.forEach((variant: any) => {
      temp.push({
        color: variant.color,
        id: variant.id,
        size: variant.size,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
      });
    });

    setVariants([...temp]);
  }, []);

  const [variant, setVariant] = useState<{
    color?: string;
    size?: string;
    price?: number;
    stock_quantity?: number;
  }>({ color: "", size: "", stock_quantity: 0, price: 0 });
  // add a new variant
  const handleAddVariant = () => {
    setChangedVariance(true);
    if (variant.color?.length == 0 && variant.size?.length == 0) {
      return;
    }
    setVariants((prev) => [{ ...variant }, ...prev]);
  };
  // delete variant
  const handleDeleteVariant = (index: any) => {
    setChangedVariance(true);
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
    if (status) {
      formData.append("status", status);
    }
    if (selectedCategory != "" && selectedCategory != "0")
      formData.append("category_id", selectedCategory);
    // add variants
    if (varianceChanged == true)
      if (variants && variants.length > 0)
        formData.append("variants", JSON.stringify(variants));
      else formData.append("variants", JSON.stringify([]));

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
      const res = await axios.put(productApi + "/" + props.id, formData, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      // success
      toast.success(res.data.message, { id: loading });
      reset();
      props.fetchUserFromUserID(props.id);
    } catch (error: any) {
      // error
      let { response } = error;
      if (response.status === 409) {
        toast.error(response.data.message, { id: loading });
        return;
      }
      toast.error(error.message, { id: loading });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button size={"sm"}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="!overflow-auto rounded-lg">
        <DialogHeader></DialogHeader>
        <div className=" h-[80vh]">
          <div className=" mx-auto w-full">
            <h1 className="text-2xl font-bold mb-6">Update Items</h1>
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
                        handleImagePreview(avatarInputRef, avatarImgRef);
                      }
                    }}
                    className="mt-1 w-full p-2 rounded hidden"
                  />
                  <div className="w-32 h-40  border-2 rounded-md m-auto flex justify-center items-center">
                    <img
                      src={
                        import.meta.env.VITE_SERVER_IMAGES_URL +
                        props.product_thumbnail
                      }
                      ref={avatarImgRef}
                      className="h-full w-full object-cover"
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
                        handleImagePreviewCancel(avatarInputRef, avatarImgRef);
                      }}
                      size={"sm"}
                    >
                      DELETE
                    </Button>
                  </div>
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
                      <p className="text-red-500 text-xs">
                        {errors.title.message}
                      </p>
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
                      <p className="text-red-500 text-xs">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium">
                  Description *
                </label>
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
                  <label className="block text-sm font-medium">
                    Category *
                  </label>
                  <select
                    value={getValues("category")}
                    className="mt-1 w-full p-2 rounded border "
                    onChange={(e) => {
                      setValue("category", Number(e.target.value));
                      setSelectedCategory(e.target.value.toString());
                    }}
                  >
                    <option
                      key={0}
                      selected={selectedCategory == "0" && true}
                      value={0}
                    >
                      None
                    </option>
                    {parents.map((e) => {
                      return (
                        <option
                          selected={selectedCategory == e.id.toString() && true}
                          key={e.id}
                          value={e.id}
                        >
                          {e.category_name}
                        </option>
                      );
                    })}

                    {/* Add more category options here */}
                  </select>
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
                    <p className="text-red-500 text-xs">
                      {errors.stock.message}
                    </p>
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
                  onChange={() => {
                    handleMultipleImagePreview(imagesInputRef, imagesImgRef);
                  }}
                />
                <div
                  className="w-full h-40 rounded-lg border-2 p-3 mt-3 flex gap-2  items-center"
                  ref={imagesImgRef}
                >
                  {props.images?.map((e, i) => {
                    return (
                      <img
                        key={i}
                        src={import.meta.env.VITE_SERVER_IMAGES_URL + e}
                        alt="image"
                        className="max-w-[100px] m-[5px] object-cover h-fit"
                      />
                    );
                  })}
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
                      setVariant({
                        ...variant,
                        stock_quantity: Number(e.target.value),
                      });
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
                  className="mr-2"
                  checked={status == "active" ? true : false}
                  id="status"
                  onClick={() => {
                    if (status == "active") setStatus("inactive");
                    else setStatus("active");
                  }}
                />
                <label htmlFor="status" className="text-sm">
                  Activate (Will save as draft if not checked)
                </label>
              </div>
              <div className="flex justify-end">
                <Button className="" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateItemForm;

interface VariantProps {
  color?: string;
  size?: string;
  price?: number;
  stock?: number;
  handleDeleteVariant?: any;
  index: number;
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
    <div className="flex gap-2 flex-wrap items-center border-2 bg-zinc-300 p-2 rounded">
      <Card className="p-2 !shadow-none !rounded-md  flex-auto w-32">
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
        onClick={() => handleDeleteVariant(index)}
        size={"sm"}
      >
        <Plus className="rotate-45" />
      </Button>
    </div>
  );
};
