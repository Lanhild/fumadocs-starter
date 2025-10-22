import { join } from "node:path";

const nextConfig: import("next").NextConfig = {
	reactStrictMode: true,
	output: "standalone",
	outputFileTracingRoot: join(__dirname, "../../"),
	poweredByHeader: false,
};

export default nextConfig;
