class MediaPlayer extends Slider {
    updateState(state) {
        console.log(state)
        this.name = (state.attributes || {}).friendly_name || this.id;
        this.state = state.attributes.volume_level * 100;
        this.render();
      }
    
      onSliderMove(event) {
          super.onSliderMove(event)
          this.sendNewState()
      }

      sendNewState() {
        this.mm.sendSocketNotification("SET_MEDIAPLAYER_VOLUME", {
          entity: this.id,
          volume_level: this.sliderState / 100,
        });
      }
}