import {BufferGeometry, BufferAttribute} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const visualGeometries: BufferGeometry[] = [];

self.onmessage = function ({data}) {
    switch (data.type) {
        case "push":
            pushGeometry(data);
            break;
        case "merge":
            if(visualGeometries.length === 0) {
                self.postMessage({
                    type: "error",
                    message:"No geometries found."
                })
                break;
            }

            const geo = BufferGeometryUtils.mergeGeometries(visualGeometries);
            self.postMessage({
                type: "success",
                geometry: geo
            })
            break;
    }
}

function pushGeometry(data) {
    const {geometry} = data;

    if(!geometry) return;

    geometry.__proto__ = BufferGeometry.prototype;
    geometry.index && (geometry.index.__proto__ = BufferAttribute.prototype);
    geometry.attributes.position && (geometry.attributes.position.__proto__ = BufferAttribute.prototype);
    geometry.attributes.normal && (geometry.attributes.normal.__proto__ = BufferAttribute.prototype);

    visualGeometries.push(geometry);
}