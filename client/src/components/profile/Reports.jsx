import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Reports() {

  const { token } = useAuth();

  const handleDownloadReport = async () => {

    try {

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/reports/portfolio-report`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to download report"
        );

      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "portfolio-report.pdf";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      toast.success(
        "Portfolio report downloaded"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to download report"
      );

    }

  };

  return (

    <div className="bg-[var(--color-card-bg)] border border-gray-800 rounded-xl p-8">

      <h2 className="text-3xl font-bold mb-6">
        Reports
      </h2>

      <button
        onClick={handleDownloadReport}
        className="px-5 py-3 rounded-lg bg-brand text-black font-semibold"
      >
        Download Portfolio Report
      </button>

    </div>

  );

}

export default Reports;