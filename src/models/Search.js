import axios from 'axios';
import * as config from '../config.js';

//constructer class
export default class Search {
    constructor (query) {
        this.query = query;
    }
    //async runs promises in background
    async getFood() {
        try {
            //axios request
            const response = await axios.get(`${config.proxy}${config.url}/search?key=${config.key}&q=${this.query}`);
            //awaits axios to finish then gets recipes from data and adds to constructer
            this.result = response.data.recipes;

            //console.log(this.result);
        } catch (error) {
            alert(error);
        };
    };
};