

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Gltf, PerspectiveCamera } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";

import { Bullets } from "./bullets";
import { Gun } from "./gun";
import { Score } from "./score";
import { Target } from "./targets";
import gsap from "gsap";

const xrStore = createXRStore({
    emulate: {
        controller: {
            left: {
                position: [-0.15649, 1.43474, -0.38368],
                quaternion: [
                    0.14766305685043335, -0.02471366710960865, -0.0037767395842820406,
                    0.9887216687202454,
                ],
            },
            right: {
                position: [0.15649, 1.43474, -0.38368],
                quaternion: [
                    0.14766305685043335, 0.02471366710960865, -0.0037767395842820406,
                    0.9887216687202454,
                ],
            },
        },
    },
    controller: {
        right: Gun,
    },
});

const GsapTicker = () => {
    useFrame(() => {
        gsap.ticker.tick();
    });
    return null;
};

export const GameScene = ({ onReturnHome }) => {
    return (
        <>
            <Canvas
                style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <color args={[0x808080]} attach={"background"}></color>
                <PerspectiveCamera makeDefault position={[0, 1.6, 2]} fov={75} />
                <Environment preset="warehouse" />
                <Bullets />
                <Gltf src="assets/spacestation.glb" />
                <Target targetIdx={0} />
                <Target targetIdx={1} />
                <Target targetIdx={2} />
                <Score />
                <GsapTicker />
                <XR store={xrStore}></XR>
            </Canvas>
            <div
                style={{
                    position: "fixed",
                    display: "flex",
                    width: "100vw",
                    height: "100vh",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "white",
                }}
            >
                <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", width: "100%" }}>
                    <button
                        onClick={onReturnHome}
                        style={{
                            background: "#e63946",
                            border: "none",
                            color: "white",
                            padding: "8px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            marginLeft: "10px"
                        }}
                    >
                        Return Home
                    </button>


                </div>

                <button
                    onClick={() => xrStore.enterVR()}
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: "20px",
                        background: "#4361ee",
                        color: "white",
                        border: "none",
                        padding: "12px 25px",
                        borderRadius: "30px",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(67, 97, 238, 0.3)",
                    }}
                >
                    Enter VR
                </button>
            </div>
        </>
    );
};

export default GameScene;