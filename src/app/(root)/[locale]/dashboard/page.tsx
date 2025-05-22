import { getAuthUser } from "@/actions/user.action";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import { notFound } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const authUser = await getAuthUser();
  if (!authUser || authUser.role === "CUSTOMER" || authUser.role === "STAFF")
    return notFound();
  if (authUser.role === "ADMIN") return <AdminDashboard />;
  return <OwnerDashboard />;
};

export default Dashboard;
