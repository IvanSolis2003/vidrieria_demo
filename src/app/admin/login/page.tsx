import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Ingresar — Panel Vidriería Demo",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");
  return <LoginForm />;
}
