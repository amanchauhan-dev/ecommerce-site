import { productApi } from "@/api/product_api";
import AvatarComp from "@/components/AvatarComp";
import ColorText from "@/components/ColorText";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { formatReadableDateTime } from "@/functions/DateFormater";
import { fetchCookieToken } from "@/functions/GetCookie";
import { Product } from "@/types/types";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UpdateItemForm from "./UpdateItem";
import WarnDialog from "@/components/WarnDialog";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/redux.hook";
interface ProductsState extends Product {
  category_name?: string;
  variants?: any;
  images?: string[];
}

const ItemInfo: React.FC = () => {
  const curUser = useAppSelector((e) => e.User);
  const [itemDetails, setItemDetails] = useState<ProductsState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [id, setId] = useState<number | null>(null);
  const param = useParams();

  const fetchUserFromUserID = async (id: number) => {
    try {
      setLoading(true);
      // axios call
      let token = fetchCookieToken();
      const { data } = await axios.get(productApi + "/" + id, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setItemDetails({ ...data.data });
      setLoading(false);
    } catch (error: any) {
      setItemDetails(null);
      setLoading(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (id) {
      if (!isNaN(id)) {
        fetchUserFromUserID(id);
      }
    }
  };
  // delete item
  const [openWarn, setOpenWarn] = useState<boolean>(false);
  const handleDelete = async () => {
    let loading = toast.loading("Please wait...");
    try {
      let { data } = await axios.delete(productApi + "/" + id, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + fetchCookieToken(), // token
        },
      });
      toast.success(data.messages, { id: loading });
      setItemDetails(null);
      setId(null);
    } catch (error: any) {
      console.log(error);
      toast.error("Error occur", { id: loading });
    } finally {
      setOpenWarn(false);
    }
  };

  // update item
  useEffect(() => {
    if (param.id) {
      if (!isNaN(param.id as any)) {
        fetchUserFromUserID(Number(param.id));
        setId(param.id as any);
      }
    }
  }, []);
  return (
    <div className=" p-5">
      {/* // Search  */}
      <div className="mb-3">
        <form onSubmit={handleSubmit} className="flex w-96 gap-3">
          <Input
            placeholder="Please Enter Item id"
            type="number"
            value={id ? id : ""}
            onChange={(e) => {
              setId(Number(e.target.value));
            }}
            min={0}
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>
      {loading ? (
        <ColorText>Loading...</ColorText>
      ) : (
        !itemDetails && <ColorText>No data found</ColorText>
      )}
      {/* // data  */}
      {itemDetails && (
        <Card className="">
          <CardHeader>
            <div className="flex justify-between">
              <ColorText className="!text-lg">Item Information</ColorText>
              <div className="flex items-center gap-3">
                {curUser.role == "admin" && (
                  <WarnDialog
                    open={openWarn}
                    setOpen={setOpenWarn}
                    openElement={<ColorText variant="red">Delete</ColorText>}
                    onAccept={handleDelete}
                  />
                )}

                <UpdateItemForm
                  {...itemDetails}
                  fetchUserFromUserID={fetchUserFromUserID}
                />
              </div>
            </div>
            <CardDescription>
              All the details related to this product is shown here. You can
              make changes by clicking on Edit button.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* images and  small details  */}
            <div className=" flex flex-wrap gap-3">
              {/*  images */}
              <div className="flex-auto w-[300px] justify-center items-center  grid grid-cols-6">
                {/* all images */}

                <div className="col-span-1 h-[400px] p-1  gap-1 overflow-auto">
                  <AvatarComp
                    src={itemDetails.product_thumbnail}
                    className="w-full rounded-md h-fit"
                    alt="image"
                  />
                  {itemDetails.images?.map((e, i) => {
                    return (
                      <AvatarComp
                        key={i}
                        src={e}
                        className="w-full mt-1 rounded-md h-fit"
                        alt="image"
                      />
                    );
                  })}
                </div>
                {/*  active image */}
                <div className="col-span-5 flex justify-center items-center">
                  <AvatarComp
                    className="w-fit h-[350px] rounded-md"
                    src={itemDetails.product_thumbnail}
                  />
                </div>
              </div>
              {/*   Details */}
              <div className="flex-auto w-[300px] items-center justify-center">
                <ColorText className="!text-xl !text-center">
                  {itemDetails.product_name}
                </ColorText>
                <div className="my-2 flex gap-2 flex-wrap">
                  <ColorText
                    className=" p-2 rounded-lg !text-xl"
                    variant="green"
                  >
                    {itemDetails.price}
                  </ColorText>
                </div>
                {/*  variants */}
                <div className="my-4">
                  <ColorText className="!text-lg my-3">Variations:</ColorText>
                  <div className="mt-1 flex  flex-wrap gap-3">
                    {itemDetails.variants.length > 0 &&
                      itemDetails.variants.map((e: any, i: any) => {
                        return (
                          <Card
                            key={i}
                            className="w-fit flex gap-2 p-2 !shadow-sm rounded-md px-3"
                          >
                            {e?.color && (
                              <div className="flex items-center gap-2">
                                <ColorText className="">Color </ColorText>
                                <span
                                  className="w-5 h-5 rounded-lg inline-block"
                                  style={{ backgroundColor: e?.color }}
                                ></span>
                              </div>
                            )}
                            {e?.size && (
                              <div className="flex items-center gap-2">
                                <ColorText className="">Size: </ColorText>
                                <ColorText className="">{e?.size}</ColorText>
                              </div>
                            )}
                            {e?.stock_quantity && (
                              <div className="flex items-center gap-2">
                                <ColorText className="">Stock: </ColorText>
                                <ColorText className="">
                                  {e.stock_quantity}{" "}
                                </ColorText>
                              </div>
                            )}
                            {e?.price && (
                              <div className="flex items-center gap-2">
                                <ColorText className="">Price: </ColorText>
                                <ColorText className="">{e?.price}</ColorText>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                  </div>
                </div>
                {/* category stock status  */}
                <div className="my-2 flex flex-col gap-2 flex-wrap">
                  <div className="flex gap-2 ">
                    <ColorText className="!text-lg">Category: </ColorText>
                    <ColorText className="!text-lg" variant="yellow">
                      {itemDetails.category_name}
                    </ColorText>
                  </div>
                  <div className="flex gap-2 ">
                    <ColorText className="!text-lg">Total Stock: </ColorText>
                    <ColorText className="!text-lg" variant="pink">
                      {itemDetails.stock_quantity}
                    </ColorText>
                  </div>
                  <div className="flex gap-2">
                    <ColorText className="!text-lg">Status: </ColorText>
                    <ColorText className="!text-lg" variant="green">
                      {itemDetails.status}
                    </ColorText>
                  </div>
                  <div className="flex gap-1 flex-col ">
                    <div>
                      <ColorText>Created At: </ColorText>
                      <ColorText variant="default">
                        {formatReadableDateTime(itemDetails.created_at)}
                      </ColorText>
                    </div>
                    <div>
                      <ColorText>Updated At: </ColorText>
                      <ColorText variant="default">
                        {formatReadableDateTime(itemDetails.updated_at)}
                      </ColorText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* description  */}
            <div className="my-3 font-semibold">
              <ColorText className="!text-[15px]">
                {itemDetails.description}
              </ColorText>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItemInfo;
