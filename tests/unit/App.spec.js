import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe('App.vue', function() {


  it('renders props.msg when passed', function() {
    const msg = 'new message';
    const wrapper = shallowMount(App, {
      propsData: { msg }
    });
    expect(wrapper.text()).to.include(msg);
  });
});
