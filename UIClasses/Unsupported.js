class Unsupported extends Base {
  render() {
    const container = document.getElementById(this.id);

    const title = document.createElement("span");
    title.className = "title";
    title.innerHTML = `${this.name} (Unsupported)`;

    const status = document.createElement("span");
    status.className = "status";
    status.innerHTML = this.state;

    container.innerHTML = "";
    container.appendChild(title);
    container.appendChild(status);
  }
}
