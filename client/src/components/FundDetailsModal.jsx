import FundChart from "./FundChart";

function FundDetailsModal({ fund, closeModal }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

      <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold text-white">
              {fund.fundName}
            </h2>

            <p className="text-gray-400 mt-2">
              {fund.category}
            </p>
          </div>

          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-[var(--color-bg-main)] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">
              Current NAV
            </p>

            <h3 className="text-3xl font-bold text-green-400 mt-2">
              ₹{fund.nav}
            </h3>
          </div>

          <div className="bg-[var(--color-bg-main)] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">
              Category
            </p>

            <h3 className="text-xl font-bold mt-2">
              {fund.category}
            </h3>
          </div>

          <div className="bg-[var(--color-bg-main)] p-5 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm">
              AMFI Code
            </p>

            <h3 className="text-xl font-bold mt-2">
              {fund.amfiCode || "N/A"}
            </h3>
          </div>

        </div>

        {/* NAV Chart */}
        {fund.amfiCode && (
          <div className="bg-bg-main p-6 rounded-xl border border-gray-800">

            <h3 className="text-xl font-bold mb-6">
              Historical NAV
            </h3>

            <FundChart
              amfiCode={fund.amfiCode}
            />

          </div>
        )}

      </div>

    </div>
  );
}

export default FundDetailsModal;