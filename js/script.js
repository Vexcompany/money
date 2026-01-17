let mode = 'in';
let data = JSON.parse(localStorage.getItem('v10_data')) || [];
let goals = JSON.parse(localStorage.getItem('v10_goals')) || [];
let user = JSON.parse(localStorage.getItem('v10_user')) || { name: 'User', img: 'https://ui-avatars.com/api/?name=U+S&background=6366f1&color=fff' };

// Helper SweetAlert
const toast = (icon, title) => {
    Swal.fire({ icon, title, toast: true, position: 'top', showConfirmButton: false, timer: 2000, background: '#0f172a', color: '#fff' });
};

function fmtAbbr(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'm';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'jt';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'rb';
    return n;
}

function fmt(el) {
    let v = el.value.replace(/\D/g, '');
    el.value = v ? parseInt(v).toLocaleString('id-ID') : '';
}

function setM(m) {
    mode = m;
    document.getElementById('bin').style.background = m === 'in' ? 'var(--in)' : '#1e293b';
    document.getElementById('bin').style.color = m === 'in' ? 'white' : 'var(--dim)';
    document.getElementById('bout').style.background = m === 'out' ? 'var(--out)' : '#1e293b';
    document.getElementById('bout').style.color = m === 'out' ? 'white' : 'var(--dim)';
}

function sw(p, b) {
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active'));
    document.getElementById(p).classList.add('active');
    b.classList.add('active');
    if(p === 'goals') renderGoals();
}

function save() {
    const a = parseInt(document.getElementById('amt').value.replace(/\./g, ''));
    const d = document.getElementById('dsc').value;
    if(!a || !d) {
        toast('error', 'Lengkapi data!');
        return;
    }
    data.push({ id: Date.now(), type: mode, amount: a, desc: d, date: new Date().toLocaleDateString('id-ID') });
    localStorage.setItem('v10_data', JSON.stringify(data));
    document.getElementById('amt').value = '';
    document.getElementById('dsc').value = '';
    render();
    toast('success', 'Transaksi Disimpan!');
}

function saveGoal() {
    const n = document.getElementById('g-name').value;
    const a = parseInt(document.getElementById('g-amt').value.replace(/\./g, ''));
    if(!n || !a) {
        toast('error', 'Lengkapi data target!');
        return;
    }
    goals.push({ id: Date.now(), name: n, target: a });
    localStorage.setItem('v10_goals', JSON.stringify(goals));
    document.getElementById('g-name').value = '';
    document.getElementById('g-amt').value = '';
    renderGoals();
    toast('success', 'Target Ditambahkan!');
}

function render() {
    let i = 0, e = 0;
    const list = document.getElementById('h-list');
    if(!list) return;
    list.innerHTML = '';
    data.forEach(t => t.type === 'in' ? i += t.amount : e += t.amount);
    const b = i - e;

    document.getElementById('disp-name').innerText = `Halo, ${user.name}!`;
    document.getElementById('disp-img').src = user.img;
    document.getElementById('main-bal').innerText = `Rp ${b.toLocaleString('id-ID')}`;
    document.getElementById('abbr-bal').innerText = `≈ ${fmtAbbr(b)}`;
    document.getElementById('sum-in').innerText = `Rp ${i.toLocaleString('id-ID')}`;
    document.getElementById('sum-out').innerText = `Rp ${e.toLocaleString('id-ID')}`;

    [...data].reverse().slice(0, 15).forEach(t => {
        list.innerHTML += `<div class="item">
            <div><p style="font-weight:700; font-size:14px">${t.desc}</p><small style="color:var(--dim)">${t.date}</small></div>
            <b style="color:${t.type==='in'?'var(--in)':'var(--out)'}">${t.type==='in'?'+':'-'}${fmtAbbr(t.amount)}</b>
        </div>`;
    });
}

function renderGoals() {
    const gl = document.getElementById('g-list');
    gl.innerHTML = '';
    goals.forEach(g => {
        gl.innerHTML += `<div class="card goal-item">
            <p style="font-weight:700">${g.name}</p>
            <small style="color:var(--dim)">Target: Rp ${g.target.toLocaleString('id-ID')}</small>
        </div>`;
    });
}

function apply() {
    const n = document.getElementById('set-name').value;
    const i = document.getElementById('set-img').value;
    if(n) user.name = n;
    if(i) user.img = i;
    localStorage.setItem('v10_user', JSON.stringify(user));
    render();
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Identitas Anda telah diperbarui.',
        confirmButtonColor: '#6366f1'
    });
}

function dlEx() {
    if(data.length === 0) return toast('error', 'Tidak ada data untuk diexport');
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finance");
    XLSX.writeFile(wb, "Finance_Data.xlsx");
    toast('success', 'File Excel Berhasil Diunduh');
}

function reset() {
    Swal.fire({
        title: 'Hapus Semua?',
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#1e293b',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.reload();
        }
    });
}

document.addEventListener('DOMContentLoaded', render);
