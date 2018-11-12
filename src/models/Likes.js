export default class Likes {
    constructor() {
        this.list = [];
    };
    addItem(id, title, author, image) {
        const item = {
           id,
           title,
           author,
           image
        }
        this.list.push(item);
        //add to local storage when item is created
        this.addToLocal();
        return (item);
    };
    checkLiked(id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === id) {
                return true;
            };
        };
    };
    deleteItem(id) {
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].id === id) {
                this.list.splice(i, 1);
            }
        };;
        this.addToLocal();
    };
    numOfLikes() {
        return this.list.length;
    };
    addToLocal(){
        //local storage only saves string, so turn object array into a string
        localStorage.setItem('likes', JSON.stringify(this.list));
    };
    readLocal() {
        //turn the string back to into array object
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) {
            this.list = storage;
        };
    };
};