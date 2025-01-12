// articles.tsx
import { AddArticle } from "@/articles/addArticle";
import { TableArticle } from "./page";

export const Articles = () => {
  return (
    <div className="flex flex-col items-start h-full gap-8 px-10 mt-8 lg:flex-row">
      <div className="w-full lg:mt-18 lg:w-1/2">
        <AddArticle />
      </div>
      <div className="w-full lg:mt-18 lg:w-1/2">
        <TableArticle />
      </div>
    </div>
  );
};
