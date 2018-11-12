import uniqid from 'uniqid';

export default class Cart {
    constructor() {
        this.list = [];
    };
    addItem(number, unit, ingredient) {
        const item = {
            id: uniqid(),
            number,
            unit,
            ingredient
        }
        this.list.push(item);
        return (item);
    };

    deleteItem(id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === id) {
                this.list.splice(i, 1);
            }
        }
    };

    itemVal(id, val) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === id) {
                this.list[i].number = val;
            }
        }
    }
};