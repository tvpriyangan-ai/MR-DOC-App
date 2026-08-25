// Purchase sidebar: load, add, edit, delete

const purchaseForm = document.getElementById('purchaseForm');
const purchaseList = document.getElementById('purchaseList');

async function loadPurchases() {
  const purchases = await api.get('/purchases');
  purchaseList.innerHTML = '';
  purchases.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${p.name} - ${p.amount} (${new Date(p.date).toLocaleDateString()})</span>
      <span>
        <button class="btn-red" onclick="deletePurchase('${p._id}')">Delete</button>
      </span>`;
    purchaseList.appendChild(li);
  });
}

async function deletePurchase(id) {
  await api.delete(`/purchases/${id}`);
  loadPurchases();
}

if (purchaseForm) {
  purchaseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('purchaseName').value;
    const date = document.getElementById('purchaseDate').value;
    const amount = Number(document.getElementById('purchaseAmount').value);

    await api.post('/purchases', { name, date, amount });
    purchaseForm.reset();
    loadPurchases();
  });

  loadPurchases();
}
