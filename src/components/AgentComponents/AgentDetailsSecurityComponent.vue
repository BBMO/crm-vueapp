<template>
  <q-card class="full-width">
    <div class="q-pa-md flex column">
      <h6 class="text-subtitle1 q-ma-none text-weight-medium">{{ $t('global.security') }}</h6>

      <q-form>
        <div class="flex no-wrap gap-sm q-mb-md q-mt-xl">
          <div class="w-50">
            <q-input
              outlined
              dense
              v-model="password"
              :label="$t('auth.newPassword')"
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="xs" @click="isPwd = !isPwd"/>
              </template>
            </q-input>
          </div>
          <div class="w-50">
            <q-input
              outlined
              dense
              v-model="confirmPassword"
              :label="$t('auth.confirmPassword')"
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="xs" @click="isPwd = !isPwd"/>
              </template>
            </q-input>
          </div>
        </div>

        <q-btn type="submit" color="primary" class="text-capitalize q-px-lg" :ripple="false">Login</q-btn>
      </q-form>

    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isPwd = ref(true);
const password = ref('');
const confirmPassword = ref('');

</script>

<style scoped lang="scss">
.w-50 {
  width: 50%;
}
</style>
