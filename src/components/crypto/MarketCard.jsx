import { useState, useEffect } from "react";

function MarketCard() {
  const [activeTab, setActiveTab] = useState("new");
  const [coinsData, setCoinsData] = useState({
    all: [],
    gainers: [],
    new: []
  });
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all", label: "All crypto" },
    { id: "gainers", label: "Top gainers" },
    { id: "new", label: "New on Coinbase" },
  ];

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      try {
        const [tradableRes, gainersRes, newRes] = await Promise.all([
          fetch("/crypto"),
          fetch("/crypto/gainers"),
          fetch("/crypto/new")
        ]);

        const tradableData = await tradableRes.json();
        const gainersData = await gainersRes.json();
        const newData = await newRes.json();

        // Helper to format backend data
        const formatCoins = (coins) => {
          return coins.map((coin) => {
            const price = Number(coin.price ?? 0);
            const change24h = Number(coin.change24h ?? 0);

            return {
              name: coin.name,
              symbol: coin.symbol,
              price: `GHS ${price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              change:
                change24h === 0
                  ? "--"
                  : change24h > 0
                  ? `↗ ${change24h}%`
                  : `↙ ${Math.abs(change24h)}%`,
              logo: coin.image || coin.logo,
            };
          });
        };

        setCoinsData({
          all: tradableData.success ? formatCoins(tradableData.data).slice(0, 6) : [],
          gainers: gainersData.success ? formatCoins(gainersData.data).slice(0, 6) : [],
          new: newData.success ? formatCoins(newData.data).slice(0, 6) : []
        });
      } catch (error) {
        console.error("Failed to fetch crypto data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, []);

  const coins = coinsData[activeTab] || [];

  return (
    <div className="w-full max-w-[680px] rounded-[40px] bg-black px-10 py-9 text-white">
      {/* Tabs */}
      <div className="flex items-center gap-4 text-[18px] font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-6 py-3 transition ${
                isActive ? "bg-[#23262d] text-white" : "text-white hover:bg-[#181b20]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Coin list */}
      <div className="mt-10 space-y-7">
        {coins.map((coin) => {
          const isPositive = coin.change.includes("↗");
          const isNeutral = coin.change === "--";

          return (
            <div key={coin.name} className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <span className="text-[30px] font-normal tracking-[-0.04em]">
                  {coin.name}
                </span>
              </div>

              <div className="text-right">
                <p className="text-[22px] font-normal">{coin.price}</p>

                <p
                  className={`text-[17px] ${
                    isNeutral
                      ? "text-[#8b93a6]"
                      : isPositive
                      ? "text-[#16c784]"
                      : "text-[#ff4d5a]"
                  }`}
                >
                  {coin.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MarketCard;