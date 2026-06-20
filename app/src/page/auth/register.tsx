import { data, Link, redirect, useFetcher, type ActionFunction, type LoaderFunction } from "react-router";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

interface ActionData {
  error?: string;
  success?: boolean;
}

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !name || !email || !password) {
    return data({ error: "Semua field harus diisi!" }, { status: 400 });
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, name, email, password }),
    });

    const resData = await response.json();

    if (!response.ok) {
      return data(
        { error: resData.message || "Gagal mendaftarkan akun." },
        { status: response.status }
      );
    }

    // Karena menggunakan fetcher, redirect di client-side terkadang lebih aman,
    // namun jika React Router versi baru mendukungnya, Anda bisa langsung redirect.
    return redirect("/login");
  } catch (error) {
    return data(
      { error: "Tidak dapat terhubung ke server. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
};

export function Component() {
  const fetcher = useFetcher<ActionData>();
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="mt-8">
      <div className="max-w-xs mx-auto">
        {/* Header */}
        <div className="flex items-center flex-col justify-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-800">Mardira Forums</h2>
          <p className="text-sm text-gray-500">Daftar akun mahasiswa baru</p>
        </div>

        {/* Form Container */}
        <div className="shadow-sm rounded-lg bg-white border border-gray-100">
          <fetcher.Form method="POST" className="p-10 flex flex-col gap-4">
            
            {/* Tampilkan pesan error jika ada */}
            {actionData?.error && (
              <div className="p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200 text-center font-medium">
                {actionData.error}
              </div>
            )}

            <Input 
              placeholder="Nama Lengkap" 
              name="name" 
              type="text" 
              required 
            />
            
            <Input 
              placeholder="Username" 
              name="username" 
              type="text" 
              required 
            />

            <Input 
              placeholder="Email" 
              name="email" 
              type="email" 
              required 
            />

            <Input 
              placeholder="Password" 
              name="password" 
              type="password" 
              required 
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mendaftar..." : "Daftar Sekarang"}
            </Button>
            
            {/* Navigasi opsional kembali ke login */}
            <p className="text-xs text-center text-gray-500 mt-2">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login disini
              </Link>
            </p>
          </fetcher.Form>
        </div>
      </div>
    </div>
  );
}