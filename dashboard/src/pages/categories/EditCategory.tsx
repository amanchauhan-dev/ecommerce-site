import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorText from "../../components/ColorText";
import { Category } from "@/types/types";
import { formatReadableDateTime } from "@/functions/DateFormater";
import { useState } from "react";
import axios from "axios";
import { categoryApi } from "@/api/category_api";
import { fetchCookieToken } from "@/functions/GetCookie";

interface EditCategoryProps extends Category {
  parent_name?: string | null;
  setForce?: any;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  category_name,
  id,
  created_at,
  updated_at,
  status,
  parent_name,
  setForce,
}) => {
  const [categoryName, setCategoryName] = useState(category_name);
  const [statusVal, setStatusVal] = useState<"active" | "inactive">(status);
  const handleSubmit = async () => {
    if (category_name !== categoryName || status != statusVal) {
      //update logic here
      try {
        let token = fetchCookieToken();
        const { data } = await axios.put(
          categoryApi + "/" + id,
          {
            category_name: categoryName,
            id: id,
            status: statusVal,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (data) {
          setForce((e: any) => e + 1);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <ColorText variant="green">Edit</ColorText>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to Category here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex gap-3 mb-2">
            <ColorText className="text-[12px]">Created At:</ColorText>
            <ColorText className="text-[12px]">
              {formatReadableDateTime(created_at)}
            </ColorText>
          </div>
          <div className="flex gap-3">
            <ColorText className="text-[12px]">Updated At:</ColorText>
            <ColorText className="text-[12px]">
              {formatReadableDateTime(updated_at)}
            </ColorText>
          </div>
        </div>
        <div className="grid gap-4 py-2">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-600">
              Id :
            </Label>
            <ColorText>{id}</ColorText>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-600">
              Parent :
            </Label>
            <ColorText>{!parent_name ? "---" : parent_name}</ColorText>
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-600">
              Name
            </Label>
            <Input
              onChange={(e) => setCategoryName(e.target.value)}
              id="name"
              defaultValue={category_name}
              className=""
            />
          </div>
          {/* active checkbox */}
          <div className="flex-auto w-full flex gap-2 items-center">
            <input
              type="checkbox"
              id="isActive"
              className="cursor-pointer"
              checked={statusVal == "active" ? true : false}
              onClick={() => {
                statusVal == "active"
                  ? setStatusVal("inactive")
                  : setStatusVal("active");
              }}
            />
            <Label htmlFor="isActive" className="cursor-pointer text-sm">
              Activate
              <span className="text-sm !font-[400]">
                (It will not activate until checked, it will saved as draft)
              </span>
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategory;
