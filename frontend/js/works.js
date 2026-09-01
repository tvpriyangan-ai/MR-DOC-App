// Works table (inline dashboard card): everyone logged in can view the
// work name, date, done tick, worker name, and cash-received tick - only
// admin can add, toggle the ticks, or delete.

const worksBody = document.getElementById('worksBody');
const workForm = document.getElementById('workForm');
const workAddToggle = document.getElementById('workAddToggle');
const workFormWrap = document.getElementById('workFormWrap');
const workCancelBtn = document.getElementById('workCancelBtn');

const isWorksAdmin = localStorage.getItem('role') === 'admin';

function openWorkForm() {
  workFormWrap.classList.add('open');
  workAddToggle.style.display = 'none';
}

function closeWorkForm() {
  workFormWrap.classList.remove('open');
  workAddToggle.style.display = '';
  workForm.reset();
}

async function loadWorks() {
  const works = await api.get('/works');
  worksBody.innerHTML = '';
  if (works.length === 0) {
    worksBody.innerHTML = '<tr><td colspan="6" class="empty-state">No works added yet</td></tr>';
    return;
  }
  works.forEach(w => {
    const tr = document.createElement('tr');
    const disabledAttr = isWorksAdmin ? '' : 'disabled';
    const doneHandler = isWorksAdmin ? `onchange="toggleWorkField('${w._id}', 'completed', this.checked)"` : '';
    const cashHandler = isWorksAdmin ? `onchange="toggleWorkField('${w._id}', 'cashReceived', this.checked)"` : '';
    const deleteCell = isWorksAdmin ? `<button class="btn-red" onclick="deleteWork('${w._id}')">Delete</button>` : '';
    tr.innerHTML = `
      <td>${w.name}</td>
      <td>${new Date(w.date).toLocaleDateString()}</td>
      <td><input type="checkbox" ${w.completed ? 'checked' : ''} ${disabledAttr} ${doneHandler}></td>
      <td>${w.workerName}</td>
      <td><input type="checkbox" ${w.cashReceived ? 'checked' : ''} ${disabledAttr} ${cashHandler}></td>
      <td>${deleteCell}</td>`;
    worksBody.appendChild(tr);
  });
}

async function toggleWorkField(id, field, value) {
  await api.put(`/works/${id}`, { [field]: value });
}

async function deleteWork(id) {
  await api.delete(`/works/${id}`);
  loadWorks();
}

if (worksBody) {
  loadWorks();
}

if (workForm && isWorksAdmin) {
  workAddToggle.addEventListener('click', openWorkForm);
  workCancelBtn.addEventListener('click', closeWorkForm);

  workForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('workName').value;
    const date = document.getElementById('workDate').value;
    const workerName = document.getElementById('workWorkerName').value;

    await api.post('/works', { name, date, workerName });
    closeWorkForm();
    loadWorks();
  });
}
