import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnBoardingPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import GroupsPage from "./pages/GroupsPage.jsx";
import GroupChatPage from "./pages/GroupChatPage.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import { useThemeStore } from "./store/useThemeStore.js";
import Layout from "./components/Layout.jsx";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-base-100 text-5xl" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            <Layout showSidebar={true}>
              {isAuthenticated && isOnboarded ? (
                <FriendsPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout showSidebar={true}>
              {isAuthenticated && isOnboarded ? (
                <SearchPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}
            </Layout>
          }
        />
        <Route
          path="/notifications"
          element={
            <Layout showSidebar={true}>
              {isAuthenticated && isOnboarded ? (
                <NotificationsPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout showSidebar={true}>
              {isAuthenticated && isOnboarded ? (
                <ProfilePage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}
            </Layout>
          }
        />
        <Route
          path="/groups"
          element={
            <Layout showSidebar={true}>
              {isAuthenticated && isOnboarded ? (
                <GroupsPage />
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )}
            </Layout>
          }
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/group-chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <GroupChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
      </Routes>
      <Toaster 
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '8px 12px',
            minHeight: '40px'
          }
        }}
      />
    </div>
  );
};
export default App;
