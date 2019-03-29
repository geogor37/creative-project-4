var app = new Vue({
  el: '#app',
  data: {
    lists: [],
    newListName: '',
    selectedList: {},
    listIsSelected: false,
    isEditing: false,
    editListName: '',
    newItemName: '',
  },
  created() {
    this.getLists();
  },
  methods: {
    async getLists() {
      try {
        let selectedListName = '';
        if (this.listIsSelected) {
          selectedListName = this.selectedList.name;
        }
        let response = await axios.get("/api/wishlists");
        this.lists = response.data;
        if (selectedListName != '') {
          this.selectedList = this.lists.find(function (list) {
            return list.name === selectedListName;
          });
        }
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
          this.lists.push((await listResponse).data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteList(list) {
      try {
        if (list === this.selectedList) {
          this.toggleSelectedList(list);
        }
        axios.delete("/api/wishlists/" + list._id);
        this.getLists();
      } catch (error) {
        console.log(error);
      }
    },
    toggleSelectedList(list) {
      if (list === this.selectedList) {
        this.selectedList = {};
        this.listIsSelected = false;
        this.isEditing = false;
      } else {
        this.selectedList = list;
        this.listIsSelected = true;
      }
    },
    startEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.editListName = '';
      this.isEditing = false;
    },
    async editList() {
      try {
        if (this.editListName.trim().length > 0) {
          let editResponse = axios.put("/api/wishlists/" + this.selectedList._id, {
            name: this.editListName
          });
          this.editListName = '';
          this.isEditing = false;
          this.selectedList = (await editResponse).data;
          this.getLists();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addItemToList() {
      try {
        if (this.newItemName.trim().length > 0) {
          let itemResponse = axios.post("/api/wishlists/" + this.selectedList._id + "/items", {
            item: this.newItemName
          });
          this.newItemName = '';
          this.selectedList.items.push((await itemResponse).data);
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteItem(item) {
      try {
        axios.delete("/api/wishlists/" + this.selectedList._id + "/items/" + item);
        this.getLists();
      } catch (error) {
        console.log(error);
      }
    }
  },
});