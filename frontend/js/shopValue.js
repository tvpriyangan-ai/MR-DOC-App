// Shop Total Value modal (admin only)

const shopValueBtn = document.getElementById('shopValueBtn');
const shopValueModal = document.getElementById('shopValueModal');
const shopValueForm = document.getElementById('shopValueForm');
const shopValueList = document.getElementById('shopValueList');

if (shopValueBtn) {
  shopValueBtn.addEventListener('click', () => {
    shopValueModal.classList.remove('hidden');
    loadShopValue();
  });
}

async function loadShopValue() {
  const items = await api.get('/shop-value');
  shopValueList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.categoryName} - count: ${item.count}, total: ${item.totalAmount}</span>
      <span><button onclick="deleteShopValue('${item._id}')">Delete</button></span>`;
    shopValueList.appendChild(li);
  });
}

async function deleteShopValue(id) {
  await api.delete(`/shop-value/${id}`);
  loadShopValue();
}

if (shopValueForm) {
  shopValueForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('categoryName').value;
    const count = Number(document.getElementById('categoryCount').value);
    const value = Number(document.getElementById('categoryValue').value);

    await api.post('/shop-value', { categoryName, count, value });
    shopValueForm.reset();
    loadShopValue();
  });
}
