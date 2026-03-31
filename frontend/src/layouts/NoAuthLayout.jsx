import { Layout } from "antd";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const NoAuthLayout = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Outlet />
        </Layout>
    );
};

export default NoAuthLayout;