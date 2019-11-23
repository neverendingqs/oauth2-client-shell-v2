<template>
  <b-container>
    <h1>OAuth 2.0 Client Shell</h1>
    <p>Get the <code>authorization_code</code>, <code>access_token</code> and <code>refresh_token</code> for any registered OAuth 2.0 client!</p>
    <p>This web application stores non-secrets in local storage and secrets in session storage.</p>
    <hr />

    <b-form>
      <h2>Workflow</h2>
      <b-row>
        <b-col>
          <b-form-group>
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

      <h2>Request Details</h2>
      <b-row>
        <b-col lg="6">
          <b-form-group
            id="authorization-endpoint-group"
            label="Authorization Endpoint"
            label-for="authorization-endpoint-input"
          >
            <b-form-input
              id="authorization-endpoint-input"
              v-model="form.authEndpoint"
              type="text"
              required
              placeholder="https://accounts.google.com/o/oauth2/v2/auth"
              :disabled="!isStart"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group
            id="token-endpoint-group"
            label="Token Endpoint"
            label-for="token-endpoint-input"
          >
            <b-form-input
              id="token-endpoint-input"
              v-model="form.tokenEndpoint"
              type="text"
              required
              placeholder="https://www.googleapis.com/oauth2/v4/token"
              :disabled="isStart"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group
            id="client-id-group"
            label="Client ID"
            label-for="authorization-endpoint-input"
          >
            <b-form-input
              id="client-id-input"
              v-model="form.clientId"
              type="text"
              required
              placeholder="812741506391.apps.googleusercontent.com"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group
            id="client-secret-group"
            label="Client Secret Endpoint"
            label-for="client-secret-input"
          >
            <b-form-input
              id="client-secret-input"
              v-model="form.clientSecret"
              type="text"
              required
              placeholder="abc123"
              :disabled="isStart"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group
            id="redirect-uri-group"
            label="Redirect URI"
            label-for="redirect-uri-input"
          >
            <b-form-input
              id="redirect-uri-input"
              v-model="form.redirectUri"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6">
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
        <b-col lg="6">
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
        <b-col lg="6">
          <b-form-group
            id="custom-parameters-group"
            label="Custom Parameters (Form-Encoded, Optional)"
            label-for="custom-parameters-input"
          >
            <b-form-input
              id="custom-parameters-input"
              v-model="form.customParameters"
              type="text"
              placeholder="access_type=online&include_granted_scopes=false"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <b-row v-if="isStart">
        <b-col>
          <b-button
            variant="primary"
            @click="getAuthCode"
          >
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
                v-model="form.authCode"
                type="text"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="primary"
                  v-clipboard:copy="form.authCode"
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
        <b-col lg="6">
          <b-form-group
            id="access-token-group"
            label="Access Token"
            label-for="access-token-input"
          >
            <b-input-group>
            <b-form-input
              id="access-token-input"
              v-model="form.accessToken"
              type="text"
              disabled
            ></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary"
                v-clipboard:copy="form.accessToken"
              >Copy</b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group
            id="refresh-token-group"
            label="Refresh Token"
            label-for="refresh-token-input"
          >
            <b-input-group>
              <b-form-input
                id="refresh-token-input"
                v-model="form.refreshToken"
                type="text"
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  variant="primary"
                  v-clipboard:copy="form.refreshToken"
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
import cache from './lib/cache';

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
        authEndpoint: '',
        tokenEndpoint: '',

        clientId: '',
        clientSecret:'',

        redirectUri: process.env.VUE_APP_URL,
        scope: '',

        customParameters: '',
        state: '',

        authCode: '',
        accessToken: '',
        refreshToken: ''
      },
      workflow: {
        options: ['Start', 'Authorization Code', 'Refresh Token'],
        state: 'Start'
      }
    }
  },
  methods: {
    getAuthCode() {
      cache.authEndPoint = this.form.authEndpoint;
      cache.tokenEndpoint = this.form.tokenEndpoint;
      cache.clientId = this.form.clientId;
      cache.clientSecret = this.form.clientSecret;
      cache.scope = this.form.scope;
      cache.customParameters = this.form.customParameters;
      cache.state = this.form.state;
      cache.authCode = this.form.authCode;
      cache.accessToken = this.form.accessToken;
      cache.refreshToken = this.form.refreshToken;
    }
  }
}
</script>

<style>
</style>
