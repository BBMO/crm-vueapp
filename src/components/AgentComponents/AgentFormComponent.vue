<template>
  <div>
    <q-form v-if="!isLoading" ref="formRef">
      <div class="q-py-sm q-mb-lg">
        <div class="flex justify-center">
          <q-img
            :src="form.attachment ? form.attachment : 'https://i.ibb.co/0Jmshvb/no-image.png'"
            class="bg-lightGray cursor-pointer border-radius"
            max-width="100px"
            max-height="100px"
            height="100px"
            width="100px"
            @click="openFileDialog"
          ></q-img>
        </div>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="updateImage"
        />
      </div>
      <div v-if="!props.isEdit" class="q-py-xs">
        <label>{{ $t('agent.form.username') }}</label>
        <q-input
          outlined
          dense
          v-model="form.username"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('agent.form.email') }}</label>
        <q-input
          outlined
          dense
          v-model="form.email"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div v-if="!props.isEdit" class="q-py-xs">
        <label>{{ $t('agent.form.password') }}</label>
        <q-input
          outlined
          dense
          v-model="form.password"
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        >
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="xs" @click="isPwd = !isPwd"/>
          </template>
        </q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('agent.form.firstName') }}</label>
        <q-input
          outlined
          dense
          v-model="form.first_name"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('agent.form.lastName') }}</label>
        <q-input
          outlined
          dense
          v-model="form.last_name"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
    </q-form>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
// Interfaces
import { AgentFormInterface } from 'src/interfaces/agent.interface';
// Composable
import useValidate  from 'src/composable/useValidate';
// Store
import { useAgentStore } from 'src/stores/agent.store';
// Services
import AgentsService from 'src/services/agents.service';

interface Props {
  isEdit: boolean
}
const props = defineProps<Props>()

const { validateRequired } = useValidate();
const agentStore = useAgentStore();

const isLoading = ref(false);
const isPwd = ref(true);

const fileInput = ref<HTMLElement | null>(null);

const form = ref<AgentFormInterface>({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  image: null,
  attachment: null as string | null,
});
const formRef = ref();

const agentId = computed(() => agentStore.getAgentId);
const formData = computed(() => {
  return {
    form: form.value,
  }
});

/**
 *
 */
const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const updateImage = (event: any) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        form.value.attachment = (e.target.result as string) ?? '';
        form.value.image = file;
      }
    };
    reader.readAsDataURL(file);
  }
};

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(async () => {
  if (props.isEdit) {
    isLoading.value = true;

    const { data } = await AgentsService.getAgent(agentId.value);
    form.value = {
      ...form.value,
      ...data?.data,
      image: null,
      attachment: data?.data.avatar
    }

    isLoading.value = false;
  }
})

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
