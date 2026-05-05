import React, { useEffect, useRef, useState } from "react";

// Section Components
import ExploreHero from "../components/explore-sections/ExploreHero";
import MarketStats from "../components/explore-sections/MarketStats";
import CryptoPrices from "../components/explore-sections/CryptoPrices";
import ExploreCTA from "../components/explore-sections/ExploreCTA";
import ExploreSidebar from "../components/explore-sections/ExploreSidebar";
import TopMovers from "../components/explore-sections/TopMovers";
import NewOnCoinbase from "../components/explore-sections/NewOnCoinbase";

// Assets
import totalMarketCapChart from "../assets/images/total-market-cap.png";
import tradeVolumeChart from "../assets/images/trade-volume.png";
import buySellRatioChart from "../assets/images/buy-sell-ratio.png";
import btcDominanceChart from "../assets/images/btc-dominance.png";

// Daily Charts
import chart1 from "../assets/images/chart-1.png";
import chart2 from "../assets/images/chart-2.png";
import chart3 from "../assets/images/chart-3.png";
import chart4 from "../assets/images/chart-4.png";
import chart5 from "../assets/images/chart-5.png";
import chart6 from "../assets/images/chart-6.png";
import chart7 from "../assets/images/chart-7.png";
import chart8 from "../assets/images/chart-8.png";

const assetCharts = [chart1, chart2, chart3, chart4, chart5, chart6, chart7, chart8];

function Explore() {
  const topMoversRef = useRef(null);
  const newOnCoinbaseRef = useRef(null);
  const [coins, setCoins] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [newOnCoinbase, setNewOnCoinbase] = useState([]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 200;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const statsCards = [
    {
      title: "Total market cap",
      value: "GHS 23.97T",
      change: "↘ 1.35%",
      changeColor: "text-[#ea3943]",
      chart: totalMarketCapChart,
    },
    {
      title: "Trade volume",
      value: "GHS 1.27T",
      change: "↗ 18.33%",
      changeColor: "text-[#098551]",
      chart: tradeVolumeChart,
    },
    {
      title: "Buy-sell ratio",
      value: "GHS 0.76",
      change: "↘ 1.76%",
      changeColor: "text-[#ea3943]",
      chart: buySellRatioChart,
    },
    {
      title: "BTC dominance",
      value: "60.03%",
      change: "↘ 0.06%",
      changeColor: "text-[#ea3943]",
      chart: btcDominanceChart,
    },
  ];

  useEffect(() => {
    const formatPrice = (value) =>
      `GHS ${Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const formatPercent = (value) => {
      const change = Number(value ?? 0);
      if (change === 0) return "--";
      return change > 0 ? `↗ ${change}%` : `↘ ${Math.abs(change)}%`;
    };

    const fetchData = async () => {
      try {
        const [allRes, gainersRes, newRes] = await Promise.all([
          fetch("/crypto"),
          fetch("/crypto/gainers"),
          fetch("/crypto/new"),
        ]);

        const allData = await allRes.json();
        const gainersData = await gainersRes.json();
        const newData = await newRes.json();

        const allCoins = allData?.success ? allData.data : [];
        const gainersCoins = gainersData?.success ? gainersData.data : [];
        const newCoins = newData?.success ? newData.data : [];

        setCoins(
          allCoins.map((coin) => ({
            name: coin.name,
            symbol: coin.symbol,
            price: formatPrice(coin.price),
            change: formatPercent(coin.change24h),
            changeColor:
              Number(coin.change24h ?? 0) >= 0 ? "text-[#098551]" : "text-[#ea3943]",
            cap: "N/A",
            volume: "N/A",
            logo: coin.image || coin.logo,
          }))
        );

        setTopMovers(
          gainersCoins.slice(0, 10).map((coin) => ({
            symbol: coin.symbol,
            change: formatPercent(coin.change24h),
            price: formatPrice(coin.price),
            changeColor:
              Number(coin.change24h ?? 0) >= 0 ? "text-[#098551]" : "text-[#ea3943]",
            logoBg: "bg-[#1f2937]",
            logo: coin.image || coin.logo,
          }))
        );

        setNewOnCoinbase(
          newCoins.slice(0, 10).map((coin) => ({
            symbol: coin.symbol,
            name: coin.name,
            added: `Added ${new Date(coin.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}`,
            logoBg: "bg-[#1f2937]",
            logo: coin.image || coin.logo,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch explore crypto data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <section className="w-full">
        <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[minmax(0,1fr)_430px]">
          {/* LEFT MAIN AREA */}
          <div className="flex min-w-0 flex-col border-r border-[#e5e7eb]">
            <ExploreHero />
            <div className="border-t border-[#e5e7eb]" />
            <MarketStats statsCards={statsCards} />
            <div className="border-t border-[#e5e7eb]" />
            <CryptoPrices coins={coins} assetCharts={assetCharts} />
            <ExploreCTA />
          </div>

          {/* RIGHT SIDEBAR */}
          <ExploreSidebar>
            <TopMovers 
              topMovers={topMovers} 
              scrollRef={topMoversRef} 
              onScroll={scroll} 
            />
            <div className="border-t border-[#e5e7eb]" />
            <NewOnCoinbase 
              newOnCoinbase={newOnCoinbase} 
              scrollRef={newOnCoinbaseRef} 
              onScroll={scroll} 
            />
          </ExploreSidebar>
        </div>
      </section>
    </div>
  );
}

export default Explore;