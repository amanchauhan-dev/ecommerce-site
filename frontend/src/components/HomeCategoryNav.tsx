import { PageGap } from "./PageGap";
import { Button } from "./ui/button";

interface HomeCategoryNavProps {}

const HomeCategoryNav: React.FC<HomeCategoryNavProps> = () => {
  return (
    <>
      {/* Category navigation */}
      <PageGap className="flex">
        <div className="w-full flex justify-center whitespace-nowrap overflow-auto">
          <div className="flex justify-center w-max space-x-1 pb-1">
            {[
              "Men Wear",
              "Women Wear",
              "Kid's Wear",
              "Phone",
              "Laptop",
              "Wearing Accessories",
              "Furniture",
              "Winter",
            ].map((e) => {
              return (
                <Button
                  key={e}
                  variant={"ghost"}
                  className="text-muted-foreground border"
                >
                  {e}
                </Button>
              );
            })}
          </div>
        </div>
      </PageGap>
     
    </>
  );
};

export default HomeCategoryNav;
