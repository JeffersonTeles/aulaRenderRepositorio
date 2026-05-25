let listItems = [];

let itemToDeleteId = null;

let dragSourceId = null;

const listElement =
    document.getElementById('central-list');

const overlay =
    document.getElementById('background-overlay');

const addPopup =
    document.getElementById('add-popup');

const deletePopup =
    document.getElementById('delete-popup');

const viewPopup =
    document.getElementById('view-popup');

const popupInput =
    document.getElementById('popup-input');

const popupTitle =
    document.getElementById('popup-title');

const viewTitle =
    document.getElementById('view-title');

const viewContent =
    document.getElementById('view-content');

const titleCount =
    document.getElementById('view-title-count');

/* =========================
   CONTADOR
========================= */

function updateTitleCount() {

    titleCount.textContent =
        `${popupTitle.value.length} / 30`;

}

/* =========================
   CARREGAR
========================= */

async function loadNotes() {

    const response = await fetch('/notes');

    const data = await response.json();

    listItems = data;

    renderList();

}

/* =========================
   SALVAR ORDEM
========================= */

async function saveOrder() {

    const items = listItems.map(
        (item, index) => ({
            id: item.id,
            position: index + 1
        })
    );

    await fetch('/notes/reorder', {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ items })

    });

}

/* =========================
   RENDER
========================= */

function renderList() {

    listElement.innerHTML = '';

    listItems.forEach(item => {

        const li = document.createElement('li');

        li.className = 'list-item';

        li.draggable = true;

        li.dataset.id = item.id;

        li.innerHTML = `
            <span class="item-title">
                ${item.title || 'Sem título'}
            </span>

            <div class="item-bottom-row">

                <span class="icon-btn drag-handle">
                    ☰
                </span>

                <span class="item-text">
                    ${item.text}
                </span>

                <button class="icon-btn delete-btn">
                    ✖
                </button>

            </div>
        `;

        /* VISUALIZAR */

        const openView = () => {

            viewTitle.textContent =
                item.title || 'Anotação';

            viewContent.textContent =
                item.text;

            viewPopup.style.display = 'block';

            overlay.style.display = 'flex';

        };

        li.querySelector('.item-title')
            .onclick = openView;

        li.querySelector('.item-text')
            .onclick = openView;

        /* REMOVER */

        li.querySelector('.delete-btn')
            .onclick = () => {

            itemToDeleteId = item.id;

            deletePopup.style.display = 'block';

            overlay.style.display = 'flex';

        };

        /* DRAG */

        li.addEventListener('dragstart', (e) => {

            dragSourceId = item.id;

            e.dataTransfer.setData(
                'text/plain',
                item.id
            );

        });

        li.addEventListener('dragover', (e) => {

            e.preventDefault();

        });

        li.addEventListener('drop', async (e) => {

            e.preventDefault();

            const sourceId =
                dragSourceId;

            const targetId =
                item.id;

            if (sourceId === targetId)
                return;

            const sourceIndex =
                listItems.findIndex(
                    i => i.id == sourceId
                );

            const targetIndex =
                listItems.findIndex(
                    i => i.id == targetId
                );

            const [movedItem] =
                listItems.splice(
                    sourceIndex,
                    1
                );

            listItems.splice(
                targetIndex,
                0,
                movedItem
            );

            renderList();

            await saveOrder();

        });

        listElement.appendChild(li);

    });

}

/* =========================
   ADICIONAR
========================= */

document.getElementById(
    'add-save-btn'
).onclick = async () => {

    const text =
        popupInput.value.trim();

    const title =
        popupTitle.value.trim();

    if (!text) return;

    const response = await fetch(
        '/notes',
        {

            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({
                title,
                text
            })

        }
    );

    const newNote =
        await response.json();

    listItems.push(newNote);

    renderList();

    closeAll();

    popupInput.value = '';

    popupTitle.value = '';

    updateTitleCount();

};

/* =========================
   REMOVER
========================= */

document.getElementById(
    'delete-remove-btn'
).onclick = async () => {

    await fetch(
        `/notes/${itemToDeleteId}`,
        {
            method: 'DELETE'
        }
    );

    listItems =
        listItems.filter(
            item => item.id !== itemToDeleteId
        );

    renderList();

    closeAll();

};

/* =========================
   POPUPS
========================= */

document.getElementById(
    'add-button'
).onclick = () => {

    addPopup.style.display = 'block';

    overlay.style.display = 'flex';

};

document.getElementById(
    'add-cancel-btn'
).onclick = closeAll;

document.getElementById(
    'delete-cancel-btn'
).onclick = closeAll;

document.getElementById(
    'view-close-btn'
).onclick = closeAll;

overlay.onclick = (e) => {

    if (e.target === overlay) {

        closeAll();

    }

};

function closeAll() {

    addPopup.style.display = 'none';

    deletePopup.style.display = 'none';

    viewPopup.style.display = 'none';

    overlay.style.display = 'none';

}

/* =========================
   EVENTOS
========================= */

popupTitle.addEventListener(
    'input',
    updateTitleCount
);

/* =========================
   INICIAR
========================= */

loadNotes();