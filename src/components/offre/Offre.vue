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
    console.log("Données reçues:", response.data);

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
      await updateOffre(currentId.value, {
        descriptionOffre: form.descriptionOffre,
        prixOffre: form.prixOffre,
        disponibiliteOffre: form.disponibiliteOffre,
        idAgence: form.idAgence,
      });
      console.log("Offre modifiée");
    } else {
      await createOffre({
        descriptionOffre: form.descriptionOffre,
        prixOffre: form.prixOffre,
        disponibiliteOffre: form.disponibiliteOffre,
        idAgence: form.idAgence,
      });
      console.log("Offre créée");
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
    console.log("Offre supprimée");
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
  <div>
    <h2>Liste des offres</h2>

    <div v-if="errorMsg" style="color: red; margin-bottom: 1em;">{{ errorMsg }}</div>

    <!-- Debug affichage JSON -->
    <pre>{{ JSON.stringify(offres, null, 2) }}</pre>

    <table border="1" cellspacing="0" cellpadding="5" v-if="offres.length > 0">
      <thead>
        <tr>
          <th>Description</th>
          <th>Prix</th>
          <th>Disponibilité</th>
          <th>ID Agence</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offre in offres" :key="offre.idOffre">
          <td>{{ offre.descriptionOffre }}</td>
          <td>{{ offre.prixOffre }}</td>
          <td>{{ offre.disponibiliteOffre }}</td>
          <td>{{ offre.idAgence }}</td>
          <td>
            <button @click="remplirForm(offre)">Modifier</button>
            <button @click="supprimerOffre(offre.idOffre)" style="color: red;">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>Aucune offre disponible</p>

    <h3 style="margin-top: 2em;">{{ isEditing ? "Modifier une offre" : "Ajouter une offre" }}</h3>
    <form @submit.prevent="submitForm" style="margin-top: 1em;">
      <div>
        <label>Description :</label><br />
        <input v-model="form.descriptionOffre" type="text" required />
      </div>
      <div>
        <label>Prix :</label><br />
        <input v-model.number="form.prixOffre" type="number" min="0" required />
      </div>
      <div>
        <label>Disponibilité :</label><br />
        <input v-model="form.disponibiliteOffre" type="text" required />
      </div>
      <div>
        <label>ID Agence :</label><br />
        <input v-model.number="form.idAgence" type="number" min="0" required />
      </div>
      <button type="submit" style="margin-top: 1em;">{{ isEditing ? "Mettre à jour" : "Ajouter" }}</button>
      <button type="button" @click="resetForm" style="margin-left: 1em;">Annuler</button>
    </form>
  </div>
</template>
