import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Private Chat
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stateless. Secure. Simple.
          </p>
        </div>
        <ChatInterface />
      </div>
    </main>
  );
}
