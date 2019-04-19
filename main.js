
// Get the canvas element from our HTML below
var canvas = document.querySelector("#renderCanvas");

// Load the BABYLON 3D engine
var engine = new BABYLON.Engine(canvas, true);

var camera, select, spriteManagerTrees, selectedMesh;

function createScene() {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);
  
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
  scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
  scene.fogDensity = 0.003;
  
  // Setup environment
  camera = new BABYLON.FreeCamera("Camera", BABYLON.Vector3.Zero(), scene);
  camera.lowerBetaLimit = 0.05;
  camera.upperBetaLimit = (Math.PI / 2) * 0.95;
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 200;
  camera.fov = -100;
  camera.attachControl(canvas, true);
  
  // light1
  var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light.position = new BABYLON.Vector3(20, 800, 20);
  light.intensity = 0.8;
  
  var lightSphere = BABYLON.Mesh.CreateSphere("sphere", 10, 10, scene);
  lightSphere.position = light.position;
  lightSphere.material = new BABYLON.StandardMaterial("light", scene);
  lightSphere.material.emissiveColor = new BABYLON.Color3(1, 1, 0.8);
  
  var skybox = BABYLON.Mesh.CreateSphere("skyBox", 1000, 1000, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
  
  var ground = BABYLON.Mesh.CreateGround("ground", 1500, 1500, 2, scene);
  ground.material = new BABYLON.StandardMaterial("groundmat", scene);
  ground.material.diffuseTexture = new BABYLON.Texture("resources/ground.jpg", scene);
  ground.material.diffuseTexture.uScale = 20;
  ground.material.diffuseTexture.vScale = 20;
	
  spriteManagerTrees = new BABYLON.SpriteManager("treesManager", "resources/palm.png", 2100, 800, scene);
  for (var i = 0; i < 2000; i++) {
      var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
      tree.size = Math.random() * 4 + 6;
      tree.position.x = Math.random() * 1000 - 500;
      tree.position.z = Math.random() * 1000 - 500;
      tree.position.y = tree.height / 2;
      tree.isPickable = false;
  }
  
  select = BABYLON.MeshBuilder.CreateBox("select", {size: 10, height: 2}, scene);
  select.material = new BABYLON.StandardMaterial("selectcolor", scene);
  select.material.diffuseColor = new BABYLON.Color3(1, 0, 0); //Red
  select.material.alpha = 0.5;
  select.isPickable = false;
  
  return scene;
}

var scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
 scene.render();
});

// When click event is raised
canvas.addEventListener("click", function () {
  var pickResult = scene.pick(scene.pointerX, scene.pointerY);
  if (pickResult.hit) {
    console.log(pickResult.pickedMesh.name);
    if (pickResult.pickedMesh.name == "ground"){ 
      select.position = pickResult.pickedPoint;
    } else {
      select.position.x = pickResult.pickedMesh.position.x;
      select.position.z = pickResult.pickedMesh.position.z;
      selectedMesh = pickResult.pickedMesh;
    }
  }
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

function addTree(){
  var tree = new BABYLON.Sprite("tree", spriteManagerTrees);
  tree.size = Math.random() * 4 + 6;
  tree.position.x = select.position.x;
  tree.position.z = select.position.z;
  tree.position.y = tree.height / 2;
  tree.isPickable = false;
}

function addBuilding() {
  var building = BABYLON.MeshBuilder.CreateBox("building", {size: 8, height: 6}, scene);
  building.material = new BABYLON.StandardMaterial("buildingcolor", scene);
  building.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  building.position.x = select.position.x;
  building.position.z = select.position.z;
  building.position.y = 2;
}

function deleteBuilding() {
  if (selectedMesh){
    selectedMesh.dispose();
  }
}





