# MMM-HomeAssistant-Touch

This module provides an integration to HomeAssitant with touch controls.
It also supports multiple HomeAssistant hosts and connections. You can achieve this by adding the module multiple times to the config.js with different configurations

Currently the following modules are supported:

- Cover
- Media Player
- Switch
- Light

## Connection

This module communicatates via Rest API with HomeAssistant and registers websocket listeners for state upates.

## Config

This are the possible configuration options and the default values set by the module.

```javascript
{
    host: "http://127.0.0.1",
    port: 8123,
    token: "NOT_VALID",
    ignoreCert: false,
    entities: ["ENTITY_ID"],
}
```

## Screenshots

![1](./screenshots/1.png)
![2](./screenshots/2.png)
![3](./screenshots/3.png)
