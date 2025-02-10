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
import { Hash, HandCoins } from "lucide-react";
import { getArticleStatistics } from "@/lib/services/statisticService";

export const ArticleDetails = ({ articleId }: { articleId: number | null }) => {
  const [fetchedArticle, setFetchedArticle] = useState<Article | null>(null);
  const [fetchedArticleStatistics, setFetchedArticleStatistics] =
    useState<ArticleStatistics | null>(null);

  const extractArticleStatistics = (
    article_stats: ArticleStatistics | null,
    id: number
  ) => ({
    ordered_quantity: article_stats?.ordered_quantities[id] ?? "Not available",
    article_revenue: article_stats?.article_revenue[id] ?? "Not available",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      if (articleId) {
        const article = await searchArticle(Number(articleId));
        setFetchedArticle(article);
      }
    };

    const fetchStatistics = async () => {
      const article_stats: ArticleStatistics = await getArticleStatistics();
      setFetchedArticleStatistics(article_stats);
    };

    fetchArticle();
    fetchStatistics();
  }, [articleId]);

  return (
    <div className="flex flex-col items-start justify-center mt-8">
      <Card className="w-full mt-8">
        {articleId ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Article Statistics
              </CardTitle>
              <CardDescription className="p-0">
                <div className="flex justify-center gap-4">
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
            <CardContent className="grid grid-cols-2 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 p-6">
                  <Hash />
                  <div>
                    <CardTitle>Number of Orders</CardTitle>
                    <CardDescription className="text-xl">
                      {
                        extractArticleStatistics(
                          fetchedArticleStatistics,
                          Number(articleId)
                        ).ordered_quantity
                      }
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
                      {typeof extractArticleStatistics(
                        fetchedArticleStatistics,
                        Number(articleId)
                      ).article_revenue === "number"
                        ? `${
                            extractArticleStatistics(
                              fetchedArticleStatistics,
                              Number(articleId)
                            ).article_revenue
                          } €`
                        : extractArticleStatistics(
                            fetchedArticleStatistics,
                            Number(articleId)
                          ).article_revenue}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </CardContent>
          </>
        ) : (
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Click on Article to view Statistics
            </CardTitle>
          </CardHeader>
        )}
      </Card>
    </div>
  );
};
