const colorClassMap: Record<string, string> = {
  blue: "border-blue-300 from-blue-300 to-blue-700",
  red: "border-red-300 from-red-300 to-red-700 to-65%",
  green: "border-green-300 from-green-400 to-green-700",
  yellow: "border-yellow-300 from-yellow-400 to-yellow-700",
  black: "border-gray-700 from-gray-700 to-black",
  white: "border-gray-300 from-white to-gray-200",
  gray: "border-gray-400 from-gray-400 to-gray-700",
  silver: "border-gray-400 from-gray-300 to-gray-500",
};

export default function PaintIcon({ color }: { color: string }) {
  const gradient =
    colorClassMap[color.toLowerCase()] || "from-gray-400 to-gray-700";
  return (
    <div
      className={`size-4 rounded-full border bg-radial-[at_40%_15%] ${gradient} `}
    ></div>
  );
};
