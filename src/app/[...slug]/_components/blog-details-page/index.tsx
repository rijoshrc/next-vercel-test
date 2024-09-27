import Image from "next/image";
import Link from "next/link";
import { Blog } from "../blog-list-page/_type";

interface RelatedBlog {
  title: string;
  author: string;
  authorUrl: string;
  date: string;
  category: string;
  summary: string;
  url: string;
  categoryUrl: string;
  image: { imageUrl: string; altText: string };
}

interface Properties {
  mainText: {
    markup: string;
  };
}

interface Props {
  data: {
    blog: Blog;
    relatedBlogs: RelatedBlog[];
    relatedArticlesHeading: string;
    properties: Properties;
  };
}

const BlogDetailsPage: React.FC<Props> = ({ data }) => {
  const { blog, relatedBlogs, relatedArticlesHeading, properties } = data;

  return (
    <div>
      {/* Hero Image Section */}
      {blog.image && (
        <section className="section__hero">
          <div
            className="hero__wrapper"
            style={{ backgroundImage: `url(${blog.image.imageUrl})` }}
          >
            <div className="container"></div>
          </div>
        </section>
      )}

      {/* Static Text Section */}
      <section className="section__article">
        <div className="container">
          <div className="row no-gutters">
            <div className="section__article--content">
              <h1 className="heading">{blog.title}</h1>
              <div className="content--date">
                {blog.author && (
                  <span className="date">
                    <Link href={blog.authorUrl} title={blog.author}>
                      {blog.author}
                    </Link>{" "}
                    &nbsp;|&nbsp;
                  </span>
                )}
                <span className="date">{blog.date} &nbsp;|&nbsp;</span>
                <span className="category">
                  <Link href={blog.categoryUrl} title={blog.title}>
                    {blog.category}
                  </Link>
                </span>
              </div>

              {/* Render the main content */}
              <div
                dangerouslySetInnerHTML={{ __html: properties.mainText.markup }}
              />

              {/* Button Section */}
              {blog.button && (
                <Link
                  href={blog.button.url}
                  className="button"
                  target={blog.button.target}
                  title={blog.button.name}
                >
                  {blog.button.name}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className="section__blog section__blog--3 section--grey">
          <div className="container">
            <div className="row">
              <div className="blog__header">
                <h2 className="font-quatro s-32px">{relatedArticlesHeading}</h2>
              </div>
              <ul className="blog__lists">
                {relatedBlogs.slice(0, 3).map((relatedBlog, index) => (
                  <li key={relatedBlog.url} className="blog__item">
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
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailsPage;
