export interface Route {
  path: string;
  startItem: {
    id: string;
    path: string;
  };
}

export interface Nav {
  url: string | null;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string;
  destinationType: string;
  route: Route;
  linkType: string;
  level: number;
  children: Nav[] | null;
}
