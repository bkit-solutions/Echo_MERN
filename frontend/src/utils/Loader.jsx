import { Oval } from "react-loader-spinner";

export function Loader({ label = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Oval
        visible
        height={56}
        width={56}
        color="#2563eb"        // blue-600 (brand)
        secondaryColor="#93c5fd" // blue-300
        ariaLabel="loading"
      />

      <p className="mt-4 text-sm text-slate-600 font-medium">
        {label}
      </p>
    </div>
  );
}
