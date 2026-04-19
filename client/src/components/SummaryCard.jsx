function SummaryCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-6 flex-1 shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-gray-400 text-sm font-medium">
          {title}
        </h4>
        {Icon && <Icon className="text-gray-500 w-5 h-5" />}
      </div>
      <p className="text-3xl font-bold text-white mb-2">
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          {subtext}
        </p>
      )}
    </div>
  );
}

export default SummaryCard;