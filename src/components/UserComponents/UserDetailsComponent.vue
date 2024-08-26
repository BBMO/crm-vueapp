<template>
  <q-card class="flex column gap-lg q-pa-lg">
    <div class="flex column items-center">
      <q-avatar rounded size="100px" color="primary" text-color="white">
        <img :src="userDetails.image" alt="">
      </q-avatar>
      <p class="text-subtitle1 text-weight-medium q-my-sm">{{ userDetails.first_name }} {{ userDetails.last_name }}</p>
      <q-chip square class="text-weight-medium" color="grey-2" text-color="grey">
        {{ userDetails.role }}
      </q-chip>
    </div>
    <div class="flex gap-md stats-details-section">
      <div class="flex items-center gap-sm">
        <q-icon size="sm" color="primary" name="mdi-cash-check" class="bg-secondary q-pa-sm" />
        <div class="flex column items-start">
          <span class="text-capitalize text-weight-medium">{{ userDetails.amount_negotiations }}</span>
          <span class="text-capitalize text-weight-regular text-grey-5">{{ $t('user.amountNegotiations') }}</span>
        </div>
      </div>
      <div class="flex items-center gap-sm">
        <q-icon size="sm" color="primary" name="mdi-home-group" class="bg-secondary q-pa-sm" />
        <div class="flex column items-start">
          <span class="text-capitalize text-weight-medium">{{ userDetails.amount_negotiations }}</span>
          <span class="text-capitalize text-weight-regular text-grey-5">{{ $t('user.numberProperties') }}</span>
        </div>
      </div>
    </div>
    <div class="flex column gap-sm">
      <p class="text-subtitle1 text-weight-medium q-ma-none">{{ $t('global.details') }}</p>
      <q-separator />
      <div class="q-pt-xs">
        <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('user.identification') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ userDetails.identification }}</span></p>
        <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('user.email') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ userDetails.email }}</span></p>
        <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('user.phone') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ userDetails.phone }}</span></p>
        <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('user.address') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ userDetails.address }}</span></p>
      </div>
    </div>
    <div class="flex justify-center gap-sm">
      <q-btn color="primary" class="q-px-lg" :ripple="false">{{ $t('global.edit') }}</q-btn>
      <q-btn color="red-2" class="q-px-lg shadow-0 text-red" :ripple="false">{{ $t('global.suspend') }}</q-btn>
    </div>
  </q-card>
</template>

<script setup lang="ts">

const userDetails = {
  image: 'https://quasar-prime-admin-template.netlify.app/assets/avatar-1-DMk2FF1-.png',
  role: 'Admin',
  first_name: 'Selina',
  last_name: 'Kyle',
  identification : 'V-26.841.892',
  email: 'irena,dubronvnawayne.com',
  phone: '(123) 123-1234',
  address: 'San Cristóbal',
  amount_negotiations: '1.23K',
  number_properties: '125'
}

</script>

<style scoped lang="scss">
.stats-details-section {
  .q-icon {
    border-radius: 5px;
  }
}
</style>
