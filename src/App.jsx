/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import { Box, Environment, Lightformer, OrbitControls, Plane, useHelper } from "@react-three/drei"
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from "@react-three/fiber"
import { BallCollider, Physics, RigidBody } from "@react-three/rapier"
import { useRef } from "react"
import { Leva, useControls } from 'leva'

function App() {
	return (
		<>
			{/* <h1 className="text-3xl font-bold w-full text-center">
				Ducks Floating
			</h1> */}
			<Scene />
			<Leva />
		</>
	)
}


function Scene(props) {

	return (
		<Canvas dpr={[1, 1.5]} shadows {...props} >
			<color attach="background" args={['#141622']} />
			
			<Lights/>
			<OrbitControls />
			<Physics debug>
				<Pointer />
				<Model position={[5,0,0]}/>
				<RigidBody type='fixed'>
					<Plane material={new THREE.MeshStandardMaterial({color:'white'})} receiveShadow args={[100,100]} rotation={[-Math.PI/2,0,0]} position={[0,-2.2,0]}/>
				</RigidBody>
			</Physics>
		</Canvas>
	)
}

function Lights(){
	const spotLight = useRef()

	const { positionX, positionY, positionZ } = useControls({
		positionX: {
			value: 10,
			min: 0,
			max: 100,
			step: 1,
		}, positionY: {
			value: 10,
			min: 0,
			max: 100,
			step: 1,
		}, positionZ: {
			value: 10,
			min: 0,
			max: 100,
			step: 1,
		},
	})

	// useHelper(spotLight, THREE.SpotLightHelper, 'red')
	return(
		<>
			<ambientLight intensity={0.4} />
			<spotLight ref={spotLight} color={'blue'}  position={[positionX, positionY, positionZ]} distance={100} angle={0.45} penumbra={1} intensity={1000} castShadow />
			{/* <directionalLight castShadow/> */}
			<Environment resolution={256}>
				<group rotation={[-Math.PI / 3, 0, 1]}>
					<Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
					<Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
					<Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
					<Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
				</group>
			</Environment>
		</>
	)
}

function Pointer({ vec = new THREE.Vector3() }) {
	const ref = useRef()
	useFrame(({ pointer, viewport }) => {
		ref.current?.setNextKinematicTranslation(vec.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0))
	})
	return (
		<RigidBody position={[0, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
			<BallCollider args={[1]} />
		</RigidBody>
	)
}


function Model(props) {
	const { nodes, materials } = useGLTF('/duck-voxel.glb')

	const testMaterial = new THREE.MeshStandardMaterial({color:'#ffff00'})
	return (
		<RigidBody>

			<group castShadow receiveShadow {...props} dispose={null}>
				<mesh castShadow receiveShadow geometry={nodes.Cube_1.geometry} material={materials.body} />
				<mesh castShadow receiveShadow geometry={nodes.Cube_2.geometry} material={materials.bill} />
				<mesh castShadow receiveShadow geometry={nodes.Cube_3.geometry} material={materials.feet} />
				<mesh castShadow receiveShadow geometry={nodes.Cube_4.geometry} material={materials.eye} />
			</group>
		</RigidBody>
	)
}

useGLTF.preload('/duck-voxel.glb')

export default App
