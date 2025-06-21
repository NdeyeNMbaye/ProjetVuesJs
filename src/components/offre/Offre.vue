<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getAllOffres, deleteOffre, createOffre, updateOffre } from '../../services/offreService.js';

const offres = ref([]);
const errorMsg = ref("");
const isEditing = ref(false);
const currentId = ref(null);

const form = reactive({
  descriptionOffre: "",
  prixOffre: null,
  disponibiliteOffre: "",
  idAgence: null,
});

async function loadOffres() {
  try {
    const response = await getAllOffres();
    if (Array.isArray(response.data)) {
      offres.value = response.data;
    } else if (response.data && Array.isArray(response.data.offres)) {
      offres.value = response.data.offres;
    } else {
      offres.value = [];
      errorMsg.value = "Format de données inattendu.";
      return;
    }
    errorMsg.value = "";
  } catch (error) {
    console.error("Erreur chargement offres :", error);
    errorMsg.value = "Erreur lors du chargement des offres.";
  }
}

function resetForm() {
  form.descriptionOffre = "";
  form.prixOffre = null;
  form.disponibiliteOffre = "";
  form.idAgence = null;
  currentId.value = null;
  isEditing.value = false;
}

function remplirForm(offre) {
  form.descriptionOffre = offre.descriptionOffre || "";
  form.prixOffre = offre.prixOffre || null;
  form.disponibiliteOffre = offre.disponibiliteOffre || "";
  form.idAgence = offre.idAgence || null;
  currentId.value = offre.idOffre || null;
  isEditing.value = true;
}

async function submitForm() {
  try {
    if (isEditing.value && currentId.value !== null) {
      await updateOffre(currentId.value, { ...form });
    } else {
      await createOffre({ ...form });
    }
    resetForm();
    await loadOffres();
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    errorMsg.value = "Erreur lors de l'enregistrement des données.";
  }
}

async function supprimerOffre(id) {
  if (!confirm("Confirmer la suppression ?")) return;
  try {
    await deleteOffre(id);
    await loadOffres();
  } catch (error) {
    console.error("Erreur suppression :", error);
    errorMsg.value = "Erreur lors de la suppression.";
  }
}

onMounted(() => {
  loadOffres();
});
</script>

<template>
  <div class="container">
    <h2>Gestion des Offres</h2>

    <div v-if="errorMsg" class="error">{{ errorMsg }}</div>

    <h3>{{ isEditing ? "Modifier une offre" : "Ajouter une nouvelle offre" }}</h3>
    <form @submit.prevent="submitForm" class="offer-form">
      <label>
        Description :
        <input v-model="form.descriptionOffre" type="text" required />
      </label>
      <label>
        Prix (€) :
        <input v-model.number="form.prixOffre" type="number" min="0" required />
      </label>
      <label>
        Disponibilité :
        <input v-model="form.disponibiliteOffre" type="text" required />
      </label>
      <label>
        ID Agence :
        <input v-model.number="form.idAgence" type="number" min="0" required />
      </label>
      <div class="form-buttons">
        <button type="submit" class="save-btn">{{ isEditing ? "Mettre à jour" : "Ajouter" }}</button>
        <button type="button" class="cancel-btn" @click="resetForm">Annuler</button>
      </div>
    </form>

    <h3 style="margin-top: 30px;">Liste des Offres</h3>

    <div v-if="offres.length > 0" class="card-grid">
      <div class="offer-card" v-for="offre in offres" :key="offre.idOffre">
        <h4>{{ offre.descriptionOffre }}</h4>
        <p><strong>Prix:</strong> {{ offre.prixOffre }} €</p>
        <p><strong>Disponibilité:</strong> {{ offre.disponibiliteOffre }}</p>
        <p><strong>ID Agence:</strong> {{ offre.idAgence }}</p>
        <div class="card-buttons">
          <button class="edit-btn" @click="remplirForm(offre)">Modifier</button>
          <button class="delete-btn" @click="supprimerOffre(offre.idOffre)">Supprimer</button>
        </div>
      </div>
    </div>

    <p v-else class="no-data">Aucune offre disponible.</p>
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

h3 {
  margin-top: 30px;
  color: #007BFF;
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
