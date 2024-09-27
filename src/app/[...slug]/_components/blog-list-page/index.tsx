"use client";

import { getFontClassName, getFontSizeClassName, URLEncode } from "@/utils/fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { PaginationItem, Props } from "./_type";
import useBlogList from "./useBlogList";

const BlogListPage: React.FC<Props> = ({ data }) => {
  const {
    heading,
    headingFont,
    headingFontSize,
    headingFontColor,
    hideFeaturedSection,
  } = data.properties;

  const { blogCategories, featuredBlog } = data;

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") || "";
  const currentPage = searchParams.get("page") || "1";

  const { blogList, loading, itemsPerPage, totalItems } = useBlogList();

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let currentParams = {};
    searchParams.forEach((value, key) => {
      currentParams = { ...currentParams, [key]: value };
    });

    const updatedParams = {
      ...currentParams,
      page: "1",
      category: event.target.value,
    };

    updateQuery(updatedParams);
  };

  const handlePageClick = (page: number) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      let currentParams = {};
      searchParams.forEach((value, key) => {
        currentParams = { ...currentParams, [key]: value };
      });

      const updatedParams = {
        ...currentParams,
        page,
      };

      updateQuery(updatedParams);
    };
  };

  const updateQuery = (params: any) => {
    const newUrlParams = URLEncode(params).toString();
    const newUrl = `${pathname}?${newUrlParams}`;
    router.replace(newUrl);
  };

  const paginationItems = useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Generate pagination items
    const paginationItems: PaginationItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push({
        page: i,
        isActive: i === parseInt(currentPage),
      });
    }

    return paginationItems;
  }, [totalItems, itemsPerPage, currentPage]);

  return (
    <>
      {/* CAPTION SECTION */}
      <section className="section__caption section__caption--green">
        <div className="container">
          <div className="caption">
            <h1
              className={`heading ${getFontClassName(
                headingFont
              )} ${getFontSizeClassName(headingFontSize)}`}
              style={{ color: headingFontColor || "#fff" }}
            >
              {heading}
            </h1>
          </div>
        </div>
      </section>

      {/* FEATURED BLOG SECTION */}
      {!hideFeaturedSection && featuredBlog && (
        <section className="section__imagetext section__imagetext--flip section--grey">
          <div className="container">
            <div className="row">
              <div className="columns__wrapper">
                <div className="column">
                  <h6>{featuredBlog.title}</h6>
                  <div className="content__date">
                    <span className="date">
                      {featuredBlog.date} &nbsp;|&nbsp;
                    </span>
                    <span className="category">
                      <Link href="#" target="">
                        {featuredBlog.category}
                      </Link>
                    </span>
                  </div>
                  <p>{featuredBlog.summary}</p>
                  <Link
                    href={featuredBlog.url}
                    className="button button--link"
                    target=""
                  >
                    Artikel lesen
                  </Link>
                </div>
                <div className="column">
                  {featuredBlog.image && (
                    <picture>
                      <Image
                        src={featuredBlog.image.imageUrl}
                        alt="Blog Featured Big Image"
                        width={540}
                        height={360}
                        priority
                      />
                    </picture>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BLOG LIST SECTION */}
      <form id="blog" method="GET">
        <section className="section__blog section__blog--3">
          <div className="container">
            <div className="row">
              <span className="sortby">
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="" disabled>
                    Kategorie wählen
                  </option>
                  {blogCategories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                      selected={category.selected}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </span>

              <ul className="blog__lists">
                {blogList.map((blog) => (
                  <li key={blog.url} className="blog__item">
                    <div className="blog__item--wrapper">
                      {/* Blog image and link */}
                      <Link href={blog.url} title={blog.title}>
                        <div className="blog__image">
                          {blog.image && (
                            <picture>
                              <Image
                                src={blog.image.imageUrl}
                                alt={blog.image.altText}
                                height={185}
                                width={350}
                                priority
                                fetchPriority="high"
                              />
                            </picture>
                          )}
                        </div>
                      </Link>

                      {/* Blog content */}
                      <div className="blog__content">
                        <h3 className="font-quatro s-24px">{blog.title}</h3>
                        <div className="blog__content--date">
                          {/* Blog author */}
                          {blog.author && (
                            <span className="date">
                              <Link href={blog.authorUrl} target="">
                                {blog.author}
                              </Link>
                              &nbsp;|&nbsp;
                            </span>
                          )}

                          {/* Blog date */}
                          <span className="date">
                            {blog.date} &nbsp;|&nbsp;
                          </span>

                          {/* Blog category */}
                          <span className="category">
                            <Link href={blog.categoryUrl} target="">
                              {blog.category}
                            </Link>
                          </span>
                        </div>

                        {/* Blog summary */}
                        <p>{blog.summary}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* PAGINATION */}
              {paginationItems.length > 1 && (
                <div className="blog_pagination">
                  {paginationItems.map((paginationItem) =>
                    paginationItem.isActive ? (
                      <Link
                        key={paginationItem.page}
                        className="active"
                        href="#"
                      >
                        {paginationItem.page}
                      </Link>
                    ) : (
                      <Link
                        key={paginationItem.page}
                        href="#"
                        data-page={paginationItem.page}
                        className="page-item"
                        onClick={handlePageClick(paginationItem.page)}
                      >
                        {paginationItem.page}
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </form>
    </>
  );
};

export default BlogListPage;
