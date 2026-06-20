import { data, Link, redirect, useFetcher, type ActionFunction } from "react-router";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../core/api";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  console.log(username);
  
  try {
    const response = await api.post("/api/auth/login", {
      username,
      password,
    });
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return redirect("/questions");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Login gagal, silakan coba lagi.";
    return data(
      { error: errorMessage },
      { status: error.response?.status || 400 },
    );
  }
};
export function Component() {
  const fetcher = useFetcher();

  return (
    <div className="mt-8">
      <div className="max-w-xs mx-auto">
        <div className="flex items-center flex-col justify-center mb-10">
          <h2 className="text-2xl">Mardira Forums</h2>
          <p className="text-sm">Ruang diskusi mahasiswa</p>
        </div>
        <div className="shadow-sm rounded-lg bg-white ">
          <fetcher.Form
            action=""
            method="POST"
            className="p-10 flex flex-col gap-4"
          >
            <Input placeholder="Username" name="username" />
            <Input placeholder="Password" name="password" />
            <Button type="submit" name="login">Login</Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Sudah punya akun?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Login disini
              </Link>
            </p>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}
