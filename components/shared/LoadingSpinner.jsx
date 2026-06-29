export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-green-100 border-t-green-600 animate-spin"></div>
        {/* <div className="w-8 h-8 rounded-full border-4 border-green-50 border-t-green-400 animate-spin absolute top-2 left-2"></div> */}
      </div>
    </div>
  );
}