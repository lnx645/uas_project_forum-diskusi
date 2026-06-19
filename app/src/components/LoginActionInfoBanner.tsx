import { memo } from "react";
import { useNavigate } from "react-router";

export const LoginActionInfoBanner = memo(() => {
  const navigate = useNavigate();
  return (
    <div className="max-w-full mx-auto my-6 p-4 rounded-md border border-sky-200 bg-sky-50/50 text-stone-800 font-sans">
      <div className="flex gap-3 items-start">
        {/* Ikon Informasi (Info Icon) */}
        <span className="text-sky-600 font-bold text-lg leading-none select-none pt-0.5">
          ℹ
        </span>

        <div className="flex-1">
          <h4 className="text-[15px] font-semibold text-stone-900 leading-tight">
            Akses Terbatasi
          </h4>
          <p className="mt-1 text-[13px] text-stone-600 leading-normal">
            Anda belum masuk ke akun. Silakan login terlebih dahulu untuk dapat
            membuat pertanyaan atau memberikan jawaban di forum ini.
          </p>

          {/* Tombol Aksi Langsung */}
          <div className="mt-3">
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded transition-colors cursor-pointer"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
