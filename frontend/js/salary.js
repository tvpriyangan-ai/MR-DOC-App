// Salary row (admin only, inline in the right sidebar - not a modal anymore)

const salaryForm = document.getElementById('salaryForm');
const salaryList = document.getElementById('salaryList');
const salaryAddToggle = document.getElementById('salaryAddToggle');
const salaryFormWrap = document.getElementById('salaryFormWrap');
const salaryCancelBtn = document.getElementById('salaryCancelBtn');

async function loadSalaries() {
  const salaries = await api.get('/salaries');
  salaryList.innerHTML = '';
  salaries.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.memberName} - <span class="entry-amount">${s.salaryAmount}</span> (${new Date(s.date).toLocaleDateString()})</span>`;
    salaryList.appendChild(li);
  });
  updateContainerTotal(document.getElementById('foodSalarySection'));
}

function openSalaryForm() {
  salaryFormWrap.classList.add('open');
  salaryAddToggle.style.display = 'none';
}

function closeSalaryForm() {
  salaryFormWrap.classList.remove('open');
  salaryAddToggle.style.display = '';
  salaryForm.reset();
}

if (salaryForm && localStorage.getItem('role') === 'admin') {
  salaryAddToggle.addEventListener('click', openSalaryForm);
  salaryCancelBtn.addEventListener('click', closeSalaryForm);

  salaryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberName = document.getElementById('salaryMemberName').value;
    const date = document.getElementById('salaryDate').value;
    const salaryAmount = Number(document.getElementById('salaryAmount').value);

    await api.post('/salaries', { memberName, date, salaryAmount });
    closeSalaryForm();
    loadSalaries();
  });

  loadSalaries();
}
