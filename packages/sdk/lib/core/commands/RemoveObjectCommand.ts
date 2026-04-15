import { Command } from './Command';
import { ObjectLoader } from '../loader/ObjectLoader';
import App from "../app/App";

/**
 * @param object THREE.Object3D
 * @constructor
 */
class RemoveObjectCommand extends Command {
	public object;
	public parent;
	public index;

	constructor( object ) {
		super();

		this.type = 'RemoveObjectCommand';
		this.name = 'Remove object';

		this.object = object;
		this.parent = ( object !== undefined ) ? object.parent : undefined;
		if ( this.parent !== undefined ) {
			this.index = this.parent.children.indexOf( this.object );
		}
	}

	execute() {
		App.removeObject( this.object );
		App.deselect();
	}

	undo() {
		App.addObject( this.object, this.parent, this.index );
		App.select( this.object );
	}

	toJSON() {
		const output = super.toJSON();
		output.object = this.object.toJSON();
		output.index = this.index;
		output.parentUuid = this.parent.uuid;

		return output;
	}

	fromJSON( json ) {
		super.fromJSON( json );

		this.parent = App.getObjectByUuid( json.parentUuid );
		if ( this.parent === undefined ) {
			this.parent = App.scene;
		}

		this.index = json.index;
		this.object = App.getObjectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {
			const loader = new ObjectLoader();
			this.object = loader.parse( json.object );
		}
	}
}

export { RemoveObjectCommand };
