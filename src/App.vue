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
              placeholder="https://accounts.google.com/o/oauth2/v2/auth"
              :disabled="!isStart"
              :required="isStart"
              :state="!isStart || form.authEndpoint.length > 0 ? null : false"
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
              placeholder="https://www.googleapis.com/oauth2/v4/token"
              :disabled="isStart"
              :required="!isStart"
              :state="isStart || form.tokenEndpoint.length > 0 ? null : false"
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
              placeholder="812741506391.apps.googleusercontent.com"
              required
              :state="form.clientId.length > 0 ? null : false"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group
            id="client-secret-group"
            label="Client Secret"
            label-for="client-secret-input"
          >
            <b-form-input
              id="client-secret-input"
              v-model="form.clientSecret"
              type="text"
              placeholder="abc123"
              :disabled="isStart"
              :required="!isStart"
              :state="isStart || form.clientSecret.length > 0 ? null : false"
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
              disabled
              required
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
              placeholder="profile"
              :disabled="isAuthCode"
              :required="!isAuthCode"
              :state="isAuthCode || form.scope.length > 0 ? null : false"
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
              :state="form.state.length > 0 ? null : false"
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
                required
                :state="form.authCode.length > 0 ? null : false"
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
          <b-button
            variant="primary"
            @click="tradeInAuthCode"
          >
            Trade in Authorization Code <b-spinner small v-if="workflow.showSpinner" />
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
                required
                :state="form.refreshToken.length > 0 ? null : false"
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
          <b-button
            variant="primary"
            @click="tradeInRefreshToken"
          >
            Trade in Refresh Token <b-spinner small v-if="workflow.showSpinner" />
          </b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <footer class="text-center">
      <i>Source code is available on <a href="https://github.com/neverendingqs/oauth2-client-shell-v2" target="_blank" rel="noopener noreferrer">GitHub</a>.</i>
    </footer>
  </b-container>
</template>

<script>
import rand from 'csprng';
import cache from './lib/cache';
import { START, AUTH_CODE, REFRESH_TOKEN } from './lib/workflowStates';

function objToFormEncoded(obj) {
  return Object.entries(obj)
    .reduce(
      (acc, [key, value]) => acc
        ? `${acc}&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      ''
    );
}

function generateState() {
  return rand(256, 36);
}

export default {
  name: 'app',
  components: {
  },
  computed: {
    isAuthCode() {
      return this.workflow.state === AUTH_CODE;
    },
    isRefreshToken() {
      return this.workflow.state === REFRESH_TOKEN;
    },
    isStart() {
      return this.workflow.state === START;
    }
  },
  data() {
    return {
      form: {
        authEndpoint: cache.authEndPoint,
        tokenEndpoint: cache.tokenEndpoint,

        clientId: cache.clientId,
        clientSecret: cache.clientSecret,

        redirectUri: '',
        scope: cache.scope,

        customParameters: cache.customParameters,
        state: cache.state || generateState(),

        authCode: cache.authCode,
        accessToken: cache.accessToken,
        refreshToken: cache.refreshToken
      },
      workflow: {
        options: [START, AUTH_CODE, REFRESH_TOKEN],
        showSpinner: false,
        state: START
      }
    };
  },
  methods: {
    getAuthCode() {
      this.updateAllCacheValues();
      let query = objToFormEncoded({
        response_type: 'code',
        redirect_uri: this.form.redirectUri,
        client_id: this.form.clientId,
        scope: this.form.scope,
        state: this.form.state
      });

      if(this.form.customParameters) {
        query += `&${this.form.customParameters}`;
      }

      window.location.href = `${this.form.authEndpoint}?${query}`;
    },
    handleError(msg, workflowStateOnError = START) {
      this.$bvToast.toast(msg, {
        appendToast: false,
        noAutoHide: true,
        solid: true,
        title: 'Error',
        toaster: 'b-toaster-bottom-center',
        variant: 'danger'
      });

      this.workflow.state = workflowStateOnError;
    },
    async requestTokens(body, workflowStateOnError) {
      this.workflow.showSpinner = true;
      const response = await fetch(this.form.tokenEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${this.form.clientId}:${this.form.clientSecret}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: objToFormEncoded(body)
      });

      if(!response.ok) {
        const responseText = await response.text();
        this.handleError(
          `Authorization server rejected the request with a status code of '${response.status}'. `
            + `Body: '${responseText}'`,
          workflowStateOnError
        );
      }

      try {
        const { access_token, refresh_token } = await response.json();
        return { access_token, refresh_token };
      } catch (err) {
        const responseText = await response.text();
        this.handleError(
          `Unable to parse authorization server response: '${responseText}'`,
          workflowStateOnError
        );
      } finally {
        this.workflow.showSpinner = false;
      }
    },
    async tradeInAuthCode() {
      this.updateAllCacheValues();

      const body = {
        grant_type: 'authorization_code',
        redirect_uri: this.form.redirectUri,
        code: this.form.authCode
      };

      const { access_token, refresh_token } = await this.requestTokens(body, AUTH_CODE);

      this.form.authCode = `(Used) ${this.form.authCode}`;
      this.form.accessToken = access_token;
      this.form.refreshToken = refresh_token || 'Not provided by authorization server.';
      this.workflow.state = REFRESH_TOKEN;
    },
    async tradeInRefreshToken() {
      this.updateAllCacheValues();

      const body = {
        grant_type: 'refresh_token',
        refresh_token: this.form.refreshToken,
        scope: this.form.scope
      };

      const { access_token, refresh_token } = await this.requestTokens(body, REFRESH_TOKEN);

      this.form.accessToken = access_token;
      this.form.refreshToken = refresh_token || this.form.refreshToken;
      this.workflow.state = REFRESH_TOKEN;
    },
    updateAllCacheValues() {
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
  },
  mounted() {
    this.form.redirectUri = window.location.origin;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    window.history.pushState({}, document.title, '/');

    if(state) {
      if(state !== this.form.state) {
        this.handleError(
          `State from authorization server (${state}) did not match the state we sent (${this.form.state}). They must match to prevent cross-site request forgery. Please try again.`
        );
        this.form.state = generateState();
        return;
      }

      if(!code) {
        this.handleError(
          'Authorization server returned an invalid response (missing "code" query string parameter).'
        );
        this.form.state = generateState();
        return;
      }

      this.form.authCode = code;
      this.workflow.state = AUTH_CODE;
    }

    this.form.state = generateState();
  }
};
</script>

<style>
body {
  padding: 2vh 0;
}
</style>
