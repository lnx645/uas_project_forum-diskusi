import { Suspense } from "react";
import { Outlet, useLoaderData, Await, type LoaderFunction } from "react-router";
import { WebSocketProvider } from "../contexts/WebsocketContext";
import { Header } from "../components/Header";
import { Toaster } from "sonner";
import { userContext } from "../contexts/UserContextProvider";

export const rootLayoutLoader: LoaderFunction = ({ context }) => {
  const userPromise = context.get(userContext);
  
  return { userDeferred: userPromise };
};

export const RootLayout = () => {
  const { userDeferred } = useLoaderData<{ userDeferred: Promise<any> }>();
    
  return (
    <WebSocketProvider>
      <Toaster />
      <Suspense fallback={<div className="p-5 text-center">Loading Mardira Forums...</div>}>
        <Await resolve={userDeferred} errorElement={<div>Gagal memuat sesi data user.</div>}>
          {(resolvedUser) => (
            <>
              <Header user={resolvedUser} />
              <Outlet context={resolvedUser} />
            </>
          )}
        </Await>
      </Suspense>
    </WebSocketProvider>
  );
};