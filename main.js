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

let initialRecipe = []
document.getElementById('addItem').addEventListener('click', function () {
    const itemName = document.getElementById('itemName');
    const itemAmount = document.getElementById('itemAmount');
    const itemMeasure = document.getElementById('itemMeasure');

    if (!itemName.value) {
        alert('Введите название ингредиента!');
        return false;
    }

    initialRecipe.push({
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

    document.getElementById('initialRecipe').append(itemContainer);

    itemName.value = '';
    itemAmount.value = '';
});

// Удаление ингредиента

document.getElementById('initialRecipe').addEventListener('click', e => {
    if (!e.target.dataset.ingredientName) {
        return false;
    }

    for (let i = 0; i < recipe.length; i++) {
        if (recipe[i].name === e.target.dataset.ingredientName) {
            recipe.splice(i, 1);
        }
    }

    e.target.closest('.d-flex').remove();
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
        for (ingredient of initialRecipe) {
            scaledRecipe.push({
                "name": ingredient.name,
                "amount": ingredient.amount * scalingCoefficient,
                "measure": ingredient.measure
            });
        }
    }

    if (scalingDirection === "down") {
        for (ingredient of initialRecipe) {
            scaledRecipe.push({
                "name": ingredient.name,
                "amount": Math.round(ingredient.amount / scalingCoefficient * 100) / 100,
                "measure": ingredient.measure
            });
        }
    }

    appendFinalRecipe(scaledRecipe);
});

function appendFinalRecipe(recipeArray) {
    const recipeBody = document.getElementById('recipeBody');
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
    if (!document.getElementById('recipeBody').innerHTML) {
        appendFinalRecipe(initialRecipe);
    }

    let textToCopy = document.getElementById('finalRecipe').innerText;

    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            alert("Рецепт успешно скопирован!");
        })
        .catch(err => {
            console.error('Не удалось скопировать рецепт:', err);
        });
});
