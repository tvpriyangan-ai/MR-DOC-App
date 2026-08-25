// Salary modal (admin only)

const salaryBtn = document.getElementById('salaryBtn');
const salaryModal = document.getElementById('salaryModal');
const salaryForm = document.getElementById('salaryForm');
const salaryList = document.getElementById('salaryList');

if (salaryBtn) {
  salaryBtn.addEventListener('click', () => {
    salaryModal.classList.remove('hidden');
    loadSalaries();
  });
}

async function loadSalaries() {
  const salaries = await api.get('/salaries');
  salaryList.innerHTML = '';
  salaries.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.memberName} - ${s.salaryAmount} (${new Date(s.date).toLocaleDateString()})</span>`;
    salaryList.appendChild(li);
  });
}

if (salaryForm) {
  salaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberName = document.getElementById('salaryMemberName').value;
    const date = document.getElementById('salaryDate').value;
    const salaryAmount = Number(document.getElementById('salaryAmount').value);

    await api.post('/salaries', { memberName, date, salaryAmount });
    salaryForm.reset();
    loadSalaries();
  });
}

// Generic close button for both modals (shared with shopValue.js)
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.target).classList.add('hidden');
  });
});
