import HomeCategoryNav from "@/components/HomeCategoryNav";
import { PageGap } from "@/components/PageGap";
import { ProductSearchCard } from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <>
      <SearchBar />
      <HomeCategoryNav />
      <PageGap>
        <div className="w-full flex space-x-2">
          <ProductSearchCard
            {...{
              id: 1,
              product_name: "Brown Shoes with white base, just in rupees 299",
              url_slug: "Brown Shoes with white base, just in rupees 299",
              product_image: "/products/shoe2.png",
              category_id: 12,
              description: "Brown Shoes with white base, just in rupees 299",
              price: 299,
            }}
          />
          <ProductSearchCard
            {...{
              id: 1,
              product_name: "Brown Shoes with white base, just in rupees 299",
              url_slug: "Brown Shoes with white base, just in rupees 299",
              product_image: "/products/neon-t-shirt.jpg",
              category_id: 12,
              description: "Brown Shoes with white base, just in rupees 299",
              price: 299,
            }}
          />
        </div>
      </PageGap>
    </>
  );
}
