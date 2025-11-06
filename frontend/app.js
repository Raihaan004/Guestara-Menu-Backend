// Minimal frontend for Guestara Menu Backend
// By default this app calls the API on the same origin under /api
// The backend mounts routes under `/api`, so default to '/api' but allow
// overriding by setting `window.API_BASE` before this script loads.
const API_BASE = window.API_BASE !== undefined ? window.API_BASE : '/api';

// --- helpers ---
async function api(path, opts = {}){
  const res = await fetch(API_BASE + path, opts);
  if (!res.ok) {
    const text = await res.text().catch(()=>"(no body)");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

// --- Categories ---
async function fetchCategories(){ return api('/categories'); }
async function createCategory(name){ return api('/categories', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name})}); }
async function updateCategory(id, data){ return api(`/categories/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); }
async function deleteCategory(id){ return api(`/categories/${id}`, {method:'DELETE'}); }

// --- Subcategories ---
async function fetchSubcategories(){ return api('/subcategories'); }
async function createSubcategory(payload){ return api('/subcategories', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}); }
async function updateSubcategory(id, data){ return api(`/subcategories/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); }
async function deleteSubcategory(id){ return api(`/subcategories/${id}`, {method:'DELETE'}); }

// --- Items ---
async function fetchItems(){ return api('/items'); }
async function createItem(payload){ return api('/items', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)}); }
async function updateItem(id, data){ return api(`/items/${id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)}); }
async function deleteItem(id){ return api(`/items/${id}`, {method:'DELETE'}); }

// --- UI wiring ---
const tabs = {
  categories: document.getElementById('tab-categories'),
  subcategories: document.getElementById('tab-subcategories'),
  items: document.getElementById('tab-items')
};
const views = {
  categories: document.getElementById('view-categories'),
  subcategories: document.getElementById('view-subcategories'),
  items: document.getElementById('view-items')
};

function showView(name){
  Object.values(views).forEach(v=>v.style.display = 'none');
  views[name].style.display = '';
}

tabs.categories.onclick = ()=>{ showView('categories'); loadCategories(); };
tabs.subcategories.onclick = ()=>{ showView('subcategories'); loadSubcategories(); };
tabs.items.onclick = ()=>{ showView('items'); loadItems(); };

// Categories UI
const catForm = document.getElementById('form-category');
const catNameInput = document.getElementById('category-name');
const catList = document.getElementById('categories-list');
catForm.onsubmit = async (e)=>{
  e.preventDefault();
  try{
    await createCategory(catNameInput.value.trim());
    catNameInput.value='';
    await loadCategories();
  }catch(err){ alert(err.message); }
};

async function loadCategories(){
  try{
    const cats = await fetchCategories();
    catList.innerHTML = '';
    cats.forEach(c => {
      const li = document.createElement('li'); li.className='item';
      const left = document.createElement('div'); left.innerHTML = `<strong>${escapeHtml(c.name)}</strong> <div class="small-muted">id: ${c._id || c.id || ''}</div>`;
      const controls = document.createElement('div'); controls.className='controls';
      const editBtn = document.createElement('button'); editBtn.textContent='Edit'; editBtn.className='btn-ghost';
      const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.className='btn-danger';
      controls.append(editBtn, delBtn);
      li.append(left, controls);
      catList.append(li);

      editBtn.onclick = ()=>{ showCategoryEdit(li, c); };
      delBtn.onclick = async ()=>{ if(confirm('Delete category?')){ await deleteCategory(c._id || c.id); await loadCategories(); } };
    });
    // also refresh selects used by subcategories/items
    populateCategorySelects(cats);
  }catch(err){ alert('Load categories failed: ' + err.message); }
}

function showCategoryEdit(li, cat){
  li.innerHTML = '';
  const input = document.createElement('input'); input.value = cat.name; input.className='edit-input';
  const save = document.createElement('button'); save.textContent='Save';
  const cancel = document.createElement('button'); cancel.textContent='Cancel'; cancel.className='btn-ghost';
  const controls = document.createElement('div'); controls.className='controls'; controls.append(save, cancel);
  li.append(input, controls);
  save.onclick = async ()=>{ await updateCategory(cat._id || cat.id, {name: input.value}); await loadCategories(); };
  cancel.onclick = ()=>{ loadCategories(); };
}

// Subcategories UI
const subForm = document.getElementById('form-subcategory');
const subNameInput = document.getElementById('subcategory-name');
const subCatSelect = document.getElementById('subcategory-category');
const subList = document.getElementById('subcategories-list');
subForm.onsubmit = async (e)=>{
  e.preventDefault();
  try{
    await createSubcategory({ name: subNameInput.value.trim(), category: subCatSelect.value });
    subNameInput.value='';
    await loadSubcategories();
  }catch(err){ alert(err.message); }
};

async function loadSubcategories(){
  try{
    const subs = await fetchSubcategories();
    subList.innerHTML='';
    subs.forEach(s=>{
      const li = document.createElement('li'); li.className='item';
      const left = document.createElement('div'); left.innerHTML = `<strong>${escapeHtml(s.name)}</strong><div class="small-muted">category: ${escapeHtml((s.category && (s.category.name || s.category))|| '')}</div>`;
      const controls = document.createElement('div'); controls.className='controls';
      const editBtn = document.createElement('button'); editBtn.textContent='Edit'; editBtn.className='btn-ghost';
      const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.className='btn-danger';
      controls.append(editBtn, delBtn);
      li.append(left, controls);
      subList.append(li);

      editBtn.onclick = ()=>{ showSubEdit(li, s); };
      delBtn.onclick = async ()=>{ if(confirm('Delete subcategory?')){ await deleteSubcategory(s._id || s.id); await loadSubcategories(); } };
    });
    // refresh category select used elsewhere
    const cats = await fetchCategories(); populateCategorySelects(cats);
  }catch(err){ alert('Load subcategories failed: ' + err.message); }
}

function showSubEdit(li, s){
  li.innerHTML='';
  const nameIn = document.createElement('input'); nameIn.value = s.name; nameIn.className='edit-input';
  const catSel = document.createElement('select'); catSel.className='edit-input';
  // populate categories then set value
  fetchCategories().then(cats=>{ populateSelect(catSel, cats, s.category && (s.category._id || s.category)); });
  const save = document.createElement('button'); save.textContent='Save';
  const cancel = document.createElement('button'); cancel.textContent='Cancel'; cancel.className='btn-ghost';
  const controls = document.createElement('div'); controls.className='controls'; controls.append(save, cancel);
  li.append(nameIn, catSel, controls);
  save.onclick = async ()=>{ await updateSubcategory(s._id || s.id, { name: nameIn.value, category: catSel.value }); await loadSubcategories(); };
  cancel.onclick = ()=>{ loadSubcategories(); };
}

// Items UI
const itemForm = document.getElementById('form-item');
const itemName = document.getElementById('item-name');
const itemPrice = document.getElementById('item-price');
const itemDesc = document.getElementById('item-desc');
const itemCat = document.getElementById('item-category');
const itemSub = document.getElementById('item-subcategory');
const itemsList = document.getElementById('items-list');

itemForm.onsubmit = async (e)=>{
  e.preventDefault();
  try{
    // backend Item model expects `baseAmount` and `subCategory`
    const payload = {
      name: itemName.value.trim(),
      baseAmount: parseFloat(itemPrice.value) || 0,
      description: itemDesc.value.trim(),
      category: itemCat.value || undefined,
      subCategory: itemSub.value || undefined,
    };
    await createItem(payload);
    itemName.value=''; itemPrice.value=''; itemDesc.value='';
    await loadItems();
  }catch(err){ alert(err.message); }
};

async function loadItems(){
  try{
    const items = await fetchItems();
    itemsList.innerHTML='';
    items.forEach(it=>{
      const li = document.createElement('li'); li.className='item';
      const left = document.createElement('div');
      left.innerHTML = `<strong>${escapeHtml(it.name)}</strong>` +
        ` <div class="small-muted">${escapeHtml(it.description||'')} — ${it.baseAmount!=null?('$'+it.baseAmount):''}</div>` +
        `<div class="small-muted">category: ${escapeHtml((it.category && (it.category.name||it.category))||'')} sub: ${escapeHtml((it.subCategory && (it.subCategory.name||it.subCategory))||'')}</div>`;
      const controls = document.createElement('div'); controls.className='controls';
      const editBtn = document.createElement('button'); editBtn.textContent='Edit'; editBtn.className='btn-ghost';
      const delBtn = document.createElement('button'); delBtn.textContent='Delete'; delBtn.className='btn-danger';
      controls.append(editBtn, delBtn);
      li.append(left, controls);
      itemsList.append(li);

      editBtn.onclick = ()=>{ showItemEdit(li, it); };
      delBtn.onclick = async ()=>{ if(confirm('Delete item?')){ await deleteItem(it._id || it.id); await loadItems(); } };
    });
    // ensure selects are populated
    const cats = await fetchCategories(); populateCategorySelects(cats);
    const subs = await fetchSubcategories(); populateSelect(document.getElementById('item-subcategory'), subs);
  }catch(err){ alert('Load items failed: ' + err.message); }
}

function showItemEdit(li, it){
  li.innerHTML='';
  const nameIn = document.createElement('input'); nameIn.value = it.name; nameIn.className='edit-input';
  const priceIn = document.createElement('input'); priceIn.type='number'; priceIn.step='0.01'; priceIn.value = it.baseAmount || 0; priceIn.className='edit-input';
  const descIn = document.createElement('input'); descIn.value = it.description || ''; descIn.className='edit-input';
  const catSel = document.createElement('select'); const subSel = document.createElement('select');
  fetchCategories().then(cats=>{ populateSelect(catSel, cats, it.category && (it.category._id || it.category)); });
  fetchSubcategories().then(subs=>{ populateSelect(subSel, subs, it.subCategory && (it.subCategory._id || it.subCategory)); });
  const save = document.createElement('button'); save.textContent='Save';
  const cancel = document.createElement('button'); cancel.textContent='Cancel'; cancel.className='btn-ghost';
  const controls = document.createElement('div'); controls.className='controls'; controls.append(save, cancel);
  li.append(nameIn, priceIn, descIn, catSel, subSel, controls);
  save.onclick = async ()=>{ await updateItem(it._id || it.id, { name: nameIn.value, baseAmount: parseFloat(priceIn.value)||0, description: descIn.value, category: catSel.value || undefined, subCategory: subSel.value || undefined }); await loadItems(); };
  cancel.onclick = ()=>{ loadItems(); };
}

// Helpers to populate selects
function populateSelect(selectEl, items, selectedId){
  selectEl.innerHTML = '';
  const empty = document.createElement('option'); empty.value=''; empty.textContent='-- none --'; selectEl.append(empty);
  items.forEach(i=>{
    const opt = document.createElement('option'); opt.value = i._id || i.id || i; opt.textContent = i.name || i;
    if(selectedId && (opt.value == selectedId || opt.textContent==selectedId)) opt.selected = true;
    selectEl.append(opt);
  });
}
function populateCategorySelects(cats){
  populateSelect(subCatSelect, cats);
  populateSelect(itemCat, cats);
}

function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

// initial load
showView('categories'); loadCategories(); loadSubcategories(); loadItems();

// optional: when category selection changes, try to populate subcategory select filter
itemCat.onchange = async ()=>{
  const catId = itemCat.value;
  const subs = await fetchSubcategories();
  const filtered = subs.filter(s => { try{return (s.category && (s.category._id||s.category)) == catId;}catch(e){return false;} });
  populateSelect(itemSub, filtered);
};