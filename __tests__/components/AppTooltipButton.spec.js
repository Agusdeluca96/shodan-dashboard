import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import AppTooltipButton from "@/components/AppTooltipButton";

describe("AppTooltipButton.vue", () => {
  const localVue = createLocalVue();
  let vuetify;

  const wrapperFactory = (wrapperProps = { onClickEmit: "TestEvent" }) => {
    return mount(AppTooltipButton, {
      localVue,
      vuetify,
      propsData: wrapperProps
    });
  };

  beforeEach(() => {
    vuetify = new Vuetify();
  });

  it("should match snapshot", () => {
    const wrapper = wrapperFactory();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("should emit specific event when the tooltip v-btn is clicked", async () => {
    const onClickEmitEvent = "TestEvent";
    const wrapper = wrapperFactory({ onClickEmit: onClickEmitEvent });
    const button = wrapper.find(".v-btn");

    // Assert no the event has not been emitted yet
    expect(wrapper.emitted()[onClickEmitEvent]).toBeFalsy();

    // Simulate a click on the button
    button.trigger("click");

    // Assert event has been emitted
    expect(wrapper.emitted()[onClickEmitEvent]).toBeTruthy();
  });
});
