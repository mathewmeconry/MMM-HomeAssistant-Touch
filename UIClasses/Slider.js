class Slider extends Base {
  constructor(...params) {
    super(...params);
    this.onSliderMove = this.onSliderMove.bind(this);
    this.removeSlider = this.removeSlider.bind(this);
  }

  getContainer() {
    const entity = super.getContainer();
    entity.onmousedown = (event) => {
      this.addSlider(event.x, event.y);
    };
    entity.onpointerdown = (event) => {
      this.addSlider(event.x, event.y);
    };
    entity.onmouseup = this.removeSlider;
    entity.ontouchend = this.removeSlider;
    return entity;
  }

  addSlider(offsetX, offsetY) {
    const slider = document.createElement("div");
    slider.id = `slider-${this.id}`;
    slider.classList.add("ha-slider");

    // click location minus height minus margins
    slider.style.top = `calc(${offsetY}px - 60px - 200px + calc(2px * ${this.state}))`;
    // click location minus width/2 minus margins
    slider.style.left = `calc(${offsetX}px - 60px - 1.5rem)`;

    const sliderFill = document.createElement("div");
    sliderFill.id = `slider-fill-${this.id}`;
    sliderFill.classList.add("ha-slider-fill");
    sliderFill.style.height = `${this.state}%`;
    sliderFill.innerHTML = this.state;

    slider.appendChild(sliderFill);
    document.body.appendChild(slider);

    document.body.addEventListener("mouseup", this.removeSlider);   
    document.body.addEventListener("pointerup", this.removeSlider);
    document.body.addEventListener("touchend", this.removeSlider);
    document.body.addEventListener("mousemove", this.onSliderMove);
    document.body.addEventListener("touchmove", this.onSliderMove);

    this.sliderStartY = offsetY;
    this.sliderState = this.state;
  }

  onSliderMove(event) {
    let y = event.y;
    if (event.touches) {
      y = event.touches[0].clientY;
    }
    const sliderFill = document.getElementById(`slider-fill-${this.id}`);
    if (sliderFill) {
      const offset = this.sliderStartY - y;
      this.sliderState = this.state + Math.round((100 / 200) * offset);
      if (this.sliderState > 100) this.sliderState = 100;
      if (this.sliderState < 0) this.sliderState = 0;
      sliderFill.style.height = `${this.sliderState}%`;
      sliderFill.innerHTML = this.sliderState;
    }
  }

  removeSlider() {
    const slider = document.getElementById(`slider-${this.id}`);
    if (slider) {
      slider.remove();
    }
    document.body.removeEventListener("mouseup", this.removeSlider);
    document.body.removeEventListener("pointerup", this.removeSlider);
    document.body.removeEventListener("touchend", this.removeSlider);
    document.body.removeEventListener("mousemove", this.onSliderMove);
    document.body.removeEventListener("touchmove", this.onSliderMove);
    this.sendNewState();
  }

  sendNewState() {}
}
