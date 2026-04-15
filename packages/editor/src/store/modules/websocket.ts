import {reactive, toRefs} from "vue";
import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core'
import { store } from '@/store';
import type {UseWebSocketReturn} from "@vueuse/core";

interface IWebsocketState<T> {
    ws: null | UseWebSocketReturn<T>,
    uname:string
}

/**
 * websocket相关
 */
export const useWebsocketStore = defineStore('websocket',()=>{
    const unameLocal = useStorage('WS_UNAME', "");

    const state = reactive<IWebsocketState<string>>({
        // websocket实例
        ws: null,
        // uname
        uname:unameLocal.value as string
    })

    /**
     * getter
     **/
    const getIsOpen = () =>  state.ws && state.ws.status === "OPEN";

    /**
     * actions
     **/
    const setWebsocket = (websocket) => {
        state.ws = websocket;
    }
    const setUname = (uname:string) => {
        unameLocal.value =  uname;
        state.uname = uname;
    }
    // 发送websocket消息
    const send = (message: string | ArrayBuffer | Blob) => {
        if (getIsOpen()) {
            state.ws?.send(message,true);
        }
    }

    return {
        ...toRefs(state),
        getIsOpen,
        setWebsocket,
        setUname,
        send
    }
});

// setup 之外使用
export function useWebsocketStoreWithOut() {
    return useWebsocketStore(store);
}