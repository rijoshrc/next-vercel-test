export interface Link {
  url?: string;
  queryString?: string;
  title: string;
  target: string;
  destinationId: string;
  destinationType: string;
  name?: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  linkType: string;
}
