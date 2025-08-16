import createNextIntlPlugin from "next-intl/plugin";
import { NextConfig } from "next";

 
const nextConfig: NextConfig = {};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);