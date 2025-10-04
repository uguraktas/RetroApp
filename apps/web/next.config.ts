import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typedRoutes: true,
	transpilePackages: ["shiki", "@repo/config", "@repo/i18n"],
};

export default withNextIntl(nextConfig);
