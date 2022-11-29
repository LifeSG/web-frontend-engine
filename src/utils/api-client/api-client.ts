// NOTE: Copied from web-common/utils
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const DEFAULT_PARAMS = {
	timeout: 15000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
};

export class AxiosApiClient {
	private _client: AxiosInstance;

	public constructor(
		/** the base url of the api. We suggest each api to have it's own client */
		baseURL: string,
		/** the api timeout duration. Default 15000ms */
		timeout = DEFAULT_PARAMS.timeout,
		/**
		 * Default:
		 * 	 "Content-Type": "application/json",
		 * 	 "Accept": "application/json",
		 */
		headers = DEFAULT_PARAMS.headers,
		/** Specify if cross-site Access-Control requests should be
		 *  made using credentials such as cookies, authorization headers
		 *  or TLS client certificates
		 */
		withCredentials?: boolean,
		config?: AxiosRequestConfig
	) {
		const client = axios.create({
			baseURL,
			timeout,
			headers: { ...headers },
			withCredentials,
			...config,
		});

		client.interceptors.response.use(this._handleSuccess, this._handleError);
		this._client = client;
	}

	/**
	 *
	 * @param path the path of the endpoint
	 * @param config AxiosRequestConfig. For simple usage with params, just wrap it in an object (e.g. { params })
	 */
	public async get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this._client.get(path, config);
		return response.data;
	}
	/**
	 * Gets response along with the full schema
	 * @param path the path of the endpoint
	 * @param config AxiosRequestConfig. For simple usage with params, just wrap it in an object (e.g. { params })
	 */
	public async getFull<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		const response = await this._client.get(path, config);
		return response;
	}

	/**
	 *
	 * @param path the path of the endpoint
	 * @param payload the data of the POST request
	 * @param config AxiosRequestConfig
	 */
	public async post<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this._client.post(path, payload, config);
		return response.data;
	}

	/**
	 *
	 * @param path the path of the endpoint
	 * @param payload the data of the PUT request
	 * @param config AxiosRequestConfig
	 */
	public async put<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this._client.put(path, payload, config);
		return response.data;
	}

	/**
	 *
	 * @param path the path of the endpoint
	 * @param payload the data of the PATCH request
	 * @param config AxiosRequestConfig
	 */
	public async patch<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this._client.patch(path, payload, config);
		return response.data;
	}

	/**
	 *
	 * @param path the path of the endpoint
	 * @param config AxiosRequestConfig
	 */
	public async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this._client.delete(path, config);
		return response.data;
	}

	public getClient(): AxiosInstance {
		return this._client;
	}

	private _handleSuccess(response: AxiosResponse) {
		return response;
	}

	private _handleError(error: any) {
		if (error.code === "ECONNABORTED") {
			return Promise.reject("timeout");
		}
		return Promise.reject({ ...error.response.data, httpStatus: error.response.status });
	}
}
