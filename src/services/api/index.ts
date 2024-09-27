import httpClient from "./httpClient";

/**
 * Get the content api domain from the env file
 * append the api path to get the final url
 * update the domain in the .env file in case of any changes
 */
const domain = process.env.NEXT_PUBLIC_CONTENT_API as string;
const url = `${domain}umbraco/delivery/api/v2/content/item`;

/**
 * Fetch content from the content api
 * revalidate the content in every 60 seconds
 *
 * @param path - content path or slug
 * @returns - the data json from response
 * @returns - null if error
 */
export const fetchContent = async (path: string) => {
  try {
    // validate the slug names
    // next will try to run it with some file names
    const regex =
      /^(?!.*\.(ico|png|jpg|jpeg|gif|svg)$)([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)?(\/[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)*(\?.*)?$/;

    const isValidSlug = regex.test(path);

    // return null if the slug is not valid
    if (!isValidSlug) return null;

    return httpClient.get(`${url}/${path}`, { next: { revalidate: 60 } });
    // , { next: { revalidate: 1 } } // add it later
  } catch (e) {
    console.log("Err");
    return null;
  }
};
