import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM } from '@pixiv/three-vrm';

const scene = new THREE.Scene();

const loader = new GLTFLoader();
loader.load(

	// URL of the VRM you want to load
	'/models/three-vrm-girl.vrm',

	// called when the resource is loaded
	( gltf ) => {

		// generate a VRM instance from gltf
		VRM.from( gltf ).then( ( vrm ) => {

			// add the loaded vrm to the scene
			scene.add( vrm.scene );

			// deal with vrm features
			console.log( vrm );

		} );

	},

	// called while loading is progressing
	( progress ) => console.log( 'Loading model...', 100.0 * ( progress.loaded / progress.total ), '%' ),

	// called when loading has errors
	( error ) => console.error( error )

);