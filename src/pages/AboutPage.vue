<template>
  <q-page class="q-page-general about-container">
    <q-card class="row q-pa-md">
      <div class="col-sm-7 col-12 q-pa-sm flex column gap-xl">
        <div>
          <h6 class="q-mt-none q-mb-sm">{{ $t('about.title') }}</h6>
          <p class="q-my-md text-weight-regular text-justify">{{ $t('about.topDescription') }}</p>
          <p class="q-my-md text-weight-regular text-justify">{{ $t('about.bottomDescription') }}</p>
        </div>
        <div class="develop-by">
          <p class="q-mb-xs text-grey text-italic">{{ $t('about.developedBy') }} :</p>
          <p class="q-ma-none text-grey text-italic">
            <a href="mailto:brayan.montanez@unet.edu.ve">Brayan Montañez</a> | <a href="mailto:kimberly.morales@unet.edu.ve">Kimberly Morales</a>
          </p>
          <div class="q-mt-lg q-mb-md q-pa-sm bg-blue-1 text-blue version-message">
            <p class="q-ma-none">{{ $t('about.versionMessage') }}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-1 col-12 q-pa-sm flex justify-center">
        <q-separator class="full-width q-separator-horizontal" />
        <q-separator vertical class="full-height q-separator-vertical" />
      </div>
      <div class="col-sm-4 col-12 q-pa-sm">
        <h6 class="q-mt-none q-mb-sm">{{ $t('about.documentation') }}</h6>
        <div class="q-py-md download-documentation">
          <p class="q-my-sm text-weight-medium">{{ $t('about.userManual') }}</p>
          <q-btn color="primary" icon="mdi-open-in-new" :ripple="false">{{ $t('about.open') }}</q-btn>
        </div>
        <div class="q-py-md download-documentation">
          <p class="q-my-sm text-weight-medium">{{ $t('about.developerDocumentation') }}</p>
          <q-btn color="primary" icon="mdi-open-in-new" :ripple="false">{{ $t('about.open') }}</q-btn>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.about-container {
  .q-separator-horizontal { display: none; }

  .develop-by {
    font-size: 12px;

    a {
      color: $grey;
      text-decoration: none;
    }
  }

  .version-message {
    border-radius: 5px;
    border: 1px solid $blue;
  }

  .download-documentation {
    p { font-size: 16px; }
  }

  @media screen and (max-width: 599px) {
    .q-separator-horizontal { display: block; }
    .q-separator-vertical { display: none; }
  }
}
</style>
