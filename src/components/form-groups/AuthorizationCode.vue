<template>
  <b-card header="Authorization Code">
    <b-card-text>
      <b-form>
        <b-form-group
          id="auth-code-auth-endpoint-label"
          label="Authorization Endpoint"
          label-for="auth-endpoint"
        >
          <b-form-input
            id="auth-code-auth-endpoint"
            type="input"
            required
            placeholder="https://accounts.google.com/o/oauth2/v2/auth"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="auth-code-client-id-label"
          label="Client Id"
          label-for="client-id"
        >
          <b-form-input
            id="auth-code-client-id"
            type="input"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="auth-code-redirect-uri-label"
          label="Redirect URI"
          label-for="redirect-uri"
        >
          <b-form-input
            id="auth-code-redirect-uri"
            type="input"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="auth-code-scope-label"
          label="Scope"
          label-for="scope"
        >
          <b-form-input
            id="auth-code-scope"
            type="input"
            required
            placeholder="profile"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="auth-code-custom-parameters-label"
          label="Form Encoded Custom Parameters (Optional)"
          label-for="custom-parameters"
        >
          <b-form-input
            id="auth-code-custom-parameters"
            type="input"
            required
            placeholder="access_type=online&include_granted_scopes=false"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="auth-code-state-label"
          label="State"
          label-for="state"
        >
          <b-form-input
            id="auth-code-state"
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
  name: 'AuthorizationCode'
}
</script>

<style scoped>
</style>
