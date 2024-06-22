import { Spin } from "antd";
import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";

const Loading = () => {
  return (
      <div className="loadingContainer">
        <Spin tip="loading..." wrapperClassName="loadingMain" delay="50000">
          <p></p>
        </Spin>
      </div>
  );
};

const routes = [
  {
    path: "/",
    exact: true,
    auth: true,
    component: lazy(() => import("./../pages/home")),
  },
  {
    path: "/home",
    auth: true,
    component: lazy(() => import("./../pages/home")),
  },
  {
    path: "/petition/:petitionId",
    auth: false,
    component: lazy(() => import("./../pages/petition")),
  },
  {
    path: "/test",
    auth: false,
    component: lazy(() => import("./../pages/test")),
  },
  {
    path: "/create",
    auth: false,
    component: lazy(() => import("./../pages/petition/create.jsx")),
  },
  {
    path: "/edit/:id",
    auth: false,
    component: lazy(() => import("./../pages/petition/edit.jsx")),
  },
  {
    path: "/mine",
    auth: false,
    component: lazy(() => import("./../pages/petition/mine.jsx")),
  },
  {
    path: "/profile",
    auth: false,
    component: lazy(() => import("./../pages/petition/profile.jsx")),
  },
];

const generateRouter = (routes) => {
  routes.map((item) => {
    if (item.children) item.children = generateRouter(item.children);
    item.element = (
      <Suspense fallback={<Loading />}>
        <item.component />
      </Suspense>
    );
  });

  return routes;
};

const Router = () => useRoutes(generateRouter(routes));

const checkAuth = (routes, path) => {
  for (const item of routes) {
    if (item.path === path) return item;

    if (item.children) {
      const res = checkAuth(item.children, path);
      if (res) return res;
    }
  }

  return null;
};

const checkRouterAuth = (path) => {
  let auth = null;
  auth = checkAuth(routes, path);
  return auth;
};

export { Router, checkRouterAuth };

