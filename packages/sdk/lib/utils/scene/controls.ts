import {Object3D,Box3,Sphere,Vector3} from "three";
import CameraControls from "camera-controls";

function getObjectBox3(object:Object3D){
    const box3 = new Box3();
    box3.setFromObject(object);

    if(box3.isEmpty()){
        box3.set(new Vector3(object.position.x-1, object.position.y-1, object.position.z-1), new Vector3(object.position.x+1, object.position.y+1, object.position.z+1));
    }

    return box3;
}

export function focusObject(object:Object3D,controls:CameraControls,enableTransition: boolean = true){
    const box3 = getObjectBox3(object);

    return controls.fitToBox(box3,enableTransition);
}

export function focusObjectByDistance(object:Object3D,controls:CameraControls,distance:number,enableTransition: boolean = true){
    const box3 = getObjectBox3(object);
    const sphere = box3.getBoundingSphere(new Sphere());

    const center = sphere.center.clone();
    const radius = Number.isFinite(sphere.radius) ? sphere.radius : 1;
    const toSurfaceDistance = Math.max(distance, 0);
    const toCenterDistance = Math.max(radius + toSurfaceDistance, 0.01);

    const currentPosition = controls.getPosition(new Vector3());
    const currentTarget = controls.getTarget(new Vector3());
    const direction = currentPosition.sub(currentTarget);
    if(direction.lengthSq() < 1e-6){
        direction.set(0, 0, 1);
    }
    direction.normalize();

    const nextPosition = center.clone().addScaledVector(direction, toCenterDistance);

    return controls.setLookAt(
        nextPosition.x,
        nextPosition.y,
        nextPosition.z,
        center.x,
        center.y,
        center.z,
        enableTransition
    );
}
