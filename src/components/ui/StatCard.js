export default function StatCard({ title, value }) {
  return (
    <div className="bg-lYellow p-6 rounded-xl shadow-sm border text-black">
      <p className="font-medium text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
