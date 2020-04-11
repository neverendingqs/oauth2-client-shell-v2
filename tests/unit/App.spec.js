import { expect } from 'chai';
// import { shallowMount } from '@vue/test-utils';

import App from '@/App.vue';


import { START, AUTH_CODE, REFRESH_TOKEN } from '../../src/lib/workflowStates';

describe('App.vue', function() {
  describe('default data', function() {
    afterEach(function() {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    it('has correct default data when cache is empty', function() {
      const {
        form: {
          authEndpoint,
          tokenEndpoint,

          clientId,
          clientSecret,

          redirectUri,
          scope,

          customParameters,
          state: formState,

          authCode,
          accessToken,
          refreshToken
        },
        workflow: {
          options,
          showSpinner,
          state: workflowState
        }
      } = App.data();

      expect(authEndpoint).to.be.empty;
      expect(tokenEndpoint).to.be.empty;

      expect(clientId).to.be.empty;
      expect(clientSecret).to.be.empty;

      expect(redirectUri).to.be.empty;
      expect(scope).to.be.empty;

      expect(customParameters).to.be.empty;
      expect(formState).to.not.be.empty;

      expect(authCode).to.be.empty;
      expect(accessToken).to.be.empty;
      expect(refreshToken).to.be.empty;

      expect(options).to.have.deep.members([START, AUTH_CODE, REFRESH_TOKEN]);
      expect(showSpinner).to.be.false;
      expect(workflowState).to.equal(START);
    });
  });
});
