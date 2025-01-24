<template>
  <header>
    <!--- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Personal Inventory Tracker</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/add" class="nav-link">Add</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/search" class="nav-link">Search</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
  
  <div class="main-container"><div class="form-container">
    <div class="form-icon d-flex align-items-center justify-content-center">
        <i class="fas fa-boxes fa-10x"></i>
      </div>
      <h2 class="text-center mb-4 mt-4" >Add New Item</h2>
      <form @submit.prevent="addItem">
        <div class="mb-3">
          <!-- Vuelidate validation color change for label -->
          <label for="itemName" class="form-label" :class="{ 'text-danger': $v.itemName.$error }">Item Name</label>
          <!-- Trimming the input to remove any whitespaces or unwanted characters-->
           <!-- When the input loses focus from the cursor, blur ensures that the validation is updated as soon as the user leaves the input field
            This helps notify the user that if anything is invalid in the input string, it will be shown immediately.
            if the value turns out to be invalid, the label will show an error message and the input box will glow red.
             The same applies to itemQuantity and ItemCode-->
          <input
            type="text"
            class="form-control"
            id="itemName"
            v-model.trim="itemName"
            @blur="$v.itemName.$touch()"
            :class="{ 'is-invalid': $v.itemName.$error }"
            :placeholder="$v.itemName.$error ? 'Item name is required' : 'Enter item name'"
          >
          <div v-if="$v.itemName.$error" class="text-danger mt-1">Item name must be alphabetical characters only.</div>

        </div>
        <div class="mb-3">
          <label for="itemQuantity" class="form-label" :class="{ 'text-danger': $v.itemQuantity.$error }">Quantity</label>
          <input
            type="number"
            class="form-control"
            id="itemQuantity"
            v-model.trim="itemQuantity"
            @blur="$v.itemQuantity.$touch()"
            :class="{ 'is-invalid': $v.itemQuantity.$error }"
            :placeholder="$v.itemQuantity.$error ? 'Quantity is required' : 'Enter quantity'"
          >
          <div v-if="$v.itemQuantity.$error" class="text-danger mt-1">Quantity must be a positive number, under 100 and only contain digits.</div>

        </div>
        <div class="mb-3">
          <label for="itemCode" class="form-label" :class="{ 'text-danger': $v.itemCode.$error }">Item Code</label>
          <input
            type="text"
            class="form-control"
            id="itemCode"
            v-model.trim="itemCode"
            @blur="$v.itemCode.$touch()"
            :class="{ 'is-invalid': $v.itemCode.$error }"
            :placeholder="$v.itemCode.$error ? 'Item code is required' : 'Enter item code'"
          >
          <div v-if="$v.itemCode.$error" class="text-danger mt-1">Item code must be alphanumerical.</div>

        </div>
        <button type="submit" class="btn btn-primary w-100" :disabled="$v.$invalid">Add Item</button>
      </form>
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>
    </div>
  </div>
    

  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
    <div id="successToast" class="toast bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Item added successfully!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minValue, maxValue } from '@vuelidate/validators';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

const itemName = ref('');
const itemQuantity = ref('');
const itemCode = ref('');
const errorMessage = ref('');

// setting the acceptable characters to be used in the itemCode input.
const isAlphaNumeric = (str) => /^[a-zA-Z0-9]*$/gi.test(str);

// rules for validation, itemName can onyl be alphabetical characters, itemQuantity can only be a number and itemCode can only be alphanumeric
const rules = {
  itemName: { required, isNaN },
  itemQuantity: { required, minValue: minValue(1), maxValue: maxValue(100) },
  itemCode: { required, isAlphaNumeric }
};

// this will be used in the input vlaidtion process
const $v = useVuelidate(rules, { itemName, itemQuantity, itemCode });


const addItem = async () => {
  $v.value.$touch();
  if ($v.value.$invalid) {
    return;
  }

  try {
    // constructor for the newItem declaring its values in the parameters
    const newItem = {
      name: itemName.value,
      quantity: itemQuantity.value,
      code: itemCode.value
    };

    // posting the item to firebase
    const addResponse = await fetch('https://vueusers-18567-default-rtdb.europe-west1.firebasedatabase.app/items.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    });

    if (!addResponse.ok) {
      throw new Error('Failed to add item');
    }

    // Clear the form fields
    itemName.value = '';
    itemQuantity.value = '';
    itemCode.value = '';
    $v.value.$reset();
    errorMessage.value = '';

    // Show success toast notification
    const toastEl = document.getElementById('successToast');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  } catch (error) {
    console.error(error);
    errorMessage.value = 'An error occurred while adding the item.';
    clearErrorMessage();
  }
};

const clearErrorMessage = () => {
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};
</script>

<style scoped>
.is-invalid {
  border-color: red;
  box-shadow: 0 0 5px red;
}

.text-danger {
  color: red !important;
}

.form-container {
  background-color: #dadada;
  padding: 40px;
  border-radius: 10px;
  width: 100%;
  box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
  max-width: 1000px;
}

.toast {
  width: 350px;
  height: 150px;
  font-size: 1.2rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.form-container input {
  font-family: 'Courier New', Courier, monospace;
  padding: 10px;
}

.main-container {
  display: flex;
  justify-content: center;
  margin-top: 5%;
  height: 80vh;

}

.navbar {
  background-color: #7E99A3 !important;
}

.navbar-brand, .nav-link {
  color: #F4EDD3 !important;
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
}

.nav-link:hover {
  color: #4A628A !important;
  background-color: #F4EDD3; /* Add scale transform on hover */
}

@media screen and (max-width: 990px) {
  .content {
    flex-direction: column-reverse;
    align-items: center;
  }

  img {
    margin-bottom: 20px;
  }
  .main-container {
    display: flex;
    justify-content: center;
    margin: 0;
    width: 90%;
  }
}

.navbar-collapse {
  justify-content: flex-end;
}
</style>