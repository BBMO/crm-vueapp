<template>
  <div class="q-pa-lg full-width flex column justify-center login-component-container">
    <div class="q-py-lg column justify-center items-center logo-title">
      <h5 class="full-width q-ma-none q-mb-sm">{{ $t('global.welcome') }}</h5>
      <p class="full-width text-grey">{{ $t('global.welcomeMessage') }}</p>
    </div>
    <q-form>
      <div class="flex column gap-lg">
        <q-input
          outlined
          dense
          v-model="user"
          :label="$t('global.email')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
        <q-input
          outlined
          dense
          v-model="password"
          :label="$t('global.password')"
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="xs"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="flex justify-end q-my-md">
        <p class="text-primary cursor-pointer" style="width: fit-content;">Forgot Password?</p>
      </div>
      <q-btn type="submit" color="primary" class="full-width text-capitalize">Login</q-btn>
    </q-form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// Composable
import useValidate  from 'src/composable/useValidate';

const { validateRequired } = useValidate();

const isPwd = ref(true);
const user = ref('');
const password = ref('');

</script>

<style lang="scss" scoped>
.login-component-container {
  max-width: 450px;
}
</style>
