var app = new Vue({
  el: '#app',
  data: {
    lists: [],
    newListName: '',
    selectedList: {},
    newItemName: '',
  },
  methods: {
    createList() {
      if (this.newListName.trim().length > 0) {
        this.lists.push({ name: this.newListName, items: [] });
        this.newListName = '';
      }
    },
    deleteList(list) {
      if (list === this.selectedList) {
        this.selectedList = {};
      }
      this.lists.splice(this.lists.indexOf(list), 1);
    },
    toggleSelectedList(list) {
      if (list === this.selectedList) {
        this.selectedList = {};
      } else {
        this.selectedList = list;
      }
    },
    addItemToList() {
      if (this.newItemName.trim().length > 0) {
        this.selectedList.items.push(this.newItemName);
        this.newItemName = '';
      }
    },
    deleteItem(item) {
      this.selectedList.items.splice(this.selectedList.items.indexOf(item), 1);
    }
  },
});