if (!localStorage.getItem('userFontSize')) {
    localStorage.setItem('userFontSize', 12);
}

let userFontSize = parseInt(localStorage.getItem('userFontSize'));
setFontSize(userFontSize);

function setFontSize(size) {
    document.body.style.fontSize = `${size}px`;
    localStorage.setItem('userFontSize', size);
}

document.getElementById('fsize').addEventListener('click', e => {
    let action = e.target.dataset.action;
    if (action === "decrease" && userFontSize > 8) {
        userFontSize--;
    }
    if (action === "reset") {
        userFontSize = 12;
    }
    if (action === "increase" && userFontSize < 22) {
        userFontSize++;
    }

    setFontSize(userFontSize);
});