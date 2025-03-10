<!--
This Vue component represents the home page of the Personal Inventory Tracker application.
It includes a navigation bar, a list of inventory items, and an edit form for updating items.

Template:
- Header with a navigation bar containing links to Home, Add, and Search pages.
- Main section displaying a list of inventory items with options to edit or delete each item.
- Edit form for updating selected inventory items, which appears when an item is being edited.
- Toast notification that appears when an item is successfully updated.

Script:
- Uses Vue's Composition API with `ref` to manage reactive state.
- `items`: A reactive reference to store the list of inventory items.
- `editItem`: A reactive reference to store the item being edited.
- `isEditing`: A reactive reference to track whether the edit form is visible.
- `modifiedItemId`: A reactive reference to highlight the recently modified item.
- `fetchItems`: An asynchronous function to fetch items from a Firebase database.
- `openEditForm`: A function to open the edit form with the selected item's data.
- `closeEditForm`: A function to close the edit form.
- `updateItem`: An asynchronous function to update the item in the Firebase database.
- `deleteItem`: An asynchronous function to delete the item from the Firebase database.

Styles:
- Scoped CSS to style the component.
- Flexbox layout for the container and edit form.
- Custom styles for the navigation bar, main container, edit form, and toast notification.
- Animations for highlighting modified items and transitioning the edit form.

Dependencies:
- Vue.js
- Vuelidate for form validation
- Bootstrap for styling
-->
<template>
  
    <main class="container mt-4 main-container" :class="{ 'shift-left': isEditing }">
      <h2>Inventory Items</h2>
      <ul class="list-group" style="max-height: 70vh; overflow-y: auto;">
        <li v-if="items.length === 0" class="list-group-item text-center">No items in the inventory</li>
        <li v-for="item in items" :key="item.code" :class="{ 'highlight': item.id === modifiedItemId }" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5><strong>{{ item.name }}</strong></h5>
            <p>Quantity: {{ item.quantity }}</p>
            <p>Item Code: <strong>{{ item.code }}</strong></p>
          </div>
          <div>
            <button class="btn btn-warning btn-sm me-2" @click="openEditForm(item)">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteItem(item.id)">Delete</button>
          </div>
        </li>
      </ul>
    </main>
  
    <div class="edit-form-container" :class="{ 'show': isEditing }">
      <form @submit.prevent="updateItem">
        <h2>Edit Item</h2>
        <div class="mb-3">
          <label for="editItemName" class="form-label">Item Name</label>
          <input type="text" class="form-control" id="editItemName" v-model.trim="$v.editItem.name.$model">
        </div>
        <div class="mb-3">
          <label for="editItemQuantity" class="form-label">Quantity</label>
          <input type="number" class="form-control" id="editItemQuantity" v-model.trim="$v.editItem.quantity.$model">
        </div>
        <div class="mb-3">
          <label for="editItemCode" class="form-label">Item Code</label>
          <input type="text" class="form-control" id="editItemCode" v-model.trim="$v.editItem.code.$model" disabled>
        </div>
        <button type="submit" class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" @click="closeEditForm">Cancel</button>
      </form>
    </div>
  
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
      <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Item updated successfully!
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import useVuelidate from '@vuelidate/core';
  import { required, minValue } from '@vuelidate/validators';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import * as bootstrap from 'bootstrap';
  
  const items = ref([]);
  const editItem = ref({});
  const isEditing = ref(false);
  const modifiedItemId = ref(null);
  
  const rules = {
    editItem: {
      name: { required },
      quantity: { required, minValue: minValue(1) },
      code: { required }
    }
  };
  
  const $v = useVuelidate(rules, { editItem });
  
  const fetchItems = async () => {
    try {
      const response = await fetch('https://vueusers-18567-default-rtdb.europe-west1.firebasedatabase.app/items.json');
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      items.value = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
    } catch (error) {
      console.error(error);
    }
  };
  
  const openEditForm = (item) => {
    editItem.value = { ...item };
    isEditing.value = true;
  };
  
  const closeEditForm = () => {
    isEditing.value = false;
  };
  
  const updateItem = async () => {
    $v.value.$touch();
    if ($v.value.$invalid) {
      return;
    }
  
    try {
      const response = await fetch(`https://vueusers-18567-default-rtdb.europe-west1.firebasedatabase.app/items/${editItem.value.id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editItem.value.name,
          quantity: editItem.value.quantity
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
  
      // Update the items list
      const index = items.value.findIndex(item => item.id === editItem.value.id);
      if (index !== -1) {
        items.value[index] = { ...editItem.value };
      }
  
      // Show toast notification
      const toastEl = document.getElementById('liveToast');
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
  
      // Highlight the modified item
      modifiedItemId.value = editItem.value.id;
      setTimeout(() => {
        modifiedItemId.value = null;
      }, 2000);
  
      closeEditForm();
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteItem = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this item?');
    if (!confirmed) {
      return;
    }
  
    try {
      const response = await fetch(`https://vueusers-18567-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
  
      // Remove the item from the items list
      items.value = items.value.filter(item => item.id !== id);
    } catch (error) {
      console.error(error);
    }
  };
  
  onMounted(fetchItems);
  </script>
  
  <style scoped>


.btn-secondary{
  margin-left: 10px;
}

.nav-link:hover {
  color: #4A628A !important;
  background-color: #F4EDD3; /* Add scale transform on hover */
}
  
  .main-container {
    width: 60%;
    transition: transform 0.7s ease-in-out;
  }
  
  .shift-left {
    transform: translateX(-33%);
  }
  
  .edit-form-container {
    position: fixed;
    top: 0;
    right: -40%;
    width: 40%;
    height: 100%;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    transition: right 0.7s ease-in-out;
    padding: 20px;
    z-index: 1040;
  }

    .edit-form-container form {
        margin-top: 80px;
    }

    @media (max-width: 428px) {
        .main-container {
            width: 100%;
        }
        .edit-form-container {
          margin-top: 60px;
            width: 100%;
            right: -100%;
        }
    }
  
  .edit-form-container.show {
    right: 0;
  }
  
  .highlight {
    animation: highlight-animation 2s ease-in-out;
  }
  
  @keyframes highlight-animation {
    0% { background-color: #7E99A3; }
    100% { background-color: white; }
  }


  .list-group{
    background-color: #7E99A3;
    padding: 20px;
  }

  .list-group-item{
    margin-top: 10px;
    padding: 20px;
    border-radius: 10px;
  }
  </style>