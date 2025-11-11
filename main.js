// Название рецепта по-умолчанию

const defaultTitle = "Нажмите, чтобы ввести название рецепта";

// Закреплённый рецепт в локальном хранилище

if (!localStorage.getItem('pinnedRecipe')) {
    localStorage.setItem('pinnedRecipe', JSON.stringify([]));
}

if (!localStorage.getItem('pinnedRecipeTitle')) {
    localStorage.setItem('pinnedRecipeTitle', "");
}

// Массивы рецептов

let workingRecipe = [];
let pinnedRecipe = JSON.parse(localStorage.getItem('pinnedRecipe')) || [];

// Скрываемые и активируемые элементы

const workingRecipeView = document.getElementById('workingRecipeView');
const pinnedRecipeView = document.getElementById('pinnedRecipeView');
const showRecipeButton = document.getElementById('showRecipe');

workingRecipeView.hidden = true;

if (!pinnedRecipe.length) {
    pinnedRecipeView.hidden = true;
} else {
    appendRecipe(pinnedRecipe, 'pinnedRecipeBody');
    document.getElementById('pinnedRecipeTitle').textContent = localStorage.getItem('pinnedRecipeTitle');
}

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

document.getElementById('addItem').addEventListener('click', function () {
    const itemName = document.getElementById('itemName');
    const itemAmount = document.getElementById('itemAmount');
    const itemMeasure = document.getElementById('itemMeasure');

    if (!itemName.value) {
        alert('Введите название ингредиента!');
        return false;
    }

    workingRecipe.push({
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

    document.getElementById('workingRecipe').append(itemContainer);

    if (showRecipeButton.disabled == true) {
        showRecipeButton.disabled = false;
    }

    itemName.value = '';
    itemAmount.value = '';
});

// Отображение рецепта

showRecipeButton.addEventListener('click', function () {
    appendRecipe(workingRecipe, 'recipeBody');
});

// Удаление ингредиента

document.getElementById('workingRecipe').addEventListener('click', e => {
    if (!e.target.dataset.ingredientName) {
        return false;
    }

    for (let i = 0; i < workingRecipe.length; i++) {
        if (workingRecipe[i].name === e.target.dataset.ingredientName) {
            workingRecipe.splice(i, 1);
        }
    }

    e.target.closest('.d-flex').remove();

    if (!workingRecipe.length) {
        showRecipeButton.disabled = true;
    }
});

// Вычисление пропорций

document.getElementById('scaleRecipe').addEventListener('click', function () {
    const scalingDirection = document.getElementById('scalingDirection').value;
    const scalingCoefficient = document.getElementById('scalingCoefficient').value;

    if (!scalingCoefficient) {
        alert('Введите размер пропорции!');
        return false;
    }

    let scaledRecipe = [];

    if (scalingDirection === "up") {
        for (ingredient of workingRecipe) {
            scaledRecipe.push({
                "name": ingredient.name,
                "amount": ingredient.amount * scalingCoefficient,
                "measure": ingredient.measure
            });
        }
    }

    if (scalingDirection === "down") {
        for (ingredient of workingRecipe) {
            scaledRecipe.push({
                "name": ingredient.name,
                "amount": Math.round(ingredient.amount / scalingCoefficient * 100) / 100,
                "measure": ingredient.measure
            });
        }
    }

    appendRecipe(scaledRecipe, 'recipeBody');
});

// Отобразить рецепт в выбранном месте

function appendRecipe(recipeArray, targetId) {
    const recipeBody = document.getElementById(targetId);
    recipeBody.innerHTML = '';

    for (ingredient of recipeArray) {
        if (ingredient.amount) {
            recipeItem = `${ingredient.name} - ${ingredient.amount} ${ingredient.measure}`;
        } else {
            recipeItem = `${ingredient.name} - по вкусу`;
        }

        let itemContainer = document.createElement('div');
        itemContainer.innerHTML = `
            <div class="d-flex">
                <div>${recipeItem}</div>
            </div>
        `

        recipeBody.append(itemContainer);
    }

    const recipeContainer = recipeBody.closest('fieldset');
    if (recipeContainer.hidden === true) {
        recipeContainer.hidden = false;
    }
}

// Педантичный текст

document.getElementById('scalingCoefficient').addEventListener('input', e => {
    const number = e.target.value;

    const isIndirect = (
        (number % 100 < 10 || number % 100 > 20) &
        (number % 10 == 2 ||
        number % 10 == 3 ||
        number % 10 == 4)
    );

    if (isIndirect) {
        document.getElementById('pedanticText').innerText = "раза";
    }
    else {
        document.getElementById('pedanticText').innerText = "раз";
    }
})

// Изменение названия рецепта

document.getElementById('recipeTitle').addEventListener('click', e => {
    const title = prompt("Введите название рецепта");
    if (title) {
        e.target.textContent = title;
    }
});

// Копирование рецепта

document.getElementById('copyRecipe').addEventListener('click', function () {
    let textToCopy = document.getElementById('pinnedRecipe').innerText;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Рецепт успешно скопирован!");
        })
        .catch(err => {
            console.error('Не удалось скопировать рецепт:', err);
        });
});

// Закрепление рецепта

document.getElementById('pinRecipe').addEventListener('click', function () {
    pinnedRecipe = workingRecipe;
    localStorage.setItem('pinnedRecipe', JSON.stringify(pinnedRecipe));

    const workingTitle = document.getElementById('recipeTitle');

    if (workingTitle.textContent.trim() != defaultTitle) {
        localStorage.setItem('pinnedRecipeTitle', workingTitle.textContent.trim());
        document.getElementById('pinnedRecipeTitle').textContent = workingTitle.textContent;
        workingTitle.textContent = defaultTitle;
    }

    appendRecipe(pinnedRecipe, 'pinnedRecipeBody');

    workingRecipeView.hidden = true;
    pinnedRecipeView.hidden = false;
});

// Удаление рецепта

document.getElementById('removeRecipe').addEventListener('click', function () {
    pinnedRecipe = [];
    localStorage.setItem('pinnedRecipe', JSON.stringify([]));
    localStorage.setItem('pinnedRecipeTitle', "");

    pinnedRecipeView.hidden = true;
});