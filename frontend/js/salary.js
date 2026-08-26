// Salary row (admin only, inline in the right sidebar - not a modal anymore)

const salaryForm = document.getElementById('salaryForm');
const salaryList = document.getElementById('salaryList');

async function loadSalaries() {
  const salaries = await api.get('/salaries');
  salaryList.innerHTML = '';
  salaries.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.memberName} - ${s.salaryAmount} (${new Date(s.date).toLocaleDateString()})</span>`;
    salaryList.appendChild(li);
  });
}

if (salaryForm && localStorage.getItem('role') === 'admin') {
  salaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberName = document.getElementById('salaryMemberName').value;
    const date = document.getElementById('salaryDate').value;
    const salaryAmount = Number(document.getElementById('salaryAmount').value);

    await api.post('/salaries', { memberName, date, salaryAmount });
    salaryForm.reset();
    loadSalaries();
  });

  loadSalaries();
}
