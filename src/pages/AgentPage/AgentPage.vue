<template>
  <q-page class="q-page-general">
    <div>
      <agent-component />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Composable
import useRole from 'src/composable/useRole';
// Components
import AgentComponent from 'components/AgentComponents/AgentComponent.vue';

const router = useRouter();
const { getIsAdmin } = useRole();

onMounted(() => {
  /**
   * Redirect to home if user is not admin
   */
  if (!getIsAdmin()) {
    router.push({ name: 'home' });
  }
});
</script>

<style scoped lang="scss">

</style>
