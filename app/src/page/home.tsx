import { useEffect, useState } from "react";
import { useNavigate, useLoaderData } from "react-router";
import type { LoaderFunction } from "react-router";
import { api } from "../core/api";

// 1. Loader untuk mengambil data statistik dari endpoint Map kustom kamu
export const loader: LoaderFunction = async () => {
  try {
    const response = await api.get("/api/questions/stats");
    return response.data;
  } catch (error) {
    console.error("Gagal memuat statistik forum:", error);
    return {
      totalQuestions: 0,
      totalMembers: 0,
      totalAnswers: 0,
    };
  }
};

export const Component = () => {
  const serverStats = useLoaderData() as any;
  const navigate = useNavigate();

  // Susun struktur data agar sesuai dengan pemetaan UI kamu
  const stats = [
    { label: "Total Questions", count: serverStats?.totalQuestions ?? 0 },
    { label: "Active Members", count: serverStats?.totalMembers ?? 0 },
    { label: "Total Answers", count: serverStats?.totalAnswers ?? 0 },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-stone-50 font-sans antialiased text-stone-800">
      
      {/* Hero / Welcome Section */}
      <section className="bg-white border-b border-stone-200 px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <span className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
            Welcome to Mardira Forums
          </span>
          <h1 className="mt-3 text-3xl font-normal tracking-tight text-stone-900">
            Tempat diskusi, berbagi solusi, dan berkembang bersama komunitas developer.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            Cari jawaban atas kendala eror kode kamu, bantu sesama mahasiswa menyelesaikan masalah pemrograman, atau jelajahi topik hangat seputar teknologi di sini.
          </p>
          
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => navigate("/questions")}
              className="cursor-pointer rounded border border-stone-900 bg-stone-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800"
            >
              Jelajahi Pertanyaan
            </button>
            <button
              onClick={() => navigate("/questions/ask")} // Sesuaikan rute ask question kamu
              className="cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              Ajukan Pertanyaan
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-md border border-stone-200 bg-white p-6 grid grid-cols-3 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1 border-r border-stone-100 last:border-r-0">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-mono">
                {stat.label}
              </span>
              <span className="text-xl font-mono font-semibold text-stone-800">
                {Number(stat.count).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
};