// Customer list modal (admin only) - auto-populated whenever an invoice is
// created, deduped by mobile number. No manual add form here on purpose.

const customerBtn = document.getElementById('customerBtn');
const customerModal = document.getElementById('customerModal');
const customerList = document.getElementById('customerList');

if (customerBtn) {
  customerBtn.addEventListener('click', () => {
    customerModal.classList.remove('hidden');
    loadCustomers();
  });
}

async function loadCustomers() {
  const customers = await api.get('/customers');
  customerList.innerHTML = '';
  if (customers.length === 0) {
    customerList.innerHTML = '<li class="empty-state">No customers yet</li>';
    return;
  }
  customers.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${c.name} - ${c.mobileNumber}</span>
      <span><button class="btn-red" onclick="deleteCustomer('${c._id}')">Delete</button></span>`;
    customerList.appendChild(li);
  });
}

async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`);
  loadCustomers();
}
