#!/usr/bin/env python2

import json
import random
import redis
import sys

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol

from twisted.internet import reactor
from twisted.python import log

class BackendServerProtocol(WebSocketServerProtocol):

    def __init__(self, *args, **kwargs):
        super(self.__class__, self).__init__(*args, **kwargs)
        self.redis = redis.StrictRedis()

    def onConnect(self, request):
        print('Connection request: {}'.format(request))
        self.peer = request.peer

    def onOpen(self):
        self.factory.register(self)
        user = self.redis.get(self.peer)
        if not user:
            user = {'status': 'off',
                    'nick': 'Guest'+str(random.randint(10000, 99999)),
                    'pos_x': 0.0,
                    'pos_y': 0.0,
                    }
        user['status'] = 'on'
        self.redis.hmset(self.peer, user)

    def onMessage(self, payload, isBinary):
        if isBinary:
            print('Got binary message from {}, length: {}'.format(self.peer, len(payload)))
            data = {}
        else:
            print('Got message from {}: {}'.format(self.peer, payload.decode('utf8')))
            data = json.loads(payload.decode('utf8'))

        if data.get('nick'):
            self.redis.hset(self.peer, 'nick', data['nick'])

        if data.get('pos'):
            self.redis.hmset(self.peer, data['pos'])

    def connectionLost(self, reason):
        WebSocketServerProtocol.connectionLost(self, reason)
        self.factory.unregister(self)
        self.redis.delete(self.peer)


class BackendServerFactory(WebSocketServerFactory):
    def __init__(self, url):
        WebSocketServerFactory.__init__(self, url)
        self.redis = redis.StrictRedis()
        self.clients = []
        self.tick()

    def tick(self):
        users = []
        for k in self.redis.keys():
            users.append(self.redis.hgetall(k))
        self.broadcast(json.dumps(users).encode('utf8'))
        reactor.callLater(2, self.tick)

    def register(self, client):
        if client not in self.clients:
            self.clients.append(client)

    def unregister(self, client):
        if client in self.clients:
            self.clients.remove(client)

    def broadcast(self, message):
        prepared_message = self.prepareMessage(message)
        for c in self.clients:
            c.sendPreparedMessage(prepared_message)



if __name__ == '__main__':
    log.startLogging(sys.stdout)
    factory = BackendServerFactory(u'ws://127.0.0.1:9000')
    factory.protocol = BackendServerProtocol
    
    reactor.listenTCP(9000, factory)
    reactor.run()
