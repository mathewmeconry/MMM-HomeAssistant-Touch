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

  render() {
      super.render()
      const container = document.getElementById(this.id)
      if(container) {
        const status = document.createElement('div')
        status.classList.add('status')
        status.style.height = `${this.state}%`

        if(this.state === 100) {
            status.classList.add('full')
        }

        container.appendChild(status)
    }
  }
}
