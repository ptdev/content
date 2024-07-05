<template>
  {{  contents }}
</template>

<script setup lang="ts">
import { queryContent } from '#imports';

const contents = await queryContent().find()
</script>