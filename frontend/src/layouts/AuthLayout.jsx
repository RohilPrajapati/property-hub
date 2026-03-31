import { Layout } from "antd";
import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from '../helpers';
import Navbar from "../components/Navbar";

const AuthLayout = () => {
    return isAuthenticated() ? (
        <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Outlet />
        </Layout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default AuthLayout;