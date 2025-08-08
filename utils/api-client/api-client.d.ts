import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export declare class AxiosApiClient {
    private _client;
    constructor(
    /** the base url of the api. We suggest each api to have it's own client */
    baseURL: string, 
    /** the api timeout duration. Default 15000ms */
    timeout?: number, 
    /**
     * Default:
     * 	 "Content-Type": "application/json",
     * 	 "Accept": "application/json",
     */
    headers?: {
        "Content-Type": string;
        Accept: string;
    }, 
    /** Specify if cross-site Access-Control requests should be
     *  made using credentials such as cookies, authorization headers
     *  or TLS client certificates
     */
    withCredentials?: boolean, config?: AxiosRequestConfig);
    /**
     *
     * @param path the path of the endpoint
     * @param config AxiosRequestConfig. For simple usage with params, just wrap it in an object (e.g. { params })
     */
    get<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    /**
     * Gets response along with the full schema
     * @param path the path of the endpoint
     * @param config AxiosRequestConfig. For simple usage with params, just wrap it in an object (e.g. { params })
     */
    getFull<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    /**
     *
     * @param path the path of the endpoint
     * @param payload the data of the POST request
     * @param config AxiosRequestConfig
     */
    post<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     *
     * @param path the path of the endpoint
     * @param payload the data of the PUT request
     * @param config AxiosRequestConfig
     */
    put<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     *
     * @param path the path of the endpoint
     * @param payload the data of the PATCH request
     * @param config AxiosRequestConfig
     */
    patch<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T>;
    /**
     *
     * @param path the path of the endpoint
     * @param config AxiosRequestConfig
     */
    delete<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
    getClient(): AxiosInstance;
    private _handleSuccess;
    private _handleError;
}
