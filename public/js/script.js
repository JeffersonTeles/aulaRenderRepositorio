let listItems = [];
let itemToDeleteId = null;

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

/* =========================
   CONTADOR
========================= */

function updateTitleCount() {

    titleCount.textContent =
        `${popupTitle.value.length} / 30`;

}

/* =========================
   CARREGAR NOTAS
========================= */

async function loadNotes() {

    try {

        const response = await fetch('/notes');

        const data = await response.json();

        listItems = data;

        renderList();

    } catch (err) {

        console.error(err);

    }

}

/* =========================
   RENDERIZAR
========================= */

function renderList() {

    listElement.innerHTML = '';

    listItems.forEach(item => {

        const li = document.createElement('li');

        li.className = 'list-item';

        li.innerHTML = `
            <span class="item-title">
                ${item.title || 'Sem título'}
            </span>

            <div class="item-bottom-row">

                <span class="item-text">
                    ${item.text}
                </span>

                <button class="icon-btn delete-btn">
                    ✖
                </button>

            </div>
        `;

        /* VISUALIZAR */

        li.querySelector('.item-title').onclick = () => {

            viewTitle.textContent =
                item.title || 'Anotação';

            viewContent.textContent =
                item.text;

            viewPopup.style.display = 'block';

            overlay.style.display = 'flex';

        };

        li.querySelector('.item-text').onclick = () => {

            viewTitle.textContent =
                item.title || 'Anotação';

            viewContent.textContent =
                item.text;

            viewPopup.style.display = 'block';

            overlay.style.display = 'flex';

        };

        /* REMOVER */

        li.querySelector('.delete-btn').onclick = () => {

            itemToDeleteId = item.id;

            deletePopup.style.display = 'block';

            overlay.style.display = 'flex';

        };

        listElement.appendChild(li);

    });

}

/* =========================
   ADICIONAR NOTA
========================= */

document.getElementById('add-save-btn').onclick =
async () => {

    const text = popupInput.value.trim();

    const title = popupTitle.value.trim();

    if (!text) return;

    try {

        const response = await fetch('/notes', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                title,
                text
            })

        });

        const newNote = await response.json();

        listItems.unshift(newNote);

        renderList();

        addPopup.style.display = 'none';

        overlay.style.display = 'none';

        popupInput.value = '';

        popupTitle.value = '';

        updateTitleCount();

    } catch (err) {

        console.error(err);

    }

};

/* =========================
   REMOVER NOTA
========================= */

document.getElementById('delete-remove-btn').onclick =
async () => {

    try {

        await fetch(`/notes/${itemToDeleteId}`, {
            method: 'DELETE'
        });

        listItems =
            listItems.filter(
                item => item.id !== itemToDeleteId
            );

        renderList();

        deletePopup.style.display = 'none';

        overlay.style.display = 'none';

    } catch (err) {

        console.error(err);

    }

};

/* =========================
   ABRIR POPUP
========================= */

document.getElementById('add-button').onclick = () => {

    addPopup.style.display = 'block';

    overlay.style.display = 'flex';

};

/* =========================
   FECHAR POPUPS
========================= */

document.getElementById('add-cancel-btn').onclick = closeAll;

document.getElementById('delete-cancel-btn').onclick = closeAll;

document.getElementById('view-close-btn').onclick = closeAll;

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