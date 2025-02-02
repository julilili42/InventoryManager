import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Article, ArticleStatistics } from "@/lib/interfaces";
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
import { getArticleStatistics } from "@/lib/services/statisticService";

export const ArticleDetails = () => {
  const { article_id } = useParams();
  const navigate = useNavigate();
  const [fetchedArticle, setFetchedArticle] = useState<Article | null>(null);
  const [fetchedArticleStatistics, setFetchedArticleStatistics] =
    useState<ArticleStatistics | null>(null);

  const extractArticleStatistics = (
    article_stats: ArticleStatistics | null,
    id: number
  ) => ({
    ordered_quantity: article_stats?.ordered_quantities[id] ?? NaN,
    article_revenue: article_stats?.article_revenue[id] ?? NaN,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (article_id) {
        const article = await searchArticle(Number(article_id));
        setFetchedArticle(article);
      }
    };

    const fetchStatistics = async () => {
      const article_stats: ArticleStatistics = await getArticleStatistics();
      setFetchedArticleStatistics(article_stats);
    };

    fetchArticle();
    fetchStatistics();
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
                <CardDescription className="text-xl">
                  {
                    extractArticleStatistics(
                      fetchedArticleStatistics,
                      Number(article_id)
                    ).ordered_quantity
                  }
                </CardDescription>
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
                <CardDescription className="text-xl">
                  {
                    extractArticleStatistics(
                      fetchedArticleStatistics,
                      Number(article_id)
                    ).article_revenue
                  }{" "}
                  €
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
