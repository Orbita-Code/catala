export default function Loading() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded-full" />
      <div className="w-32 h-8 bg-gray-200 rounded-xl" />
      <div className="w-48 h-4 bg-gray-200 rounded-lg" />
    </div>
  );
}
