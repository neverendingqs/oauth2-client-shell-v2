<template>
  <b-card header="Client">
    <b-card-text>
      <b-form>
        <b-form-group
          id="client-id-label"
          label="Client Id"
          label-for="client-id"
        >
          <b-form-input
            id="client-id"
            type="input"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="client-secret-label"
          label="Client Secret"
          label-for="client-secret"
        >
          <b-form-input
            id="client-secret"
            type="input"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="redirect-uri-label"
          label="Redirect URI"
          label-for="redirect-uri"
        >
          <b-form-input
            id="redirect-uri"
            type="input"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-card-text>
  </b-card>
</template>

<script>
export default {
  name: 'AuthorizationServer'
}
</script>

<style scoped>
</style>
