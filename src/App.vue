<template>
  <b-container id="app">
    <h1>OAuth 2.0 Client Shell</h1>
    <p>Get the <code>authorization_code</code>, <code>access_token</code> and <code>refresh_token</code> for any registered OAuth2 client!</p>
    <p>This site uses cookies. No values are persisted on the server (except potentially in web logs).</p>

    <hr />

    <AuthorizationCode />
  </b-container>
</template>

<script>
import AuthorizationCode from './components/form-groups/AuthorizationCode'

export default {
  name: 'app',
  components: {
    AuthorizationCode
  }
}
</script>

<style>
.row {
  margin: 1rem;
}
</style>
