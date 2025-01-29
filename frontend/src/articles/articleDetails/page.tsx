import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Article } from "@/lib/interfaces";
import { searchArticle } from "@/lib/services/articleService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CircleDollarSign,
  Truck,
  Layers,
  HandCoins,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ArticleDetails = () => {
  const { article_id } = useParams();
  const navigate = useNavigate();
  const [fetchedArticle, setFetchedArticle] = useState<Article | null>(null);

  useEffect(() => {
    console.log(article_id);
    const fetchArticle = async () => {
      try {
        if (article_id) {
          const article = await searchArticle(Number(article_id));
          setFetchedArticle(article);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setFetchedArticle(null);
      }
    };

    fetchArticle();
  }, [article_id]);

  return (
    <div className="flex flex-col items-start justify-center px-8 mt-8">
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent hover:text-inherit"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft /> Back to Articles
      </Button>
      <Card className="w-full mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">{fetchedArticle?.name}</CardTitle>
          <CardDescription className="p-0">
            <div className="flex gap-4">
              <div>
                <span className="font-bold">Article ID: </span>#
                {fetchedArticle?.article_id}
              </div>
              <div>
                <span className="font-bold">Manufacturer: </span>
                {fetchedArticle?.manufacturer}
              </div>
              <div>
                <span className="font-bold">Category: </span>
                {fetchedArticle?.category}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <CircleDollarSign />
              <div>
                <CardTitle>Price</CardTitle>
                <CardDescription className="text-xl">
                  {fetchedArticle?.price} €
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <Truck />
              <div>
                <CardTitle>Number of Orders</CardTitle>
                <CardDescription className="text-xl">145</CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <Layers />
              <div>
                <CardTitle>Stock</CardTitle>
                <CardDescription className="text-xl">
                  {fetchedArticle?.stock}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 p-6">
              <HandCoins />
              <div>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription className="text-xl">1000 €</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
