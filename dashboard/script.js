// JavaScript Logic

// In-memory store for uploaded data
const dataStore = {
    business: [],
    ads: [],
    mpsku: [],
    rack: []
};

// Helper to update brand filter dropdown
function updateBrandFilter() {
    const brands = [...new Set(dataStore.mpsku.map(row => row.Brand).filter(Boolean))];
    const select = document.getElementById('brandFilter');
    select.innerHTML = '<option value="">All Brands</option>';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        select.appendChild(option);
    });
}

// File upload listeners
document.getElementById('businessFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readCSVFile(file, 'business', true); // append
});

document.getElementById('adsFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readCSVFile(file, 'ads', true); // append
});

document.getElementById('mpskuFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readCSVFile(file, 'mpsku', false); // replace
});

document.getElementById('rackFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) readCSVFile(file, 'rack', false); // replace
});

// Generic file reader
function readCSVFile(file, type, append = false) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const parsed = parseCSV(e.target.result);

        if (append) {
            dataStore[type] = dataStore[type].concat(parsed);
        } else {
            dataStore[type] = parsed;
        }

        if (type === 'mpsku') updateBrandFilter();

        console.log(`Loaded ${parsed.length} rows for ${type}`);
        // You can trigger data refresh/render here
    };
    reader.readAsText(file);
}