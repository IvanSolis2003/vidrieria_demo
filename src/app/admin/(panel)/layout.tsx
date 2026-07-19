import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import { auth } from "@/auth";
import AdminNav from "./AdminNav";

export const metadata = {
  title: "Panel — Imperio",
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <AdminNav />
      <Box component="main">{children}</Box>
    </Box>
  );
}
