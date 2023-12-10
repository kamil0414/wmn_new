export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      <form className="mt-6 flex flex-col gap-y-2">
        <select
          disabled
          className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
        >
          <option>wybierz kategorię</option>
        </select>

        <button
          type="button"
          className="mt-2 inline-flex justify-center self-start rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-gray-300"
          disabled
        >
          Dodaj wydatek
        </button>
      </form>
    </div>
  );
}
