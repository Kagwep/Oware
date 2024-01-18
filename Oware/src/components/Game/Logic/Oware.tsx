import './style.css';
import React, { useEffect, useRef,useState, useMemo, useCallback } from 'react';
import {
    Scene,
    Engine,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Texture,
    SceneLoader,
    Mesh,
    ISceneLoaderAsyncResult,
    AbstractMesh,
    PhysicsImpostor,
    VertexBuffer,
    ArcRotateCamera,
    CubeTexture
  } from "@babylonjs/core";
import './style.css';
import '@babylonjs/loaders';
import {houses} from './House';
import { seeds } from './Seed';
import { state,playersStates } from './GameState';
import { housesToAccess } from './House';
import sphereTexture from "../Textures/nuttexture3.avif";
import CustomDialog from '../../Customs/CustomDialog';
import { Card, CardContent, CircularProgress, Typography, Grid } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


export interface Players {
  id:string;
  username:string;
}

export interface CanvasProps {
  players:Players[];
  room:string;
  orientation:string;
  cleanup:() => void;
  username:string;
}
  

const Canvas:React.FC<CanvasProps> = ({ players, room, orientation, cleanup,username }) => {

    const [over, setOver] = useState("");


    const first_player = playersStates["player-1"]
    const second_player = playersStates["player-2"]

    const isWaitingForOpponent = !(players[0] && Object.keys(players[0]).length !== 0 && players[1] && Object.keys(players[1]).length !== 0);

    if (isWaitingForOpponent){
      
    }else{
      
    }

    const createScene = async (canvas: HTMLCanvasElement | null): Promise<{ scene: Scene | undefined, defaultSpheres: () => void }> => {
       
      if (!canvas) {
        // If canvas is null, return a promise with an object where scene is undefined
        return Promise.resolve({ scene: undefined, defaultSpheres: () => {} });
      }    
      
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        
      
        var camera = new ArcRotateCamera("camera1", 0,  Math.PI / 2, 10, Vector3.Zero(), scene);

        camera.attachControl(canvas, true);

        camera.speed = 0.25;

        camera.setPosition(new Vector3(-0.0013763740788813662, 43.32877130120143, 0.43329997049811053));

        camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha;

        camera.lowerBetaLimit = Math.PI / 8; // Set to the desired angle in radians
        camera.upperBetaLimit = Math.PI * 0.5; // Set to the desired angle in radians
    
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 2, 0), scene);


        hemiLight.intensity = 1;
      
        //const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

        // const board = SceneLoader.ImportMesh('','./models/','board.gltf',scene,(meshes) => {
        //   console.log('meshes',meshes)
        // })

        
        const loadModels = async () => {
          try {
            const result = await SceneLoader.ImportMeshAsync('', './models/', 'board.gltf');
            // Do something with the result here
            return result; // You can return the result if needed
          } catch (error) {
            // Handle errors if necessary
            console.error(error);
            throw error; // Re-throw the error if needed
          }
        };
        
        // Call the function
        const {meshes} = await loadModels();
        // Now modelsResult contains the result directly
        
        console.log(meshes);

        const addedSpheres: Mesh[] = [];
        let sphere_count: number  = 1;

        const housesToAccess = ['house-1', 'house-2', 'house-3', 'house-4', 'house-5', 'house-6', 'house-7', 'house-8', 'house-9', 'house-10', 'house-11', 'house-12'];


          const defaultSpheres = () : void => {
                  const selectedMeshes = housesToAccess
                  .map((houseKey) => {
                    const model = meshes.find((model) => model.id === houseKey);
                    return model ? model: null;
                  })
                  .filter(Boolean);

                //console.log(selectedMeshes);
          
                  selectedMeshes.forEach((mesh) => {

                    if (mesh){
                      const house = houses[mesh.name];
                      //console.log(`Mesh name: ${mesh.name}, Seeds count before loop: ${house.seeds.length}`);
                     const houseSeeds = house.seeds;

                     houseSeeds.forEach((seed) => {
                        addSphereInsideMesh(mesh,seed.seedName);
                     })
                      
                      // Additional logic if needed
                    //console.log(house.houseNumber, house.seeds);
                    }
                  });
                }

        // const modelsPromise = (async () => await SceneLoader.ImportMeshAsync('', './models/', 'board.gltf'))();

        // Function to add a small sphere inside the clicked mesh
      // Function to add a small sphere inside the clicked mesh
      function addSphereInsideMesh(mesh: AbstractMesh,seedName: string) {
        // Create a new sphere with MeshBuilder
        const newSphere = MeshBuilder.CreateSphere(seedName, { diameter: 1 }, scene); // Adjust the diameter as needed

        // Compute the center of the clicked mesh's bounding box in world space
        const boundingBoxCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
        newSphere.position.copyFrom(boundingBoxCenter);
        newSphere.isPickable = false;
        // applyRandomDeformities(newSphere, 6);

        //console.log(boundingBoxCenter);

        const sphereMaterial = new StandardMaterial(`seed-${sphere_count}`, scene);
        sphereMaterial.diffuseTexture = new Texture(sphereTexture, scene);
        newSphere.material = sphereMaterial;

        // Check for collisions with previously added spheres
        if (checkSphereCollisions(newSphere)) {
          // If collision detected, calculate a new position
          const newPosition = calculateNewSpherePosition(mesh);
          newSphere.position.copyFrom(newPosition);
          newSphere.isPickable = false;
        } 
        
        addedSpheres.push(newSphere);
      }

          // Function to calculate a new position for the sphere in case of collision
          function calculateNewSpherePosition(mesh: AbstractMesh): Vector3 {
            // Get the center of the clicked mesh's bounding box in world space
            const boundingBoxCenter = mesh.getBoundingInfo().boundingBox.centerWorld;

            // Calculate random offsets for X, Y, and Z directions
            const xOffset = (Math.random() - 0.5) * 2.4; // Adjust the range of X offset as needed
            const yOffset = (Math.random() - 0.5) * 1.4; // Adjust the range of Y offset as needed
            const zOffset = (Math.random() - 0.5) * 2.6; // Adjust the range of Z offset as needed

            // Apply the random offsets to the bounding box center
            const newPosition = new Vector3(
              boundingBoxCenter.x + xOffset,
              boundingBoxCenter.y + yOffset,
              boundingBoxCenter.z + zOffset
            );

            return newPosition;
          }

      // Function to check for collisions with existing spheres
      function checkSphereCollisions(newSphere: Mesh): boolean {
        for (const existingSphere of addedSpheres) {
          // Calculate the distance between the centers of the spheres
          const distance = Vector3.Distance(existingSphere.position, newSphere.position);

          // Check if the spheres overlap (distance less than sum of their radii)
          if (distance < (existingSphere.scaling.x + newSphere.scaling.x) / 2) {
            return true; // Collision detected
          }
        }

        return false; // No collision detected
      }

      // const validateMove = (houseSelected: string) : boolean =>{

      //   const house = houses[houseSelected];



      // }



      function applyRandomDeformities(mesh: Mesh, strength: number) {
        const positions = mesh.getVerticesData(VertexBuffer.PositionKind) as Float32Array;
      
        // Apply random deformities to each vertex
        for (let i = 0; i < positions.length; i += 3) {
          const randomX = (Math.random() - 0.5) * strength;
          const randomY = (Math.random() - 0.5) * strength;
          const randomZ = (Math.random() - 0.5) * strength;
      
          positions[i] += randomX;
          positions[i + 1] += randomY;
          positions[i + 2] += randomZ;
        }
      
        mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
      }

        // console.log(modelsPromise)
        let numberOfSeedsPicked: number = 0;

        
        
        
          scene.onPointerDown = function (evt, pickResult) {
            // Check if a mesh was clicked
            if (pickResult.hit && pickResult.pickedMesh && numberOfSeedsPicked === 0) {
              // Find the corresponding house in the houses object
              const clickedMesh: AbstractMesh = pickResult.pickedMesh;
              const house = houses[clickedMesh.name];

              const isValidMove = clickedMesh.name === state.nextHouse;
              const isOrginalHouse = clickedMesh.name === state.originalHouse;

              if (house && isValidMove && !isOrginalHouse) {

                //console.log(house.seeds.length)
                // Print the position and seed number of the corresponding house
                numberOfSeedsPicked = house.seedsNumber;

                house.seedsNumber = 0;

               // console.log(`House ${house.houseNumber}: Position - x: ${clickedMesh.position.x}, y: ${clickedMesh.position.y}, z: ${clickedMesh.position.z}, Seed: ${house.seedNumber}`);
             
               // console.log("number of picked seeds", numberOfSeedsPicked);

                const seeds = house.seeds;

                console.log("the seeds",seeds);

                seeds.forEach((seed) => {
                  // Find the sphere in the addedSpheres array by name
                 
                  const sphere = addedSpheres.find(s => s.name === seed.seedName);

                  console.log(sphere);
                
                  console.log(`Attempt to dispose of sphere with name '${seed.seedName}':`, sphere);
                
                  if (sphere) {
                    console.log(`Disposing of sphere with name '${seed.seedName}'`);
                    sphere.dispose();
                    // Remove the disposed sphere from the addedSpheres array
                    const index = addedSpheres.indexOf(sphere);
                    if (index !== -1) {
                      addedSpheres.splice(index, 1);
                    }
                  } else {
                    console.log(`Sphere not found with name '${seed.seedName}'`);
                  }
                });
                
                state.onHand = house.seeds

                house.seeds = [];

                state.previouseHouse = state.nextHouse;

                const nextMove = () : string => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return house;
                }


                state.nextHouse = nextMove();
                state.originalHouse = clickedMesh.name;

                //console.log("Remaining seeds ", house.seeds);

             
              } else {
                console.warn("House not found for clicked mesh: " + clickedMesh.name);
              }
            } else if (pickResult.hit && pickResult.pickedMesh && numberOfSeedsPicked !== 0) {
              // Find the corresponding house in the houses object
              const clickedMesh: AbstractMesh = pickResult.pickedMesh;
              const house = houses[clickedMesh.name];
              const isValidMove = clickedMesh.name === state.nextHouse;

              if (house && isValidMove) {
                // Print the position and seed number of the corresponding house
                
                house.seedsNumber +=1;
                numberOfSeedsPicked -= 1;

               // console.log("remaining seed", numberOfSeedsPicked);

                addSphereInsideMesh(clickedMesh,state.onHand[0].seedName);

                house.seeds.push(state.onHand[0]);
                state.onHand.splice(0, 1);

                state.previouseHouse = state.nextHouse;

                const nextMove = () : string => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return house;
                }


                state.nextHouse = nextMove();
                state.originalHouse = clickedMesh.name;


                //console.log(`House ${house.houseNumber}: Position - x: ${clickedMesh.position.x}, y: ${clickedMesh.position.y}, z: ${clickedMesh.position.z}, Seed: ${house.seedNumber}`);
              } else {
                console.warn("House not found for clicked mesh: " + clickedMesh.name);
              }
            } 
          };

        // const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
        // ball.position = new Vector3(0, 1, 0);

        
        
        // Assuming 'scene' is your Babylon.js scene object
        engine.runRenderLoop(() => {

  
          scene.render();
        });
      
        window.addEventListener('resize', () => {
          engine.resize();
        });

        //ground.material = CreateGroundMaterial(scene);
        // ball.material = CreateBallMaterial(scene);

      
        return {scene, defaultSpheres};
      };


      const canvasRef = useRef<HTMLCanvasElement>(null);

      useEffect(() => {
        const loadScene = async (): Promise<() => void> => {
          const {scene, defaultSpheres} = await createScene(canvasRef.current);
          defaultSpheres();
          
          // Optionally, you can handle the scene instance or perform additional actions here
          
          return () => {
            if (scene) {
              scene.dispose(); // Clean up the scene when the component unmounts
            }
          };
        };
    
        const cleanup = loadScene().then(cleanupFunction => cleanupFunction);
    
        return () => {
          cleanup.then(cleanupFunction => cleanupFunction());
        };
      }, []);



  return (
    <>
        <div className='m-5'>
            <a href="https://flowbite.com" className="flex items-center ">
                <img src="./logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Oware</span>
            </a>
            <div className='pt-2'>
            <Card sx={{
              backgroundColor:'rgb(15 23 42)',
              borderRadius: '16px 16px 0 0'
            }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  {isWaitingForOpponent ? (
                  <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <CircularProgress size={18} />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" color={'whitesmoke'}>Waiting for opponent</Typography>
                  </Grid>
                </Grid>
                  ) : (
                    <>
                    <AccountCircleIcon fontSize="large" color="primary" />
                    <Grid item>
                    <div>
                      <Typography variant="h6" color={'white'} sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>Player: <span className='text-sky-500 px-1'>{username}</span></Typography>
                      <Typography variant="body1" color={'white'} sx={{
                      }}>Room: <span className='text-sky-500 px-1'>{room}</span></Typography>
                      <Typography variant="body1" color={'white'} sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>Opponent: <span className='text-sky-500 px-1'>{players[0].username}</span></Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <div>
                      <Typography variant="body1" color={'white'} sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>Moves Left:<span className='text-sky-500 px-1'> </span></Typography>
                      <Typography variant="body1" color={'white'} sx={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>Turn:  <span className='text-sky-500 px-1'></span></Typography>
                    </div>
                  </Grid>
                  <Grid item>
                    <ArrowForwardIcon color={'primary'} />
                  </Grid>
                  </>
                  )}

                </Grid>
  
              </Grid>
            </CardContent>
          </Card>
        </div>
        <canvas className='canvas rounded-md' ref={canvasRef}>
        
        </canvas>
        </div>
        <CustomDialog // <- 5
        open={Boolean(over)} 
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
        }}
      />
    </>
  )
}

export default Canvas