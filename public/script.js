var app = new Vue({
  el: '#app',
  data: {
    lists: [],
    newListName: '',
    selectedList: {},
    newItemName: '',
  },
  created() {
    this.getLists();
  },
  methods: {
    async getLists() {
      try {
        let response = await axios.get("/api/wishlists");
        this.lists = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async createList() {
      try {
        if (this.newListName.trim().length > 0) {
          let listResponse = axios.post("/api/wishlists", {
            title: this.newListName
          });
          this.newListName = '';
          this.lists.add(await listResponse);
        }
      } catch (error) {
        console.log(error);
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