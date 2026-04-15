import { Command } from './Command';
import { ObjectLoader } from '../loader/ObjectLoader';
import App from "../app/App";

/**
 * @param object THREE.Object3D
 * @constructor
 */
class AddObjectCommand extends Command {
	public object;

	constructor( object ) {
		super();

		this.type = 'AddObjectCommand';
		this.object = object;
		if ( object !== undefined ) {
			this.name = `Add object`;
		}
	}

	execute() {
		App.addObject(this.object);
		App.select(this.object);
	}

	undo() {
		App.removeObject( this.object );
		App.deselect();
	}

	toJSON() {
		const output = super.toJSON();
		output.object = this.object.toJSON();
		return output;
	}

	fromJSON( json ) {
		super.fromJSON( json );
		this.object = App.getObjectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {
			const loader = new ObjectLoader();
			this.object = loader.parse( json.object );
		}
	}
}

export { AddObjectCommand };
