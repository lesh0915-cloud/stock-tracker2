const { useState, useMemo } = React;

const fmt = (n) => Number(n).toLocaleString("ko-KR");
const pct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const profitColor = (n) => n > 0 ? "#1D9E75" : n < 0 ? "#E24B4A" : "#888780";

const CARD_COLORS = [
  { bg: "#E6F1FB", border: "#378ADD", accent: "#185FA5", text: "#0C447C" },
  { bg: "#E1F5EE", border: "#1D9E75", accent: "#0F6E56", text: "#085041" },
  { bg: "#FAEEDA", border: "#BA7517", accent: "#854F0B", text: "#633806" },
  { bg: "#EEEDFE", border: "#7F77DD", accent: "#534AB7", text: "#3C3489" },
  { bg: "#FBEAF0", border: "#D4537E", accent: "#993556", text: "#72243E" },
  { bg: "#EAF3DE", border: "#639922", accent: "#3B6D11", text: "#27500A" },
];

const emptyForm = { name: "", qty: "", buyDate: "", buyPrice: "", sellDate: "", sellPrice: "" };

function App() {
  const [stocks, setStocks] = useState([
    { id: 1, name: "삼성전자", qty: 10, buyDate: "2024-01-15", buyPrice: 72000, sellDate: "2024-06-20", sellPrice: 82000 },
    { id: 2, name: "카카오", qty: 5, buyDate: "2024-03-01", buyPrice: 48000, sellDate: "", sellPrice: "" },
    { id: 3, name: "NAVER", qty: 3, buyDate: "2024-02-10", buyPrice: 195000, sellDate: "2024-08-05", sellPrice: 175000 },
  ]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("all");

  const calc = (s) => {
    const invest = s.qty * s.buyPrice;
    const sold = s.sellDate && s.sellPrice ? s.qty * Number(s.sellPrice) : null;
    const pnl = sold !== null ? sold - invest : null;
    const rate = pnl !== null ? (pnl / invest) * 100 : null;
    return { invest, sold, pnl, rate };
  };

  const summary = useMemo(() => {
    let totalInvest = 0, realizedPnl = 0;
    stocks.forEach(s => {
      const { invest, pnl } = calc(s);
      totalInvest += invest;
      if (pnl !== null) realizedPnl += pnl;
    });
    const overallRate = totalInvest > 0 ? (realizedPnl / totalInvest) * 100 : 0;
    return { totalInvest, realizedPnl, overallRate, count: stocks.length };
  }, [stocks]);

  const filtered = stocks.filter(s =>
    tab === "holding" ? !s.sellDate : tab === "sold" ? !!s.sellDate : true
  );

  const handleSubmit = () => {
    if (
