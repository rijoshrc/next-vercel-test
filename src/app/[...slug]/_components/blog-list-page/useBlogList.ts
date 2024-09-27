import contentApi from "@/constants/contentApi";
import httpClient from "@/services/api/httpClient";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Blog } from "./_type";

const CURRENT_PAGE = "1";
const ITEMS_PER_PAGE = 10;

const useBlogList = () => {
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page") || CURRENT_PAGE;
    const category = searchParams.get("category") || "information";

    fetchData(page, category);
  }, [searchParams]);

  const fetchData = async (page: string, category: string) => {
    try {
      setLoading(true);
      const resp = await httpClient.get(
        `${contentApi.blogList}?CurrentPage=${page}&ItemsPerPage=${ITEMS_PER_PAGE}&Category=${category}`,
        {
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json;charset=UTF-8",
          },
          mode: "no-cors",
        }
      );

      const blogs = resp.articles as Blog[];
      setBlogList(blogs);
      setTotalItems(resp.totalItems);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return { blogList, loading, itemsPerPage: ITEMS_PER_PAGE, totalItems };
};

export default useBlogList;
