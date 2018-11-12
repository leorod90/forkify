import axios from 'axios';
import * as config from '../config.js';

//constructer class
export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    //async runs promises in background
    async getRecipe() {
        try {
            //axios request
            const response = await axios.get(`${config.proxy}${config.url}/get?key=${config.key}&rId=${this.id}`);
            //awaits axios to finish then gets recipes from data and adds to constructer
            const result = response.data.recipe;
            //assign to object
            this.title = result.title;
            this.author = result.publisher;
            this.image = result.image_url;
            this.url = result.source_url;
            this.ingredients = result.ingredients;

        } catch (error) {
            alert('reached maximun api calls!');
        };

    };
    calculateTime() {
        //10 mn per each 3 of ingredients
        const ingredientLen = this.ingredients.length;
        const sets = Math.ceil(ingredientLen / 3);
        this.time = sets * 10;
    };
    calculateServing() {
        this.servings = 4;
    };
    //create new ingredient list with shorthands measurements and no parentheses
    formatIngredients() {
        //replace old with new
        const oldIngredients = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const newIngredients = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        //go through each ingredient string and run func
        const updatedIngredients = this.ingredients.map(el => {
            //convert all text to lower for replace method
            let ingredient = el.toLowerCase();
            //run through oldIngredients and replace words
            oldIngredients.forEach((element, i) => {
                //new string where the words are replaced if present, 'tablespoon' = newIngredient[1]
                ingredient = ingredient.replace(element, newIngredients[i]);
            });

            //remove -, parentheses and content
            ingredient = ingredient.replace(/-/g, ' ').replace(/ *\([^)]*\) */g, ' ');;

            //turn string into array
            const ingredientArray = ingredient.split(' ');

            //check if ingredientArray contains newIngredients and return index
            const unitIndex = ingredientArray.findIndex(el => newIngredients.includes(el));
            //example ['1','oz', 'of', 'salt'].findIndex('tsp'  => ['tbsp', 'tbsp', 'oz'].includes('oz')
            //return index of true so 1(oz of original array)

            let objIngredient;
            //if any part of findIndex returns newIngredients (arrays start at 0)
            if (unitIndex > -1) {
                //number is everything untill w.e index is newIngredients
                const objNumber = ingredientArray.slice(0, unitIndex);
                let count;
                //if only one number is returned, ie [4] and not [4, 1/2]
                if (objNumber.length === 1) {
                    count = parseInt(ingredientArray[0], 10);
                } else {
                    count = eval(objNumber.join('+'));
                };
                //return all info to obj
                objIngredient = {
                    number: count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                };
                //unitIndex return false but there is a number at beginning of string
            } else if (parseInt(ingredientArray[0], 10)) {
                //number = number in beginning, ingredient = everything but number in beginning
                objIngredient = {
                    number: parseInt(ingredientArray[0], 10),
                    unit: '',
                    ingredient: ingredientArray.slice(1).join(' ')
                };
                //findIndex doesn't return and there is no number is  beginning of string
            } else {
                objIngredient = {
                    number: 1,
                    unit: '',
                    ingredient: ingredient
                };
            };

            //return updated ingredient to new array
            return objIngredient;
        });
        this.ingredients = updatedIngredients;
    };
    servingSize(vary) {
        //add or substract one from serving
        const servingSize = vary === 'decrease' ? this.servings - 1 : this.servings + 1;
        //update ingredients list
        this.ingredients.forEach(ing => {
            ing.number = (ing.number / this.servings) * servingSize;
        });
        //update servings
        this.servings = servingSize;
    }
};