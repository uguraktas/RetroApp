import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

const nextConfig: NextConfig = {
	typedRoutes: true,
	transpilePackages: ["shiki", "@repo/config", "@repo/i18n"],
};

export default withNextIntl(withMDX(nextConfig));
