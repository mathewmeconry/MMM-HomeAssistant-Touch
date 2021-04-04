const NodeHelper = require("node_helper");
const HomeAssistant = require("homeassistant");
const HomeAssistantWS = require("homeassistant-ws");
const Logger = require("./helpers/Logger");

const connections = {};

module.exports = NodeHelper.create({
  start,
  socketNotificationReceived,
  connect,
  getState,
  toggleState,
  onStateChangedEvent,
});

function start() {
  this.logger = new Logger(this.name);
}

function socketNotificationReceived(notification, payload) {
  this.logger.debug(`Recieved notification ${notification}`, payload);
  if (notification !== 'CONNECT' && (!payload.identifier || !connections[payload.identifier])) {
    this.logger.error(`No connection for ${payload.identifier} found`);
    return;
  }

  switch (notification) {
    case "CONNECT":
      this.connect(payload);
      break;
    case "GET_STATE":
      this.getState(payload);
      break;
    case "TOGGLE_STATE":
      this.toggleState(payload);
      break;
  }
}

async function connect(payload) {
  const connectionConfig = {
    host: payload.host,
    port: payload.port,
    token: payload.token,
    ignoreCert: payload.ignoreCert,
  };
  const hass = new HomeAssistant(connectionConfig);
  this.logger.info(`HomeAssistant connected for ${payload.identifier}`);
  connections[payload.identifier] = {
    hass,
    entities: [],
  };

  const self = this;
  HomeAssistantWS.default({
    ...connectionConfig,
    host: new URL(connectionConfig.host).host,
  })
    .then((hassWs) => {
      connections[payload.identifier].websocket = hassWs;
      hassWs.onStateChanged(onStateChangedEvent.bind(self));
    })
    .catch((err) => {
      this.logger.error(
        `WS connection for ${payload.identifier} failed with`,
        err
      );
    });
}

async function getState(payload) {
   this.logger.debug(`Getting state for ${payload.entity}`);
  const hass = connections[payload.identifier].hass;
  const [domain, entity] = payload.entity.split(".");
  const response = await hass.states.get(domain, entity);
  this.logger.debug(`Got state for ${payload.entity}`);
  this.sendSocketNotification("GOT_STATE", {
    identifier: payload.identifier,
    data: response,
  });

  if (!connections[payload.identifier].entities.includes(payload.entity)) {
    connections[payload.identifier].entities.push(payload.entity);
  }
}

async function toggleState(payload) {
  this.logger.debug(`Toggling state for ${payload.entity}`);
  const hass = connections[payload.identifier].hass;
  const [domain, entity] = payload.entity.split(".");
  const response = await hass.services.call('toggle', domain, entity)
  this.logger.debug(`Response for toggling state of ${payload.entity}`, response)
  this.getState(payload)
}

function onStateChangedEvent(event) {
  //this.logger.debug(`Got state change for ${event.data.entity_id}`);
  for (const connection in connections) {
    if (connections[connection].entities.includes(event.data.entity_id)) {
      this.logger.debug(
        `Found listening connection (${connection}) for entity ${event.data.entity_id}`
      );
      this.sendSocketNotification("CHANGED_STATE", {
        identifier: connection,
        data: event.data.new_state,
      });
    }
  }
}
