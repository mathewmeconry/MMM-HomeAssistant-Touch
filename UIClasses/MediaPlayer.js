class MediaPlayer extends Base {
  updateState(state) {
    this.name = (state.attributes || {}).media_title || (state.attributes || {}).friendly_name || this.id;
    this.state = state;
    this.render();
  }

  getControls() {
    const controlDiv = document.createElement("div");
    controlDiv.id = `control-${this.id}`;
    controlDiv.classList.add("media_player_control");

    const previous = this.getButton("step-backward");
    previous.onclick = () => {
      this.mm.sendSocketNotification("MEDIA_PLAYER_PREVIOUS", {
        entity: this.id,
      });
    };
    controlDiv.appendChild(previous);

    let playPause = this.getButton("play");
    if (this.state.state === "playing") {
      playPause = this.getButton("pause");
    }
    playPause.onclick = () => {
      this.mm.sendSocketNotification("MEDIA_PLAYER_PLAYPAUSE", {
        entity: this.id,
      });
    };
    controlDiv.appendChild(playPause);

    const next = this.getButton("step-forward");
    next.onclick = () => {
      this.mm.sendSocketNotification("MEDIA_PLAYER_NEXT", {
        entity: this.id,
      });
    };
    controlDiv.appendChild(next);

    return controlDiv;
  }

  getButton(icon) {
    const button = document.createElement("div");
    button.innerHTML = `<i class="fas fa-${icon}"></i>`;
    return button;
  }

  render() {
    super.render();
    const container = document.getElementById(this.id);
    if (container) {
      container.appendChild(this.getControls());
    }
    console.log(this.state)
    container.style.backgroundImage = `url("${this.mm.config.host}:${this.mm.config.port}${this.state.attributes.entity_picture}")`
  }
}
