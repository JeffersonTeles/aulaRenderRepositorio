let listItems = [];
let nextId = 1;
let itemToDeleteId = null;
let dragSourceId = null;

const listElement = document.getElementById('central-list');
const overlay = document.getElementById('background-overlay');
const addPopup = document.getElementById('add-popup');
const deletePopup = document.getElementById('delete-popup');
const viewPopup = document.getElementById('view-popup');
const popupInput = document.getElementById('popup-input');
const popupTitle = document.getElementById('popup-title');
const viewTitle = document.getElementById('view-title');
const viewContent = document.getElementById('view-content');
const titleCount = document.getElementById('view-title-count');

function updateTitleCount() {
    if (!titleCount || !popupTitle) return;
    titleCount.textContent = `${popupTitle.value.length} / 30`;
}
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
}

function adjustTextareaPadding(tx) {
    // center small content vertically by adjusting padding-top
    const defaultPadding = 10;
    requestAnimationFrame(() => {
        const delta = (tx.clientHeight - tx.scrollHeight) / 2;
        if (delta > 0) tx.style.paddingTop = `${Math.max(defaultPadding, delta)}px`;
        else tx.style.paddingTop = `${defaultPadding}px`;
    });
}

popupInput.addEventListener('input', () => adjustTextareaPadding(popupInput));
popupInput.addEventListener('focus', () => { adjustTextareaPadding(popupInput); });
popupTitle.addEventListener('input', updateTitleCount);
window.addEventListener('resize', () => adjustTextareaPadding(popupInput));

function renderList() {
    listElement.innerHTML = '';
    listItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.draggable = true;
        li.dataset.id = item.id;
        const renderedTitle = truncateText(item.title ? item.title : '', 30);
        li.innerHTML = `
            <span class="item-title">${renderedTitle}</span>
            <div class="item-bottom-row">
                <span class="icon-btn drag-handle" title="Arrastar">☰</span>
                <span class="item-text">${item.text}</span>
                <button class="icon-btn delete-btn">✖</button>
            </div>
        `;

        const openView = () => {
            viewTitle.textContent = item.title ? item.title : 'Anotação';
            viewContent.textContent = item.text;
            viewPopup.style.display = 'block';
            overlay.style.display = 'flex';
        };
        const itemTextEl = li.querySelector('.item-text');
        const itemTitleEl = li.querySelector('.item-title');
        if (itemTextEl) itemTextEl.onclick = openView;
        if (itemTitleEl) itemTitleEl.onclick = openView;

        li.querySelector('.delete-btn').onclick = () => {
            itemToDeleteId = item.id;
            addPopup.style.display = 'none';
            viewPopup.style.display = 'none';
            deletePopup.style.display = 'block';
            overlay.style.display = 'flex';
        };

        li.addEventListener('dragstart', (e) => {
            dragSourceId = item.id;
            e.dataTransfer.setData('text/plain', item.id);
            e.dataTransfer.effectAllowed = 'move';
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            dragSourceId = null;
            li.classList.remove('dragging');
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            li.classList.add('drag-over');
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const sourceId = dragSourceId || e.dataTransfer.getData('text/plain');
            const targetId = li.dataset.id;
            if (sourceId && targetId && sourceId !== targetId) {
                const sourceIndex = listItems.findIndex(i => String(i.id) === String(sourceId));
                const targetIndex = listItems.findIndex(i => String(i.id) === String(targetId));
                if (sourceIndex > -1 && targetIndex > -1) {
                    const [moved] = listItems.splice(sourceIndex, 1);
                    listItems.splice(targetIndex, 0, moved);
                    renderList();
                }
            }
        });

        listElement.appendChild(li);
    });
}

document.getElementById('add-save-btn').onclick = () => {
    const text = popupInput.value.trim();
    const title = popupTitle.value.trim();
    if (title.length > 30) {
        alert('O título deve ter no máximo 30 caracteres.');
        return;
    }
    if (text) {
        listItems.unshift({ id: nextId++, title, text });
        addPopup.style.display = 'none';
        overlay.style.display = 'none';
        popupInput.value = '';
        popupTitle.value = '';
        updateTitleCount();
        renderList();
    }
};

const addButton = document.getElementById('add-button');
function openAddPopup() {
    // ensure other popup closed
    deletePopup.style.display = 'none';
    viewPopup.style.display = 'none';
    addPopup.style.display = 'block';
    overlay.style.display = 'flex';
    popupInput.value = '';
    popupTitle.value = '';
    updateTitleCount();
    setTimeout(() => { try { popupTitle.focus(); } catch(e){} }, 50);
}
if (addButton) {
    addButton.addEventListener('click', openAddPopup);
} else {
    // fallback: try to attach later
    window.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('add-button');
        if (btn) btn.addEventListener('click', openAddPopup);
    });
}

// Cancel / close handlers
document.getElementById('add-cancel-btn').onclick = () => {
    addPopup.style.display = 'none';
    overlay.style.display = 'none';
    popupInput.value = '';
};

document.getElementById('delete-cancel-btn').onclick = () => {
    deletePopup.style.display = 'none';
    overlay.style.display = 'none';
    itemToDeleteId = null;
};

document.getElementById('delete-remove-btn').onclick = () => {
    listItems = listItems.filter(i => i.id !== itemToDeleteId);
    deletePopup.style.display = 'none';
    overlay.style.display = 'none';
    itemToDeleteId = null;
    renderList();
};

// Close when clicking outside popups
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        addPopup.style.display = 'none';
        deletePopup.style.display = 'none';
        viewPopup.style.display = 'none';
        overlay.style.display = 'none';
        popupInput.value = '';
        itemToDeleteId = null;
    }
});

// Prevent overlay click from closing when clicking inside popup
addPopup.addEventListener('click', (e) => e.stopPropagation());
deletePopup.addEventListener('click', (e) => e.stopPropagation());
viewPopup.addEventListener('click', (e) => e.stopPropagation());

document.getElementById('view-close-btn').onclick = () => {
    viewPopup.style.display = 'none';
    overlay.style.display = 'none';
    viewContent.textContent = '';
};