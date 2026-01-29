export default function TemaLoading() {
  return (
    <div className="min-h-dvh flex flex-col animate-pulse">
      {/* Header skeleton */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="flex-1">
            <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-full h-2.5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 px-4 max-w-2xl mx-auto w-full">
        <div className="w-48 h-6 bg-gray-200 rounded-xl mb-4" />
        <div className="bg-gray-100 rounded-2xl p-5 space-y-3">
          <div className="w-full h-12 bg-gray-200 rounded-xl" />
          <div className="w-full h-12 bg-gray-200 rounded-xl" />
          <div className="w-full h-12 bg-gray-200 rounded-xl" />
          <div className="w-32 h-12 bg-gray-200 rounded-xl mx-auto" />
        </div>
      </div>
    </div>
  );
}
