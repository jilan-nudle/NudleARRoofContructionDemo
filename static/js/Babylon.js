import SceneObject from "./SceneObject.js";
import TopMenu from "./TopMenu.js";
import DialogScreen from "./DialogScreen.js";
import XRChangeManager from "./XRChangeManager.js";
import BlobShadow from "./BlobShadow.js";
import BaseState from "./FlowEngine/BaseState.js";
import FlowEngine from "./FlowEngine/FlowEngine.js";
import QuizPanel from "./QuizPanel.js";


var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };


// States
class IntroScene extends BaseState {
    constructor() {
        super('Introduction');
        this.rootLayout = null;
    }

    async enter(engine) {

        const introScreen = new DialogScreen("assets/overview-image.png", "Roof Construction", "You’re about to begin an immersive lesson on roof construction, where you’ll explore a 3D model of a timber roof. You’ll see how trusses, wall plates, anchors, purlins, and battens work together to form a strong structure—step inside and discover how a roof is built!", "START LESSON");

        introScreen.attachEvent(() => {
            engine.goTo("Overview");
        });

        this.introScreenObj = introScreen.get();

        engine.context.advancedTexture.addControl(this.introScreenObj);

        const xrManager = new XRChangeManager(engine.context.xr);
        xrManager.inAR = () => {
            introScreen.setScale(3);
        }
        xrManager.onExitAR = () => {
            introScreen.setScale(1);
        }

        xrManager.processCheck();


    }

    async exit() {
        this.introScreenObj.dispose();
    }
}

class OverviewScene extends BaseState {
    constructor() {
        super('Overview');
    }

    async enter(engine, payload) {

        engine.context.topMenu.setVisible(true);
        engine.context.topMenu.setCaption("Anchor straps are metal ties that fasten roof trusses to wall plates. They secure the roof against strong winds and prevent uplift.");
        engine.context.topMenu.disableAdditionalButtons(false);

        engine.context.topMenu.maximizeCaption();

        const xrManager = new XRChangeManager(engine.context.xr);

        xrManager.inAR = () => {
            engine.context.isARPlaced = true;

            engine.context.topMenu.setScale(3);
            engine.context.topMenu.disableAdditionalButtons(true);

            const object = engine.context.mainObject;

            engine.context.dot.isVisible = false;

            object.getRoot().parent = engine.context.root;
            object.setVisible(true);
            object.getRoot().position.set(0, 0, 0);
            object.playAnimation("AnchorStrapsAction", true, 1);

            //object.setScaling(1);
            engine.context.root.scaling = new BABYLON.Vector3(1, 1, 1);


            // changing topmenu icon
            engine.context.topMenu.arButton.image.source = "https://i.imgur.com/fUOPUfW.png";

        }

        xrManager.in3D = () => {
            engine.context.skybox.isVisible = true;

            // Scaling UI
            engine.context.topMenu.setScale(1);
            engine.context.topMenu.disableAdditionalButtons(true);



            const object = engine.context.mainObject;
            object.refresh();
            object.setVisible(true);
            object.playAnimation("AnchorStrapsAction", true, 1);

            //engine.context.root.position = new BABYLON.Vector3(0,2.5,0);
            //object.getRoot().position.y = -3;
            //object.setScaling(14);

            engine.context.root.scaling = new BABYLON.Vector3(2, 2, 2);


            // changing topmenu icon
            engine.context.topMenu.arButton.image.source = "https://i.imgur.com/ugjxybx.png";


        }

        xrManager.onExitAR = () => {
            engine.context.isARPlaced = false;
        }


        xrManager.processCheck();


    }

    async exit(engine) {
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        // Disabling the additonal options.
        engine.context.mainObject.refresh();
        engine.context.mainObject.stopAllAnimation();
    }
}


class Slide1Scene extends BaseState{
    constructor(){
        super("Slide1");
    }

    async enter(engine){
        const topMenu = engine.context.topMenu;
        topMenu.disableAdditionalButtons(true);

        topMenu.setVisible(true);
        topMenu.setCaption("Roof trusses are strong, triangular wooden frames that support a roof.They distribute weight evenly, keeping the structure stable and secure.");
        topMenu.maximizeCaption();

        

        engine.context.mainObject.setVisible(false);
        engine.context.mainObject = engine.context.objectArray[1];
        const object = engine.context.mainObject;
        object.refresh();
        object.setVisible(true);
        engine.context.mainObject.setVisible(true);


        object.playAnimation("NailPlat.008Action", true, 1, false);




    }

    async exit(engine){
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        // Disabling the additonal options.
        engine.context.mainObject.refresh();
        engine.context.mainObject = engine.context.objectArray[0];
        engine.context.mainObject.stopAllAnimation();
    }
}


class Slide2Scene extends BaseState{
    constructor(){
        super("Slide2");
    }

    async enter(engine){
        const topMenu = engine.context.topMenu;
        topMenu.disableAdditionalButtons(true);

        topMenu.setVisible(true);
        topMenu.setCaption("Purlins and battens are horizontal timber strips fixed across trusses. They provide support for roof coverings like tiles or sheets.");
        topMenu.maximizeCaption();
        

        engine.context.mainObject.setVisible(false);
        engine.context.mainObject = engine.context.objectArray[2];
        const object = engine.context.mainObject;
        object.refresh();
        object.setVisible(true);
        engine.context.mainObject.setVisible(true);



        // Changing Object.


    }

    async exit(engine){
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        // Disabling the additonal options.
        engine.context.mainObject.refresh();
        engine.context.mainObject = engine.context.objectArray[0];
    }
}



class Slide3Scene extends BaseState{
    constructor(){
        super("Slide3");
    }

    async enter(engine){
        const topMenu = engine.context.topMenu;
        topMenu.disableAdditionalButtons(true);

        topMenu.setVisible(true);
        topMenu.setCaption("Roof bracing strengthens trusses by preventing sideways movement and wobble. It ties the framework together, keeping the roof rigid and stable under loads.");
        topMenu.maximizeCaption();
        

        engine.context.mainObject.setVisible(false);
        engine.context.mainObject = engine.context.objectArray[3];
        const object = engine.context.mainObject;
        object.refresh();
        object.setVisible(true);
        engine.context.mainObject.setVisible(true);



        // Changing Object.


    }

    async exit(engine){
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        // Disabling the additonal options.
        engine.context.mainObject.refresh();
        engine.context.mainObject = engine.context.objectArray[0];
    }
}

class Slide4Scene extends BaseState{
    constructor(){
        super("Slide4");
    }

    async enter(engine){
        const topMenu = engine.context.topMenu;
        topMenu.setVisible(false);
        

        engine.context.mainObject.setVisible(false);
        engine.context.mainObject = engine.context.objectArray[1];
        const object = engine.context.mainObject;
        object.refresh();
        object.setVisible(true);
        engine.context.mainObject.setVisible(true);


        const quiz = new QuizPanel(engine.context.scene, {
            question: "What do roof trusses do?",
            options: [
                { text: "A. Support", correct: true },
                { text: "B. Distribute" },
                { text: "C. Stable" },
                { text: "D. Secure" }
            ],
            onProceed: () => engine.goTo("Conclusion"),
            onRetry: () => console.log("Retry question...")
        });

        this.quizRoot = quiz.getRoot();
        const quizRoot = this.quizRoot;
        quizRoot.parent = engine.context.root;
        quiz.setScale(0.5);
        quizRoot.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;

        quizRoot.position.y = -1.8;

        engine.context.root.y = 1;

    }

    async exit(engine){
        engine.context.topMenu.setVisible(false);
        engine.context.topMenu.minimizeCaption();
        engine.context.mainObject.setVisible(false);

        // Disabling the additonal options.
        engine.context.mainObject.refresh();
        engine.context.mainObject = engine.context.objectArray[0];
        this.quizRoot.dispose();
    }
}



class ArIntroScene extends BaseState {
    constructor() {
        super('ArIntroduction')
    }

    async enter(engine) {
        engine.context.skybox.isVisible = false;

        engine.context.dot.isVisible = true;
        engine.context.hitTest.onHitTestResultObservable.add((results) => {
            if (engine.context.isARPlaced == false) {
                if (results.length) {
                    engine.context.dot.isVisible = true;
                    results[0].transformationMatrix.decompose(engine.context.dot.scaling, engine.context.dot.rotationQuaternion, engine.context.dot.position);
                    results[0].transformationMatrix.decompose(undefined, engine.context.root.rotationQuaternion, engine.context.root.position);
                } else {
                    engine.context.dot.isVisible = false;
                }
            }
        });

    }

    async exit(engine) {

    }

}


class ConcludeScene extends BaseState {
    constructor() {
        super('Conclusion');
        this.rootLayout = null;
    }

    async enter(engine) {
        const endScreen = new DialogScreen("assets/overview-image.png", "Roof Construction", "And there we have it! Our lesson is completed. By the end of this you should know:\n- What an Anchro Strap is\n- What a Roof Truss is\n- What Purlins and Battens do", "END LESSON");

        endScreen.attachEvent(() => {
            window.location.href = window.location.href;
        });

        this.endScreenObj = endScreen.get();

        engine.context.advancedTexture.addControl(this.endScreenObj);

        const xrManager = new XRChangeManager(engine.context.xr);
        xrManager.inAR = () => {
            endScreen.setScale(3);
        }
        xrManager.onExitAR = () => {
            endScreen.setScale(1);
        }

        xrManager.processCheck();

    }

    async exit() {
        this.endScreenObj.dispose();
    }
}



var createScene = async function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(1, 1, 1);

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    var camera = new BABYLON.ArcRotateCamera("camera1", 0, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 1;

    const xrButton = document.querySelector(".xr-button-overlay");
    if (xrButton)
        xrButton.style.position = "";


    // GLOBAL VALUES


    // GLOBAL COMPONENTS
    const ADVANCEDTEXTURE = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    const XR = await scene.createDefaultXRExperienceAsync({
        // ask for an ar-session
        uiOptions: {
            sessionMode: "immersive-ar",
            disableDefaultUI: true,
        },
    });


    const ROOT = new BABYLON.TransformNode("ParentNode", scene);

    const TOPMENU = new TopMenu(ADVANCEDTEXTURE);
    TOPMENU.setVisible(false);


    const OBJECTARRAY = [
        new SceneObject("https://raw.githubusercontent.com/jilan-nudle/JilansGlbArchive/main/AnchorStrap.glb", scene),
        new SceneObject("https://raw.githubusercontent.com/jilan-nudle/JilansGlbArchive/main/truss%20roofing.glb", scene),
        new SceneObject("https://raw.githubusercontent.com/jilan-nudle/JilansGlbArchive/main/Roof%20Bracing.glb", scene),
        new SceneObject("https://raw.githubusercontent.com/jilan-nudle/JilansGlbArchive/main/Purlins%20%26%20Battens.glb", scene),

        
    ];

    for (const obj of OBJECTARRAY) {
        await obj.loadObject();
        obj.setVisible(false);
        obj.setParent(ROOT);
    }

    const MAINOBJECT = OBJECTARRAY[0];



    // attaching virtual shadow
    const SHADOW = new BlobShadow(scene, { radius: 1, opacity: 0 });
    SHADOW.attachTo(MAINOBJECT.getRoot());
    

    for(const obj of OBJECTARRAY){
        obj.refresh = () => {
            obj.stopAllAnimation();
            //MAINOBJECT.playAnimation("hover");
            //MAINOBJECT.getObject().animationGroups.find(a => a.name === "exploded_view").reset();
            //MAINOBJECT.getObject().animationGroups.find(a => a.name === "hover").stop();
            //MAINOBJECT.getObject().animationGroups.find(a => a.name === "hover").goToFrame(0);

        }
    }


    // Setting additonal button functions
    TOPMENU.animateButton.onPointerUpObservable.add(() => {
        MAINOBJECT.refresh()
        //MAINOBJECT.playAnimation("hover");
    });

    TOPMENU.explodeButton.onPointerUpObservable.add(() => {
        //MAINOBJECT.playAnimation("exploded_view");
    });

    // Defining pointer in main scene
    const DOT = BABYLON.MeshBuilder.CreateTorus('marker', { diameter: 0.15, thickness: 0.05, tessellation: 32 });
    DOT.isVisible = false;
    scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
            const { hit, pickedMesh } = pointerInfo.pickInfo;
            if (hit && pickedMesh === DOT) {
                MANAGER.goTo("Overview");
            }
        }
    });

    const FEATUREMANAGER = XR.baseExperience.featuresManager;
    const HITTEST = FEATUREMANAGER.enableFeature(BABYLON.WebXRHitTest, "latest");



    // =======
    const MANAGER = new FlowEngine({
        states: [new IntroScene(), new OverviewScene(), new Slide1Scene(), new Slide2Scene(), new Slide3Scene(), new Slide4Scene(), new ConcludeScene(), new ArIntroScene()],
        initial: 'Introduction',
        context: {
            advancedTexture: ADVANCEDTEXTURE, topMenu: TOPMENU, xr: XR, babylonEngine: engine,
            root: ROOT, scene: scene, mainObject: MAINOBJECT, dot: DOT, shadow: SHADOW,
            skybox: skybox, featureManager: FEATUREMANAGER, hitTest: HITTEST, isARPlaced: false,
            uiScale: 1, objectArray:OBJECTARRAY
        }
    });


    TOPMENU.arButton.onPointerUpObservable.add(() => {
        if (XR.baseExperience.state === BABYLON.WebXRState.IN_XR) {
            XR.baseExperience.exitXRAsync();
        } else if (XR.baseExperience.state === BABYLON.WebXRState.NOT_IN_XR) {
            XR.baseExperience.enterXRAsync("immersive-ar", "local-floor");
        }
    });




    TOPMENU.nextButton.onPointerUpObservable.add(() => {
        const current = MANAGER.current?.name;
        const stateNames = Array.from(MANAGER.states.keys());
        let index = stateNames.indexOf(current);
        if (index >= 0 && index < stateNames.length - 1) {
            MANAGER.goTo(stateNames[index + 1]);
        }
    });

    TOPMENU.prevButton.onPointerUpObservable.add(() => {
        const current = MANAGER.current?.name;
        const stateNames = Array.from(MANAGER.states.keys());
        let index = stateNames.indexOf(current);
        if (index >= 1 && index < stateNames.length) {
            MANAGER.goTo(stateNames[index - 1]);
        }

    });


    // Handling XR changes
    XR.baseExperience.onStateChangedObservable.add((state) => {
        if (state === BABYLON.WebXRState.IN_XR) {
            MANAGER.goTo("ArIntroduction"); // restarting scene
        } else if (state === BABYLON.WebXRState.NOT_IN_XR) {
            MANAGER.goTo("Overview"); // restarting scene
        }
    });


    // MAIN
    await MANAGER.start();



    return scene;
};

window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }


    // Fixing JS module glitch.
    engine = await asyncEngineCreation();
    window.engine = window;

    const engineOptions = window.engine.getCreationOptions?.();
    if (!engineOptions || engineOptions.audioEngine !== false) {

    }
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);

    // Fixing JS module glitch.
    scene = createScene();
    window.scene = scene;
};
initFunction().then(() => {
    scene.then(returnedScene => { sceneToRender = returnedScene; });

});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});