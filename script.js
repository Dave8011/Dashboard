
// This script processes local CSV files in the repo (manually uploaded) and applies Excel-like logic

// Load all CSVs on page load
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch('business.csv').then(res => res.text()),
    fetch('ads.csv').then(res => res.text()),
    fetch('mpsku.csv').then(res => res.text()),
    fetch('rack.csv').then(res => res.text())
  ]).then(([businessText, adsText, mpskuText, rackText]) => {
    const businessData = parseCSV(businessText);
    const adsData = parseCSV(adsText);
    const mpskuData = parseCSV(mpskuText);
    const rackData = parseCSV(rackText);
    window.dashboardData = combineData(businessData, adsData, mpskuData, rackData);
    renderTable(window.dashboardData);
  });
});

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, key, i) => {
      obj[key.trim()] = values[i]?.trim();
      return obj;
    }, {});
  });
  return data;
}

function combineData(business, ads, mpsku, rack) {
  return business.map(row => {
    const asin = row["(Child) ASIN"];
    const skuMap = mpsku.find(m => m.ASIN === asin) || {};
    const adRow = ads.find(a => a.ASIN === asin) || {};
    const sku = skuMap.SKU || "N/A";

    const mainSku = skuMap.MainSku || "";
    const brand = skuMap.Brand || "";
    const title = row.Title || skuMap.Product || "N/A";

    const sales = parseINR(adRow["Sales(INR)"]);
    const spend = parseINR(adRow["Spend(INR)"]);
    const tacos = calculateTACOS(sales, parseINR(row["Ordered Product Sales"]));
    const groupSales = row["Ordered Product Sales"] || "0";
    const groupSpend = spend;

    const stockQty = rack
      .filter(r => r.SKU === sku)
      .reduce((sum, r) => sum + parseInt(r.Quantity || "0", 10), 0);

    return {
      "MAIN SKU": mainSku,
      "(Parent) SKU": skuMap.MPsku || "",
      "(Child) ASIN": asin,
      "Title": title,
      "Sessions - Total": row["Sessions - Total"] || "",
      "Page Views - Total": row["Page Views - Total"] || "",
      "Featured Offer Percentage": row["Featured Offer Percentage"] || "",
      "Units Ordered": row["Units Ordered"] || "",
      "Unit Session Percentage": row["Unit Session Percentage"] || "",
      "Ordered Product Sales": row["Ordered Product Sales"] || "",
      "Total Order Items": row["Total Order Items"] || "",
      "Total Group Sale": groupSales,
      "Sales(INR)": adRow["Sales(INR)"] || "",
      "ROAS": adRow["ROAS"] || "",
      "Conversion rate": adRow["Conversion rate"] || "",
      "Impressions": adRow["Impressions"] || "",
      "Clicks": adRow["Clicks"] || "",
      "CTR": adRow["CTR"] || "",
      "Spend(INR)": adRow["Spend(INR)"] || "",
      "CPC(INR)": adRow["CPC(INR)"] || "",
      "Orders": adRow["Orders"] || "",
      "ACOS": adRow["ACOS"] || "",
      "TACOS": tacos.toFixed(2) + "%",
      "Total Group ADS Spend": groupSpend,
      "Group TACOS": ((groupSpend / parseINR(groupSales)) * 100).toFixed(2) + "%",
      "Brand Name": brand,
      "Sku qty": stockQty
    };
  });
}

function parseINR(str) {
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d.]/g, "")) || 0;
}

function calculateTACOS(spend, sales) {
  return sales ? (spend / sales) * 100 : 0;
}

function renderTable(data) {
  const header = document.getElementById("dashboardHeader");
  const body = document.getElementById("dashboardBody");
  if (data.length === 0) return;

  const columns = Object.keys(data[0]);
  header.innerHTML = columns.map(c => `<th>${c}</th>`).join("");
  body.innerHTML = data.map(row =>
    `<tr>${columns.map(col => `<td>${row[col]}</td>`).join("")}</tr>`
  ).join("");
}

function applyFilters() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const brand = document.getElementById("brandFilter").value.toLowerCase();
  const sku = document.getElementById("skuFilter").value.toLowerCase();
  const asin = document.getElementById("asinFilter").value.toLowerCase();
  const title = document.getElementById("titleFilter").value.toLowerCase();

  const filtered = window.dashboardData.filter(row => {
    const rowDate = row.Date || "2000-01-01";
    return (!from || rowDate >= from) &&
           (!to || rowDate <= to) &&
           (!brand || row["Brand Name"].toLowerCase().includes(brand)) &&
           (!sku || row["MAIN SKU"].toLowerCase().includes(sku)) &&
           (!asin || row["(Child) ASIN"].toLowerCase().includes(asin)) &&
           (!title || row["Title"].toLowerCase().includes(title));
  });

  renderTable(filtered);
}
