
---

## 🔧 How It Works

- **Static Frontend** hosted via Vercel or any static site service
- **CSV Backend** stored in the same GitHub repo
  - `ads.csv` and `business.csv` support cumulative data (append rows)
  - `mpsku.csv` and `rack.csv` should be replaced entirely when updated

---

## 📑 Data Filters Available

- `Date`
- `Brand`
- `SKU`
- `ASIN`
- `Title`

All filters operate via simple HTML/JS — no backend required.

---

## 📤 How to Update Data

1. Open your GitHub repo
2. Replace or append to the CSV files:
   - `business.csv` (append daily)
   - `ads.csv` (append daily)
   - `mpsku.csv` (replace if mapping changes)
   - `rack.csv` (replace if stock changes)
3. Push changes — Vercel auto-rebuilds your dashboard

---

## 🚀 Deployment on Vercel

1. [Create a Vercel account](https://vercel.com)
2. Link your GitHub repo
3. Select the repo containing this dashboard
4. Vercel auto-deploys on every commit

---

## 🧠 Formula Logic

All calculations follow Excel-style formulas, directly mapped into JS for transparency and easier debugging. Look inside `script.js` for full details.

---

## 📌 Future Enhancements (Ideas)

- Drag-and-drop CSV uploader (optional)
- Date range picker
- Export filtered view
- Merge reports server-side (Node.js)

---

## 📬 Feedback & Contributions

Feel free to raise issues or submit pull requests if you'd like to enhance or expand this dashboard!

---
