import Search from './models/Search';
import Recipe from './models/Recipe';
import Cart from './models/Cart'
import Likes from './models/Likes'
import * as userInterface from './views/userInterface'; //return object
import { DOMstrings } from './views/DOMstrings';
const state = {};

//Search Controller
const controlSearch = async function () {

    //1) get query from search input
    const query = userInterface.getInput();
    if (query) {

        //2) add new search object to state
        state.search = new Search(query);
        //3)prepare UI
        userInterface.clearResultList();
        userInterface.renderLoadingImg('search');

        try {
            //4)search for recipes and add the array to state.search.result
            await state.search.getFood();

            //3.5) split up for sleeker look
            userInterface.clearInput();
            userInterface.deleteLoadingImg();

            //5)when function is done, show in UI
            userInterface.renderResult(state.search.result);
        } catch (error) {
            console.log(error);
            userInterface.clearInput();
        };
    };
};

//Submit Recipe
DOMstrings.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//Recipe Controller
const controlRecipe = async function () {
    //get the hashtag from url anf remove hashtag
    const id = window.location.hash.replace('#', '');

    if (id) {
        //add recipe to state
        state.recipe = new Recipe(id);
        //wait until recipe info is returned
        if (state.search) {
            userInterface.addActiveClass(id);
        }
        try {
            userInterface.clearRecipeUI();
            userInterface.renderLoadingImg('recipe');
            //wait to retrieve info
            await state.recipe.getRecipe();
            //delete loader
            userInterface.deleteLoadingImg();

            state.recipe.calculateTime();
            state.recipe.calculateServing();
            state.recipe.formatIngredients();
            //display the recipe
            userInterface.displayRecipe(
                state.recipe, 
                state.likes.checkLiked(id)
                );
        } catch (error) {
            console.log(error);
        };
    };
};

//Shopping Cart Controller
const cartController = function () {
    //create cart only if none is present
    if (!state.cart) {
        state.cart = new Cart()
    }
    //add each ingredient to cart data
    state.recipe.ingredients.forEach(e => {
        state.cart.addItem(e.number, e.unit, e.ingredient)
    })
    //loop through ingreduents andadd data to ui
    state.cart.list.forEach(e => {
        userInterface.addToCartUI(e)
    })
};

const cartDelete = function (cartID) {
    //delete from date
    state.cart.deleteItem(cartID);
    //delete from ui
    userInterface.deleteFromCartUI(cartID);
};
//change value of item in cart
const changeCartNumber = function (cartID, cartVal) {
    state.cart.itemVal(cartID, cartVal);
};
//Likes Controller
const toggleLikedList = function () {
    const { id, title, author, image } = state.recipe;

    //create likes only if none is present
    if (!state.likes) {
        state.likes = new Likes()
    }
    //if the item is NOT in the list, defualt
    if (!state.likes.checkLiked(id)) {
        //toggle class
        userInterface.toggleHeart(true);
        //add to state
        state.likes.addItem(id, title, author, image);
        //add to ui
        userInterface.addLikesUI(id, title, author, image);
    }//item PRESENT in the list
    else if (state.likes.checkLiked(id)) {
        //toggle class
        userInterface.toggleHeart(false);
        //delete from state
        state.likes.deleteItem(id)
        //delete from ui
        userInterface.deleteFromLikesUI(id);
    }
    userInterface.toggleLikeMenu(state.likes.numOfLikes());
};

//add event listener to dynamic element(page button)
document.addEventListener('click', e => {
    //get the closest parent elemnt of this name if element was not clicked
    const btn = e.target.closest('.btn-inline');
    const cartItem = e.target.closest('.shopping__item');

    if (btn) {
        //parseInt radix
        const goToPage = parseInt(btn.dataset.gotopage, 10);
        //clear before loading new page
        userInterface.clearResultList();
        //load new page
        userInterface.renderResult(state.search.result, goToPage);
    };
    //if increase or decrease serving btn is pressed
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.servingSize('decrease');
            //change ui
            userInterface.updateServings(state.recipe)
        };
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        if (state.recipe.servings < 10) {
            state.recipe.servingSize('increase');
        };
        //change ui
        userInterface.updateServings(state.recipe)
    };

    //add to shopping list
    if (e.target.matches('.recipe__btn__add, .recipe__btn__add *')) {
        cartController();
    }
    //delete cart item
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        const cartID = cartItem.dataset.itemid;
        cartDelete(cartID);
    }
    //change amount of ingredient in cart
    if (e.target.matches('.cartVal')) {
        const cartID = cartItem.dataset.itemid;
        const cartVal = parseFloat(e.target.value);
        changeCartNumber(cartID, cartVal);
    }
    //add or remove from liked
    if (e.target.matches('.recipe__love, .recipe__love *')) {
        toggleLikedList();
    }
});

//when url hashtag changes or page loads
['load', 'hashchange'].forEach(element => {
    window.addEventListener(element, controlRecipe);
});

//handle likes when window load
window.addEventListener('load', () => {
    state.likes = new Likes()
    state.likes.readLocal()
    userInterface.toggleLikeMenu(state.likes.numOfLikes());  
    state.likes.list.forEach(e => {
       userInterface.addLikesUI(e.id, e.title, e.author, e.image)
    })  
})
