import CandlestickChart from "./CandlestickChart";
function StockDetailsModal({ stock, closeModal }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-card-bg p-8 rounded-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{stock.symbol}</h2>

          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-gray-400">Company</p>

            <h3 className="text-xl font-bold">{stock.companyName}</h3>
          </div>

          <div>
            <p className="text-gray-400">Current Price</p>

            <h3 className="text-2xl font-bold">${stock.price}</h3>
          </div>

          <div>
            <p className="text-gray-400">Market Cap</p>

            <h3 className="text-xl font-bold">
              {stock.marketCap?.toLocaleString()}
            </h3>
          </div>

          <div>
            <p className="text-gray-400">PE Ratio</p>

            <h3 className="text-xl font-bold">{stock.peRatio}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">52 Week High</p>

              <h3 className="text-green-400 font-bold">${stock.high52Week}</h3>
            </div>

            <div>
              <p className="text-gray-400">52 Week Low</p>

              <h3 className="text-red-400 font-bold">${stock.low52Week}</h3>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Price Chart</h3>

            <CandlestickChart symbol={stock.symbol} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDetailsModal;
