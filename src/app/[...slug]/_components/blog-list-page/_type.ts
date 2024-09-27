export interface Blog {
  author: string;
  authorUrl: string;
  category: string;
  categoryUrl: string;
  date: string;
  image: {
    imageUrl: string;
    altText: string;
  };
  summary: string;
  title: string;
  url: string;
  valid: boolean;
  button?: { url: string; name: string; target: string };
}

export interface BlogCategory {
  value: string;
  name: string;
  selected: boolean;
}

export interface PaginationItem {
  page: number;
  isActive: boolean;
}

export interface Props {
  data: {
    contentType: string;
    nodeId: number;
    name: string;
    createDate: string;
    updateDate: string;
    route: {
      path: string;
      startItem: { id: string; path: string };
    };
    id: string;
    properties: {
      metaTitle: string;
      metaDescription: string;
      heading: string;
      headingFont: string;
      headingFontSize: string;
      headingFontColor?: string | null;
      blog?: Blog | null;
      hideFeaturedSection: boolean;
      relatedArticlesHeading: string;
    };
    blogCategories: BlogCategory[];
    featuredBlog: Blog;
  };
}
