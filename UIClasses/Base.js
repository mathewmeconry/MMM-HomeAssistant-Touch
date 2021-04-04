class Base {
  constructor(id, mm) {
    this.id = id;
    this.type = id.split(".")[0];
    this.name = id;
    this.mm = mm;
  }

  updateState(state) {
    this.name = (state.attributes || {}).friendly_name || this.id;
    this.state = state.state;
    this.render();
  }

  getContainer() {
    const entity = document.createElement("div");
    entity.classList.add("ha-entity");
    entity.classList.add(`ha-${this.type}`);
    entity.id = this.id;
    entity.innerHTML = "Loading...";
    return entity;
  }

  render() {
    const container = document.getElementById(this.id);
    if (container) {
      container.className = "";
      container.classList.add("ha-entity");
      container.classList.add(`ha-${this.type}`);

      const title = document.createElement("span");
      title.className = "title";
      title.innerHTML = this.name;

      container.innerHTML = "";
      container.appendChild(title);
    }
  }
}
