import { DOMstrings, DOMclass } from './DOMstrings';
import Fraction from 'fraction.js';

function checkTitleLength(title) {
    let titleLength = 17;
    //copied from stackoverflow added my own comments
    if (title.titleLength <= titleLength) return title;
    //split title into array, create variable containing the length of the first word
    let strAry = title.split(' ');
    let retLen = strAry[0].length;
    //loop through each word and concat until length passes 17
    for (var i = 1; i < strAry.length; i++) {
        if (retLen === titleLength || retLen + strAry[i].length + 1 > titleLength) break;
        retLen += strAry[i].length + 1
    }
    //turn array into string, take off last word
    return strAry.slice(0, i).join(' ') + '...';

};

function renderRecipe(element) {
    //html for each element
    let output = `               
     <li>
        <a class="results__link" href="#${element.recipe_id}">
            <figure class="results__fig">
                <img src="${element.image_url}" alt=${element.title}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${checkTitleLength(element.title)}</h4>
                <p class="results__author">${element.publisher}</p>
            </div>
        </a>
    </li>`;

    DOMstrings.resultList.insertAdjacentHTML('beforeend', output);
};

function createButton(page, type) {
    //create the button based on the typed passed
    return `<button class="btn-inline results__btn--${type}" data-gotopage="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;
};

function renderButton(page, maxPages) {
    let btn = '';

    if (page === 1 && page !== maxPages) {
        //if there are multiple pages and user is on the first
        btn = createButton(page, 'next');

    } else if (page > 1 && page !== maxPages) {
        //at least 1 page and 3 max pages
        btn = `${createButton(page, 'prev')}
           ${createButton(page, 'next')}`;

    } else if (page > 1 && page === maxPages) {
        //if there are multiple pages and user is on the last
        btn = createButton(page, 'prev');
    };

    DOMstrings.resultsPages.innerHTML = btn;
};
//github
function turnIntoFraction(number) {
    var x = new Fraction(number);
    return x.toFraction(true);
}

function loopIngredient(array) {
    let outPut = ''
    array.forEach(e => {
        outPut += `<li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${turnIntoFraction(e.number)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${e.unit}</span>
                ${e.ingredient}
            </div>
        </li>`});
    return outPut;
};

export function getInput() {
    return DOMstrings.searchInput.value;
};

export function clearInput() {
    DOMstrings.searchInput.value = '';
};

export function renderResult(array, page = 1) {
    let partialArray, start, end, maxPages, diplayLen;
    //1) display 10 per page
    diplayLen = 10;
    //page 1 will give 0, page 2 will give 10, page 3 will give 20, etc..
    start = (page - 1) * diplayLen;
    end = start + diplayLen;
    partialArray = array.slice(start, end);

    //display list of recipes
    partialArray.forEach(element => {
        //pass each value(element) into function 
        renderRecipe(element);
    });

    //get maximum item there will be
    maxPages = Math.ceil(array.length / diplayLen);
    renderButton(page, maxPages);
};

export function clearResultList() {
    DOMstrings.resultList.innerHTML = '';
    DOMstrings.resultsPages.innerHTML = '';
    // document.querySelector('.recipe').innerHTML = '';
};

export function clearRecipeUI() {
    document.querySelector('.recipe').innerHTML = '';
}

export function renderLoadingImg(type) {
    //this is added to html, so path must be treated from there
    var outPut = `
    <div class="${DOMclass.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;

    if (type === 'search') {
        DOMstrings.searchResult.insertAdjacentHTML('afterbegin', outPut);
    } else if (type === 'recipe') {
        document.querySelector('.recipe').insertAdjacentHTML('afterbegin', outPut);
    }
};

export function deleteLoadingImg() {
    let element = document.querySelector(`.${DOMclass.loader}`);
    //cheack if it was created
    if (element) {
        element.parentElement.removeChild(element);
    };
};

export function displayRecipe(obj, bool) {
    let output = `
    <figure class="recipe__fig">
        <img src="${obj.image}" width="100%" height="100%" alt="${obj.title}"recipe__img">
    </figure>
    <h1 class="recipe__title">
    <span>${obj.title}</span>
    </h1>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${obj.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${obj.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${ bool ? '' : '-outlined'}"></use>
            </svg>
        </button>
    </div>



    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${loopIngredient(obj.ingredients)}
        </ul>

        <button class="btn-small recipe__btn recipe__btn__add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">The Pioneer Woman</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>`;

    document.querySelector('.recipe').insertAdjacentHTML('afterbegin', output);
};
//ADD BACKGROUND TO CLIKED RESULT
export function addActiveClass(id) {
    let nodeList = Array.from(document.querySelectorAll('.results__link'));
    nodeList.forEach(e => {
        e.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};
//CHANGE INGREDEANT TO FRACTION
export function updateServings(recipe) {
    //change serving ui
    document.querySelector('.recipe__info-data--people').innerHTML = recipe.servings

    //change ingredient ui
    const ingredientArray = document.querySelectorAll('.recipe__count');
    //loop though ingredient divs and change text of ingredients
    ingredientArray.forEach((ing, i) => {
        ing.textContent = turnIntoFraction(recipe.ingredients[i].number);
    })
};

//CART UI
export function addToCartUI(cartItem) {
    let output = `
    <li class="shopping__item" data-itemid="${cartItem.id}">
        <div class="shopping__count">
            <input type="number" value="${cartItem.number}" step="${cartItem.number}" class="cartVal">
            <p>${cartItem.unit}</p>
        </div>
        <p class="shopping__description">${cartItem.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;

    document.querySelector('.shopping__list').insertAdjacentHTML('beforeend', output);
};

export function deleteFromCartUI(elementId) {
    let element = document.querySelector(`.shopping__item[data-itemid="${elementId}"]`);
    element.parentNode.removeChild(element);
}

//LIKES FUNCTIONS
export function addLikesUI(id, title, author, image) {
    let output = `<li>
    <a class="likes__link" href="#${id}">
        <figure class="likes__fig">
            <img src="${image}" alt="${title}">
        </figure>
        <div class="likes__data">
            <h4 class="likes__name">${checkTitleLength(title)}</h4>
            <p class="likes__author">${author}</p>
        </div>
    </a>
</li>`; 
    document.querySelector('.likes__list').insertAdjacentHTML('beforeend', output);
};
export function deleteFromLikesUI(elementId) {
    let element = document.querySelector(`.likes__link[href="${elementId}"]`);
    if (element) {
        element.parentNode.removeChild(element);        
    }
};

export function toggleHeart(bool) {
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart${ bool ? '' : '-outlined'}`)
}

export function toggleLikeMenu(numLikes) {
    document.querySelector('.likes__field').style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}