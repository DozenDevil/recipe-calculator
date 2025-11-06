// Размер шрифта

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

// Добавление ингредиента

let recipe = []
document.getElementById('addItem').addEventListener('click', function () {
    const itemName = document.getElementById('itemName');
    const itemAmount = document.getElementById('itemAmount');
    const itemMeasure = document.getElementById('itemMeasure');

    if (!itemName.value) {
        alert('Введите название ингредиента!');
        return false;
    }

    recipe.push({
        "name": itemName.value,
        "amount": +itemAmount.value,
        "measure": itemMeasure.value
    });

    let ingredient
    if (+itemAmount.value) {
        ingredient = `${itemName.value} - ${itemAmount.value} ${itemMeasure.value}`;
    } else {
        ingredient = `${itemName.value} - по вкусу`;
    }

    let itemContainer = document.createElement('div');
    itemContainer.innerHTML = `
        <div class="d-flex justify-ingredient">
            <div>${ingredient}</div>
            <button class="dangerButton" data-ingredient-name="${itemName.value}">&times;</button>
        </div>
    `

    document.getElementById('recipe').append(itemContainer);

    itemName.value = '';
    itemAmount.value = '';
});

// Удаление ингредиента

document.getElementById('recipe').addEventListener('click', e => {
    if (!e.target.dataset.ingredientName) {
        return;
    }

    for (let i = 0; i < recipe.length; i++) {
        if (recipe[i].name == e.target.dataset.ingredientName) {
            recipe.splice(i, 1);
        }
    }

    e.target.closest('.d-flex').remove();
});

// Изменение названия рецепта

document.getElementById('recipeTitle').addEventListener('click', e => {
    const title = prompt("Введите название рецепта");
    if (title) {
        e.target.textContent = title;
    }
});

// Копирование рецепта

document.getElementById('copyRecipe').addEventListener('click', function () {
    let textToCopy = document.getElementById('scaledRecipe').innerText;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Рецепт успешно скопирован!");
        })
        .catch(err => {
            console.error('Не удалось скопировать рецепт:', err);
        });
});