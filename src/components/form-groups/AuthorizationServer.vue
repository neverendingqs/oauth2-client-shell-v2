<template>
  <b-card header="Authorization Server">
    <b-card-text>
      <b-form>
        <b-form-group
          id="auth-endpoint-label"
          label="Authorization Endpoint"
          label-for="auth-endpoint"
        >
          <b-form-input
            id="auth-endpoint"
            type="input"
            required
            placeholder="https://accounts.google.com/o/oauth2/v2/auth"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="token-endpoint-label"
          label="Token Endpoint"
          label-for="token-endpoint"
        >
          <b-form-input
            id="token-endpoint"
            type="input"
            required
            placeholder="https://www.googleapis.com/oauth2/v4/token"
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
