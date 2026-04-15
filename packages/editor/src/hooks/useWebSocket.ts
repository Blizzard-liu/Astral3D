/**
 * @author MaHaiBing
 * @email  mlt131220@163.com
 * @date   2023/11/29 10:10
 * @description websocket hook;使用store管理websocket保证全局唯一性
 */
import {unref} from 'vue';
import { useWebSocket as $useWebSocket } from '@vueuse/core'
import {App} from '@astral3d/engine';
import {useWebsocketStoreWithOut} from "@/store/modules/websocket";
import {MathUtils} from 'three';

const websocketStore = useWebsocketStoreWithOut();
const listeners = new Map();

/**
 * 开启 WebSocket 链接，全局只需执行一次
 * @param url
 */
export function connectWebSocket(url) {
    if(url.substring(0,3).indexOf('ws') === -1){
        if(url.indexOf('http') !== -1){
            url = url.replace("http", "ws")
        }else{
            url = location.origin.replace("http", "ws") + url;
        }
    }

    if (!websocketStore.getIsOpen()) {
        // 设置订阅者标识
        let wsUname;
        if(!websocketStore.uname){
            wsUname = MathUtils.generateUUID();
            websocketStore.setUname(wsUname);
        }else{
            wsUname = websocketStore.uname;
        }

        const ws = $useWebSocket(`${url}?uname=${wsUname}`, {
            // 在错误时自动重连
            autoReconnect:{
                // 最大重试次数。
                retries: 3,
                // 重新连接的延迟，以毫秒为单位
                delay:2000,
                // 已达到最大重试次数。
                onFailed(){
                    App.log.error("[WebSocket] 连接重试次数超限，连接失败！");
                }
            },
            // 定时发送 ping 消息
            heartbeat: {
                // @ts-ignore
                message: new Uint8Array([0x9]),
                interval: 10 * 1000,
                pongTimeout: 10 * 1000,
            },
            onConnected: () => {
                App.log.info('[WebSocket] 连接成功');
            },
            onDisconnected: () => {
                App.log.info('[WebSocket] 连接关闭');
            },
            onMessage: (_,event) => {
                onMessage(event);
            },
            onError: () => {
                App.log.error('[WebSocket] 连接错误');
            }
        });
        websocketStore.setWebsocket(ws);
    }
}

function onMessage(e: MessageEvent) {
    if (e.data === 'ping' || e.data === 'heartbeat' || e.data === 'pong' || e.data instanceof Blob) {
        return;
    }

    App.log.debug(`[WebSocket] 收到消息： ${e.data}`);

    try {
        const data = JSON.parse(e.data);
        for (const callback of listeners.keys()) {
            try {
                callback(data);
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        App.log.error(`[WebSocket] data解析失败： ${err}`);
    }
}

/**
 * 添加 WebSocket 消息监听
 * @param callback
 */
export function onWebSocket(callback: (data: object) => any) {
    if (!listeners.has(callback)) {
        if (typeof callback === 'function') {
            listeners.set(callback, null);
        } else {
            console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法');
        }
    }
}

/**
 * 解除 WebSocket 消息监听
 *
 * @param callback
 */
export function offWebSocket(callback: (data: object) => any) {
    listeners.delete(callback);
}

export function useWebSocket() {
    return unref(websocketStore.ws);
}

export function send(message: string | ArrayBuffer | Blob) {
    websocketStore.send(message);
}
