import rand from 'csprng';
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import cache from './lib/cache';
import { START, AUTH_CODE, REFRESH_TOKEN } from './lib/workflowStates';

function generateState() {
  return rand(256, 36);
}

export default new Vuex.Store({
  state: {
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
  },
  getters: {
    isAuthCode: state => {
      return state.workflow.state === AUTH_CODE;
    },
    isRefreshToken: state => {
      return state.workflow.state === REFRESH_TOKEN;
    },
    isStart: state => {
      return state.workflow.state === START;
    }
  }
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
