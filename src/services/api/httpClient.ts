/**
 * Extend fetch options type
 * remove body and add it as any
 * convert the body content to string later
 */
type RequestOptions = Omit<RequestInit, "body"> & {
  body?: any;
};

type Header = {
  [key: string]: string;
};

/**
 * Whether to set auth header on each request
 */
const authHeader = false;

/**
 * Class to handle all the request types
 */
class HttpClient {
  /**
   * Http request method with all options
   * @param url api end point
   * @param options http request options
   * @returns either the response data or throws error
   */
  async request(url: string, options: RequestOptions = {}): Promise<any> {
    // get all the values
    const { method, headers, body } = options;

    // generate request options
    const requestOptions: RequestInit = {
      ...options,
      // if set request type to GET as default
      method: method || "GET",
      // set empty object if no headers provided
      headers: headers || {},
    };

    // if body exists
    if (body) {
      // convert to string and assign to body
      requestOptions.body = JSON.stringify(body);
      // update headers with the provided headers and default header
      requestOptions.headers = {
        ...requestOptions.headers,
        "Content-Type": "application/json",
      };
    }

    // if auth header need to send with each request
    // set this flag at the top of the file
    if (authHeader) {
      // get auth header
      const authHeader = getAuthHeader();
      // update the header with the auth header
      requestOptions.headers = {
        ...requestOptions.headers,
        ...authHeader,
      };
    }

    try {
      // send the fetch request
      const response = await fetch(url, requestOptions);

      // if error
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        console.log(
          "====================================================================="
        );
        console.log(url, requestOptions);
        console.log(
          "====================================================================="
        );
        // throw error
        throw new Error(`HTTP error! Status: ${response.status} | url: ${url}`);
      }

      // if no error, return json data
      return await response.json();
    } catch (error: any) {
      // Abort will throw error
      // if abort error handle it
      if (error.name === "AbortError") {
        console.log("Request aborted:", error.message);
        // Handle request cancellation
      } else {
        // throw error otherwise
        console.error("Request failed:", error.message);
        throw error;
      }
    }
  }

  /**
   * Get method
   * @param url api end point
   * @param options request options
   * @returns same as request method
   */
  async get(url: string, options: RequestOptions = {}): Promise<any> {
    return this.request(url, { ...options, method: "GET" });
  }

  /**
   * Post method
   * @param url api end point
   * @param options request options
   * @returns same as request method
   */
  async post(url: string, options: RequestOptions = {}): Promise<any> {
    return this.request(url, { ...options, method: "POST" });
  }

  /**
   * Put method
   * @param url api end point
   * @param options request options
   * @returns same as request method
   */
  async put(url: string, options: RequestOptions = {}): Promise<any> {
    return this.request(url, { ...options, method: "PUT" });
  }

  /**
   * Delete method
   * @param url api end point
   * @param options request options
   * @returns same as request method
   */
  async delete(url: string, options: RequestOptions = {}): Promise<any> {
    return this.request(url, { ...options, method: "DELETE" });
  }
}

const httpClient = new HttpClient();

export default httpClient;

/**
 * Get the auth header
 * TODO: Update the function by fetching actual token
 * @returns either the autherization header or empty object
 */
function getAuthHeader(): Header | {} {
  try {
    // return the auth header
    const token = "auth_token";
    return {
      Authorization: `Bearer ${token}`,
    };
  } catch (e) {
    // on error, return empty objects
    return {};
  }
}
