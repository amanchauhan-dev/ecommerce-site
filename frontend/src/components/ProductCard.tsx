import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Product } from "../types/dataTypes";

interface ProductSearchCardProps extends Product {
  className?: string;
}

export const ProductSearchCard: React.FC<ProductSearchCardProps> = (props) => {
  return (
    <Card className={`w-40 space-y-1 p-2 rounded-md shadow-lg ${props.className}`}>
      <CardContent className="p-0">
        <Image
          src={props.product_image}
          alt="Image"
          height={100}
          width={100}
          className="w-full h-full object-contain rounded"
        />
      </CardContent>
      <CardHeader className="p-0">
        <CardTitle className="">{props.product_name.slice(0,37)}...</CardTitle>
        <CardDescription>Hello world</CardDescription>
      </CardHeader>
    </Card>
  );
};
