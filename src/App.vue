<template>
  <b-container id="app">
    <h1>OAuth 2.0 Client Shell</h1>
    <p>Get the <code>authorization_code</code>, <code>access_token</code> and <code>refresh_token</code> for any registered OAuth2 client!</p>
    <p>This site uses cookies. No values are persisted on the server (except potentially in web logs).</p>

    <hr />

    <b-row>
      <b-col>
        <AuthorizationServer />
      </b-col>
      <b-col>
        <Client />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-card
          header="Authorization Code Grant"
        >
          <b-card-text>

          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AuthorizationServer from './components/form-groups/AuthorizationServer'
import Client from './components/form-groups/Client'

export default {
  name: 'app',
  components: {
    AuthorizationServer,
    Client
  }
}
</script>

<style>
.row {
  margin: 1rem;
}
</style>
