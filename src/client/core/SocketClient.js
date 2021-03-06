/**
 * SocketClient
 */
function SocketClient()
{
    this.connected  = false;
    this.id         = null;

    this.sendPing              = this.sendPing.bind(this);
    this.onError               = this.onError.bind(this);
    this.onOpen                = this.onOpen.bind(this);
    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.pingLogger = new PingLogger(this.sendPing, 1000);

    var Socket = window.MozWebSocket || window.WebSocket;

    BaseSocketClient.call(this, new Socket('ws://' + document.location.host, ['websocket']));

    this.on('pong', this.pingLogger.pong);
    this.on('open', this.onOpen);

    this.socket.onopen  = this.onSocketConnection;
    this.socket.onclose = this.onSocketDisconnection;
    this.socket.onerror = this.onError;
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketConnection = function(e)
{
    console.log('Connected', e);

    this.connected = true;
    this.start();

    this.pingLogger.start();

    this.emit('connected');
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocketDisconnection = function(e)
{
    console.log('Disconnect', e);

    this.connected = false;
    this.id        = null;

    this.pingLogger.stop();

    this.emit('disconnected');

    throw 'Connexion lost';
};

/**
 * On open
 *
 * @param {Event} event
 */
SocketClient.prototype.onOpen = function(event)
{
    this.id = event.detail;
};

/**
 * On Ping
 *
 * @param {Number} ping
 */
SocketClient.prototype.sendPing = function(ping)
{
    this.addEvent('ping', ping);
};

/**
 * On error
 *
 * @param {Event} event
 */
SocketClient.prototype.onError = function (event)
{
    throw event;
};