<template>
  <b-container>
    <h1>OAuth 2.0 Client Shell</h1>
    <p>Get the <code>authorization_code</code>, <code>access_token</code> and <code>refresh_token</code> for any registered OAuth 2.0 client!</p>
    <p>This web application stores non-secrets in local storage and secrets in session storage.</p>
    <hr />

    <b-form>
      <b-row>
        <b-col>
          <b-form-group label="Grant Type">
            <b-form-radio-group
              id="starting-state-group"
              v-model="workflow.state"
              :options="workflow.options"
              buttons
              name="radios-btn-default"
              button-variant="outline-primary"
            ></b-form-radio-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-form-group
            id="authorization-endpoint-group"
            label="Authorization Endpoint"
            label-for="authorization-endpoint-input"
          >
            <b-form-input
              id="authorization-endpoint-input"
              v-model="form.auth_endpoint"
              type="text"
              required
              placeholder="https://accounts.google.com/o/oauth2/v2/auth"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="token-endpoint-group"
            label="Token Endpoint"
            label-for="token-endpoint-input"
          >
            <b-form-input
              id="token-endpoint-input"
              v-model="form.token_endpoint"
              type="text"
              required
              placeholder="https://www.googleapis.com/oauth2/v4/token"
              :disabled="isStart"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
            id="client-id-group"
            label="Client ID"
            label-for="authorization-endpoint-input"
          >
            <b-form-input
              id="client-id-input"
              v-model="form.client_id"
              type="text"
              required
              placeholder="812741506391.apps.googleusercontent.com"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="client-secret-group"
            label="Client Secret Endpoint"
            label-for="client-secret-input"
          >
            <b-form-input
              id="client-secret-input"
              v-model="form.client_secret"
              type="text"
              required
              placeholder="abc123"
              :disabled="isStart"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
            id="redirect-uri-group"
            label="Redirect URI"
            label-for="redirect-uri-input"
          >
            <b-form-input
              id="redirect-uri-input"
              v-model="form.redirect_uri"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="scope-group"
            label="Scope"
            label-for="scope-input"
          >
            <b-form-input
              id="scope-input"
              v-model="form.scope"
              type="text"
              required
              placeholder="profile"
              :disabled="isAuthCode"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="isStart">
        <b-col>
          <b-form-group
            id="state-group"
            label="State"
            label-for="state-input"
          >
            <b-form-input
              id="state-input"
              v-model="form.state"
              type="text"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="custom-parameters-group"
            label="Custom Parameters (Form-Encoded, Optional)"
            label-for="custom-parameters-input"
          >
            <b-form-input
              id="custom-parameters-input"
              v-model="form.custom_parameters"
              type="text"
              placeholder="access_type=online&include_granted_scopes=false"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="isStart">
        <b-col>
          <b-button variant="primary">
            Get Authorization Code
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="isAuthCode">
        <b-col>
          <b-form-group
            id="authorization-code-group"
            label="Authorization Code"
            label-for="authorization-code-input"
          >
            <b-input-group>
              <b-form-input
                id="authorization-code-input"
                v-model="form.auth_code"
                type="text"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="primary"
                  v-clipboard:copy="form.auth_code"
                >Copy</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="isAuthCode">
        <b-col>
          <b-button variant="primary">
            Trade in Authorization Code
          </b-button>
        </b-col>
      </b-row>

      <b-row v-if="isRefreshToken">
        <b-col>
          <b-form-group
            id="access-token-group"
            label="Access Token"
            label-for="access-token-input"
          >
            <b-input-group>
            <b-form-input
              id="access-token-input"
              v-model="form.access_token"
              type="text"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary"
                v-clipboard:copy="form.access_token"
              >Copy</b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="refresh-token-group"
            label="Refresh Token"
            label-for="refresh-token-input"
          >
            <b-input-group>
              <b-form-input
                id="refresh-token-input"
                v-model="form.refresh_token"
                type="text"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="primary"
                  v-clipboard:copy="form.refresh_token"
                >Copy</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="isRefreshToken">
        <b-col>
          <b-button variant="primary">
            Trade in Refresh Token
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  computed: {
    isAuthCode() {
      return this.workflow.state === 'Authorization Code';
    },
    isRefreshToken() {
      return this.workflow.state === 'Refresh Token';
    },
    isStart() {
      return this.workflow.state === 'Start';
    },
  },
  data() {
    return {
      form: {
        auth_endpoint: '',
        token_endpoint: '',

        client_id: '',
        client_secret:'',

        redirect_uri: process.env.VUE_APP_URL,
        scope: '',

        custom_parameters: '',
        state: '',

        auth_code: '',
        refresh_token: ''
      },
      workflow: {
        options: ['Start', 'Authorization Code', 'Refresh Token'],
        state: 'Start'
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
