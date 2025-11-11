const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // 👇 disables the new Route Toolbar completely
    nextScriptWorkers: false,
    typedRoutes: false,
    webpackBuildWorker: false,
    appIsrStatus: false,
    toolbar: {
      runOnDev: false,
      runOnBuild: false,
    },
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

export default nextConfig;
