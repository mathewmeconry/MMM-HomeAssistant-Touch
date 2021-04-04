class Cover extends Slider {
  updateState(state) {
    this.name = (state.attributes || {}).friendly_name || this.id;
    this.state = state.attributes.current_position;
    this.render();
  }

  sendNewState() {
    this.mm.sendSocketNotification("SET_COVER_POSITION", {
      entity: this.id,
      position: this.sliderState,
    });
  }
}
