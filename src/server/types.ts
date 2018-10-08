export type ServerConfig = {
	/**
	 * where server should listen
	 */
	port: number;
	/**
	 * distribution/public folder to serve
	 */
	dist: string;
	/**
	 * rendered page cache time to live
	 */
	ttl: number;
};
