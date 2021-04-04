class Light extends Base {
  getContainer() {
    const entity = super.getContainer();
    entity.onclick = () => {
      this.mm.sendSocketNotification("TOGGLE_STATE", { entity: this.id });
    };
    entity.ontouchend = () => {
      this.mm.sendSocketNotification("TOGGLE_STATE", { entity: this.id });
    };

    return entity;
  }

  render() {
    super.render();
    const container = document.getElementById(this.id);
    container.classList.add(this.state);

    container.appendChild(statusCheckbox);
  }
}
