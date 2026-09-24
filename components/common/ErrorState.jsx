export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-lg border bg-white p-8 text-center">
      <h3 className="font-semibold text-gray-900">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-4 rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Retry
      </button>
    </div>
  );
}