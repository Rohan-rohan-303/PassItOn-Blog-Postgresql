import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import { 
  RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogByCategory, 
  RouteBlogDetails, RouteBlogEdit, RouteCategoryDetails, RouteCommentDetails, 
  RouteEditCategory, RouteIndex, RouteProfile, RouteSearch, 
  RouteSignIn, RouteSignUp, RouteUser 
} from './utility/RouteName';

import Index from './pages/Index';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import AddCategory from './pages/Category/AddCategory';
import CategoryDetails from './pages/Category/CategoryDetails';
import EditCategory from './pages/Category/EditCategory';
import AddBlog from './pages/Blog/AddBlog';
import BlogDetails from './pages/Blog/BlogDetails';
import EditBlog from './pages/Blog/EditBlog';
import SingleBlogDetails from './pages/SingleBlogDetails';
import BlogByCategory from './pages/Blog/BlogByCategory';
import SearchResult from './pages/SearchResult';
import Comments from './pages/Comments';
import User from './pages/User';

import AuthRouteProtechtion from './components/AuthRouteProtection';
import OnlyAdminAllowed from './components/OnlyAdminAllowed';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Parent Route */}
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />} />

          {/* Public Routes */}
          <Route path={RouteBlogDetails()} element={<SingleBlogDetails />} />
          <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
          <Route path={RouteSearch()} element={<SearchResult />} />

          {/* Protected Routes (Logged In) */}
          <Route element={<AuthRouteProtechtion />}>
            {/* DEBUG TIP: Ensure RouteProfile is exactly "/profile". 
               If RouteIndex is "/", this nested path should be "profile" or "/profile"
            */}
            <Route path={RouteProfile} element={<Profile />} />
            <Route path={RouteBlogAdd} element={<AddBlog />} />
            <Route path={RouteBlog} element={<BlogDetails />} />
            <Route path={RouteBlogEdit()} element={<EditBlog />} />
            <Route path={RouteCommentDetails} element={<Comments />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<OnlyAdminAllowed />}>
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} />
            <Route path={RouteUser} element={<User />} />
          </Route>
        </Route>

        {/* Auth Routes (Outside Layout) */}
        <Route path={RouteSignIn} element={<SignIn />} />
        <Route path={RouteSignUp} element={<SignUp />} />

        {/* Catch-all route to prevent the console warning */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;