<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllVoyages, deleteVoyage, createVoyage, updateVoyage } from '../../services/voyageService.js';

const voyages = ref([]);
const errorMsg = ref("");
const isEditing = ref(false);
const currentId = ref(null);

const form = reactive({
  destination: "",
  dateDepart: "",
  dateArrivee: "",
  prix: null,
});

async function loadVoyages() {
  try {
    const response = await getAllVoyages();
    if (Array.isArray(response.data)) {
      voyages.value = response.data;
    } else if (response.data && Array.isArray(response.data.voyages)) {
      voyages.value = response.data.voyages;
    } else {
      voyages.value = [];
      errorMsg.value = "Format de données inattendu.";
      return;
    }
    errorMsg.value = "";
  } catch (error) {
    console.error("Erreur chargement voyages :", error);
    errorMsg.value = "Erreur lors du chargement des voyages.";
  }
}

function resetForm() {
  form.destination = "";
  form.dateDepart = "";
  form.dateArrivee = "";
  form.prix = null;
  currentId.value = null;
  isEditing.value = false;
}

function remplirForm(voyage) {
  form.destination = voyage.destination || "";
  form.dateDepart = voyage.dateDepart ? voyage.dateDepart.slice(0, 10) : ""; // format yyyy-mm-dd
  form.dateArrivee = voyage.dateArrivee ? voyage.dateArrivee.slice(0, 10) : "";
  form.prix = voyage.prix || null;
  currentId.value = voyage.idVoyage || null;
  isEditing.value = true;
}

async function submitForm() {
  try {
    if (isEditing.value && currentId.value !== null) {
      await updateVoyage(currentId.value, { ...form });
    } else {
      await createVoyage({ ...form });
    }
    resetForm();
    await loadVoyages();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    errorMsg.value = "Erreur lors de l'enregistrement des données.";
  }
}

async function supprimerVoyage(id) {
  if (!confirm("Confirmer la suppression ?")) return;
  try {
    await deleteVoyage(id);
    await loadVoyages();
  } catch (error) {
    console.error("Erreur suppression :", error);
    errorMsg.value = "Erreur lors de la suppression.";
  }
}

onMounted(() => {
  loadVoyages();
});
</script>

<template>
  <div class="container">
    <h2>Gestion des Voyages</h2>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

    <h3>{{ isEditing ? "Modifier un voyage" : "Ajouter un nouveau voyage" }}</h3>
    <form @submit.prevent="submitForm" class="offer-form">
      <label>
        Destination :
        <input v-model="form.destination" type="text" required />
      </label>
      <label>
        Date Départ :
        <input v-model="form.dateDepart" type="date" required />
      </label>
      <label>
        Date Arrivée :
        <input v-model="form.dateArrivee" type="date" required />
      </label>
      <label>
        Prix (FCFA) :
        <input v-model.number="form.prix" type="number" min="0" required />
      </label>
      <div class="form-buttons">
        <button type="submit" class="save-btn">{{ isEditing ? "Mettre à jour" : "Ajouter" }}</button>
        <button type="button" class="cancel-btn" @click="resetForm">Annuler</button>
      </div>
    </form>

    <h3 style="margin-top: 30px;">Liste des Voyages</h3>

    <div v-if="voyages.length > 0" class="card-grid">
      <div class="offer-card" v-for="voyage in voyages" :key="voyage.idVoyage">
        <h4>{{ voyage.destination }}</h4>
        <p><strong>Date Départ:</strong> {{ voyage.dateDepart.slice(0, 10) }}</p>
        <p><strong>Date Arrivée:</strong> {{ voyage.dateArrivee.slice(0, 10) }}</p>
        <p><strong>Prix:</strong> {{ voyage.prix }} FCFA</p>
        <div class="card-buttons">
          <button class="edit-btn" @click="remplirForm(voyage)">Modifier</button>
          <button class="delete-btn" @click="supprimerVoyage(voyage.idVoyage)">Supprimer</button>
        </div>
      </div>
    </div>

    <p v-else class="no-data">Aucun voyage disponible.</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 15px;
  background: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 0 10px #ddd;
}

h2, h3 {
  text-align: center;
  color: #333;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}

.offer-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
}

.offer-form label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
  color: #555;
}

.offer-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: #28a745;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ffc107;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.offer-card {
  background: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 6px #ccc;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.offer-card h4 {
  margin: 0 0 5px;
  color: #333;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.edit-btn {
  background-color: #007BFF;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.no-data {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
