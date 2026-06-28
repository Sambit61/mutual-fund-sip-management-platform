import { useEffect, useState } from "react";
import api from "../api/api";

function Watchlist() {

  const [watchlist, setWatchlist] =
    useState([]);

  useEffect(() => {

    const fetchWatchlist =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await api.get(
              "/watchlist",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setWatchlist(
            res.data
          );

        } catch (err) {

          console.error(err);

        }

      };

    fetchWatchlist();

  }, []);

  return (

    <div className="min-h-screen p-8 text-white">

      <h1 className="text-4xl font-bold mb-8">
        My Watchlist
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {watchlist.map((item) => (

          <div
            key={item._id}
            className="
              bg-[var(--color-card-bg)]
              border border-gray-800
              p-6 rounded-xl
            "
          >

            <h2 className="text-2xl font-bold">
              {item.symbol}
            </h2>

            <p className="text-gray-400 mt-2">
              {item.type}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Watchlist;