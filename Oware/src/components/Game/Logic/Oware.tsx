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
import {House, houses} from './House';
import { seeds } from './Seed';
import { state,playersStates } from './GameState';
import { housesToAccess } from './House';
import sphereTexture from "../Textures/nuttexture3.avif";
import CustomDialog from '../../Customs/CustomDialog';
import { Card, CardContent, CircularProgress, Typography, Grid ,Paper} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Button} from '@mui/material';
import socket from "../../../socket";
import HouseIcon from '@mui/icons-material/House';
import FlashButton from '../GameComponents/PlayersTurn';



export interface Players {
  id:string;
  username:string;
}
export interface Identity {
  player1:string;
  player2:string;
}

export interface CanvasProps {
  players:Players[];
  room:string;
  orientation:string;
  cleanup:() => void;
  username:string;
  player_identity:string;
}


export interface GameStartState {
  turn:string;
  opponentHouses:string[];
}


interface Move {
  selectedHouse:House;
  action:number;

}

const houseContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const housePaperStyle: React.CSSProperties = {
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const houseIconStyle: React.CSSProperties = {
  marginRight: '8px',
};


  

const Canvas:React.FC<CanvasProps> = ({ players, room, orientation, cleanup,username,player_identity }) => {

    const [over, setOver] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [originalHouse, setOriginalHouses] = useState<string[]>([]);
    const [dice_rolled, setDiceRolled] = useState<boolean>(false);
    const [playerHouses, setPlayerHouses] = useState<string[]>([])
    const [player_turn,setPlayerTurn] = useState<string>("")
    

    console.log(player_identity);

    const dieRef = useRef<HTMLOListElement>(null);

    const toggleClasses = (die: HTMLOListElement) => {
      die.classList.toggle('odd-roll');
      die.classList.toggle('even-roll');
    };
  
    const getRandomNumber = (min: number, max: number): number => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    const rollDice = () => {
      if (dieRef.current) {
        toggleClasses(dieRef.current);
        const randomNumber = getRandomNumber(1, 6);
        dieRef.current.dataset.roll = randomNumber.toString();
        if(randomNumber < 4){
          setPlayerHouses(housesToAccess.slice(0,6));
       
          // illegal move

          const gameStartState = {
            turn:'player-1',
            opponentHouses:housesToAccess.slice(6,12)
          }
      
          socket.emit("gameStartState", { // <- 3 emit a move event.
            gameStartState,
            room,
          }); // this event will be transmitted to the opponent via the server

          setPlayerTurn('player-1');

        }else{
          setPlayerHouses(housesToAccess.slice(6,12));
  
          // illegal move
          setPlayerTurn('player-2');
      
          const gameStartState = {
            turn:'player-2',
            opponentHouses:housesToAccess.slice(0,6)
          }
      
          socket.emit("gameStartState", { // <- 3 emit a move event.
            gameStartState,
            room,
          }); // this event will be transmitted to the opponent via the server
          
        }

        setDiceRolled(true);
    
      }
    };
  
    useEffect(() => {
      if (dieRef.current) {
        toggleClasses(dieRef.current);
      }
    }, []);


    const handleCopySuccess = () => {
      setIsCopied(true);
    };


    console.log(room);




    const isWaitingForOpponent = !(players[0] && Object.keys(players[0]).length !== 0 && players[1] && Object.keys(players[1]).length !== 0);

    if (!isWaitingForOpponent){

      const first_player = playersStates["player-1"];
      const second_player = playersStates["player-2"];
      first_player.username = players[0].username;
      first_player.room = room;
      first_player.nextHouse=housesToAccess.slice(0,7);
      second_player.username = players[0].username;
      second_player.room = room;
      second_player.nextHouse=housesToAccess.slice(7,12);
      
      
      
    }else{
      
    }

    const createScene = async (canvas: HTMLCanvasElement | null): Promise<{ scene: Scene | undefined, defaultSpheres: () => void,moveSpheres: (move:Move) => void }> => {
       
      if (!canvas) {
        // If canvas is null, return a promise with an object where scene is undefined
        return Promise.resolve({ scene: undefined, defaultSpheres: () => {},moveSpheres: () => {} });
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

        //const housesToAccess = ['house-1', 'house-2', 'house-3', 'house-4', 'house-5', 'house-6', 'house-7', 'house-8', 'house-9', 'house-10', 'house-11', 'house-12'];


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


          
          const moveSpheres = (move: Move)  => {

            console.log("oppent made a move", move);

            const house = houses[housesToAccess[move.selectedHouse.houseNumber - 1]]

            console.log(house);

            if (move.action===0){
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

               const player = playersStates[player_identity]
               
               player.onHand = house.seeds

               house.seeds = [];

               player.previouseHouse = state.nextHouse[0];

               const nextMove = () : string[] => {
                  
                   const indexOfCurrentHouse = housesToAccess.indexOf(housesToAccess[move.selectedHouse.houseNumber - 1]);

                   const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                   const house = housesToAccess[indexOfNextHouse];

                   return [house];
               }


               player.nextHouse = nextMove();
               player.originalHouse = [housesToAccess[move.selectedHouse.houseNumber - 1]];

            }else{
              const meshClicked =  meshes.find((model) => model.id === housesToAccess[house.houseNumber-1]);
              if(meshClicked){

                house.seedsNumber +=1;
                //numberOfSeedsPicked -= 1;
                const player = playersStates[player_identity]


                addSphereInsideMesh(meshClicked,player.onHand[0].seedName);

                house.seeds.push(player.onHand[0]);
                player.onHand.splice(0, 1);

                player.previouseHouse = player.nextHouse[0];

                

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(meshClicked.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return [house];
                }

                player.nextHouse = nextMove();
                player.originalHouse = [meshClicked.name];


              }
            }
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

              const isValidMove = clickedMesh.name === state.nextHouse[0];
              const isOrginalHouse = clickedMesh.name === state.originalHouse[0];

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

                state.previouseHouse = state.nextHouse[0];

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return [house];
                }


                state.nextHouse = nextMove();
                state.originalHouse = [clickedMesh.name];

                //console.log("Remaining seeds ", house.seeds);


              const move: Move = {

                selectedHouse:house,
                action:0,

              };

              // illegal move
              if (move === null) return false;
          
              socket.emit("move", { // <- 3 emit a move event.
                move,
                room,
              }); // this event will be transmitted to the opponent via the server

             
              } else {
                console.warn("House not found for clicked mesh: " + clickedMesh.name);
              }
            } else if (pickResult.hit && pickResult.pickedMesh && numberOfSeedsPicked !== 0) {
              // Find the corresponding house in the houses object
              const clickedMesh: AbstractMesh = pickResult.pickedMesh;
              const house = houses[clickedMesh.name];
              const isValidMove = clickedMesh.name === state.nextHouse[0];

              if (house && isValidMove) {
                // Print the position and seed number of the corresponding house
                
                house.seedsNumber +=1;
                numberOfSeedsPicked -= 1;

               // console.log("remaining seed", numberOfSeedsPicked);

                addSphereInsideMesh(clickedMesh,state.onHand[0].seedName);

                house.seeds.push(state.onHand[0]);
                state.onHand.splice(0, 1);

                state.previouseHouse = state.nextHouse[0];

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return [house];
                }


                state.nextHouse = nextMove();
                state.originalHouse = [clickedMesh.name];

                const move: Move = {

                  selectedHouse:house,
                  action:1,
  
                };

                // illegal move
                if (move === null) return false;
            
                socket.emit("move", { // <- 3 emit a move event.
                  move,
                  room,
                }); // this event will be transmitted to the opponent via the server



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

      
        return {scene, defaultSpheres,moveSpheres};
      };

 
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const [scene, setScene] = useState<Scene | undefined>(undefined);
      const [makeAMove, setMakeAMove] = useState<(move: Move) => void>(() => {});
    

      useEffect(() => {
        const loadScene = async (): Promise<() => void> => {
          const {scene:sceneCreated, defaultSpheres,moveSpheres: sceneMoveSpheres} = await createScene(canvasRef.current);
          defaultSpheres();
          
          // Optionally, you can handle the scene instance or perform additional actions here

          if (sceneCreated) {
            setScene(sceneCreated);
            setMakeAMove(() =>  sceneMoveSpheres);
          }
          
          return () => {
            if (sceneCreated) {
              sceneCreated.dispose(); // Clean up the scene when the component unmounts
            }
          };
        };
    
        const cleanup = loadScene().then(cleanupFunction => cleanupFunction);
    
        return () => {
          cleanup.then(cleanupFunction => cleanupFunction());
        };
      }, []);

      
      useEffect(() => {
        if (scene) {
          socket.on("move", (move) => {
            makeAMove(move);
          });
        }
    
        return () => {
          // Clean up the socket event listener when the component unmounts
          socket.off("move");
        };
      }, [scene, makeAMove]);


      useEffect(() => {
        socket.on("gameStartState", (gameStartState) => {
          setPlayerHouses(gameStartState.opponentHouses); //
          setDiceRolled(true);
          setPlayerTurn(gameStartState.turn)
        });
      }, [setPlayerHouses,setDiceRolled]);

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
              <Grid container spacing={4} alignItems="center">
                <Grid item width={'100%'}>
                  {isWaitingForOpponent ? (
                  <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <CircularProgress size={18} />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" color={'whitesmoke'}>Waiting for opponent</Typography>
                  </Grid>
                  <Grid item>
                  <CopyToClipboard text={room} onCopy={handleCopySuccess}>
                    <Button color="primary">
                      {isCopied ? 'Copied!' : 'Copy Room Id to Clipboard'}
                    </Button>
                  </CopyToClipboard>
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
                      { !dice_rolled ? (
                        <Grid item>
                        <div className="dice">
                              <ol className="die-list even-roll" data-roll="1" id="die-1" ref={dieRef}>
                                <li className="die-item" data-side="1">
                                  <span className="dot"></span>
                                </li>
                                <li className="die-item" data-side="2">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                </li>
                                <li className="die-item" data-side="3">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                </li>
                                <li className="die-item" data-side="4">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                </li>
                                <li className="die-item" data-side="5">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                </li>
                                <li className="die-item" data-side="6">
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                  <span className="dot"></span>
                                </li>
                              </ol>
                            </div>
                            <Button variant='contained' id="roll-button" onClick={rollDice}>
                              Roll Dice
                            </Button>
                    </Grid>
                      ):(
                        <>
                            <Typography variant="body1">
                              <ArrowForwardIcon fontSize="small" /> Moves Remaining: 
                            </Typography>
                          <Grid container spacing={2} sx={{margin:'auto',textAlign:'center',alignItems:"center",position:'center'}} columns={16}>
                            {playerHouses.map((houseName, index) => (
                              <Grid item xs={6} sm={2} md={2} lg={2} key={index}>
                                <Paper elevation={3} sx={{padding:1}} >
                                  <HouseIcon />
                                  <Typography variant="h6">{houseName}</Typography>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                          <div className="player mt-3">
                          <FlashButton btnText={player_identity === player_turn ? "Its your Turn " : `${player_turn}'s turn`} />
                          </div>
                          
                        </>
                      )}
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