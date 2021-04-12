Module.register("MMM-HomeAssistant-Touch", {
  defaults: {
    host: "http://127.0.0.1",
    port: 8123,
    token: "NOT_VALID",
    ignoreCert: false,
    entities: [],
  },
  // default mm functions
  init,
  start,
  getDom,
  socketNotificationReceived,
  getStyles: function () {
    return [this.file("MMM-HomeAssistant-Touch.css"), "font-awesome.css"];
  },
  getScripts: function () {
    return [
      this.file("./helpers/UIClassFactory.js"),
      this.file("./UIClasses/Base.js"),
      this.file("./UIClasses/Slider.js"),
      this.file("./UIClasses/Light.js"),
      this.file("./UIClasses/Switch.js"),
      this.file("./UIClasses/Cover.js"),
      this.file("./UIClasses/MediaPlayer.js"),
      this.file("./UIClasses/Unsupported.js"),
    ];
  },
  // custom functions
  sendSocketNotificationHelper,
  getStates,
  getState,
  updateState,
  loadEntityClasses,
});

// Default MM Functions
function init() {
  // rewrite sendSocketNotification function to include the identifier
  this._sendSocketNotification = this.sendSocketNotification;
  this.sendSocketNotification = this.sendSocketNotificationHelper;
}

function getDom() {
  var wrapper = document.createElement("div");
  wrapper.id = "MMM-HomeAssistant-Touch";
  for (const entity in this.entities) {
    wrapper.appendChild(this.entities[entity].getContainer());
  }

  return wrapper;
}

function start() {
  Log.log(this.name + " is started!");
  this.loadEntityClasses();
  this.sendSocketNotification("CONNECT", {
    host: this.config.host,
    port: this.config.port,
    token: this.config.token,
    ignoreCert: this.config.ignoreCert,
  });
  this.getStates();
}

function socketNotificationReceived(notification, payload) {
  if (payload.identifier === this.identifier) {
    switch (notification) {
      case "GOT_STATE":
      case "CHANGED_STATE":
        this.updateState(payload.data);
        break;
    }
  }
}

// Custom Functions
function getStates() {
  for (const entity of this.config.entities) {
    this.getState(entity);
  }
}

function getState(entity) {
  this.sendSocketNotification("GET_STATE", { entity });
}

function updateState(state) {
  if (this.entities.hasOwnProperty(state.entity_id)) {
    this.entities[state.entity_id].updateState(state);
  }
}

function sendSocketNotificationHelper(notification, payload) {
  payload.identifier = this.identifier;
  this._sendSocketNotification(notification, payload);
}

// initializes each entity to render it
function loadEntityClasses() {
  this.UIClassFactory = new UIClassFactory();
  this.entities = {};

  // load UI Classes
  for (const entity of this.config.entities) {
    const entityClass = this.UIClassFactory.getEntityClass(entity);
    if (entityClass) {
      this.entities[entity] = new entityClass(entity, this);
    }
  }
}
