var selectedObject = null;
var selectedObject_2 = null;
var popUpWindow = null;

class SimulationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimulationScene' });
    }
    preload() {
        // Load game-related assets
        this.load.image('gameBackground', 'assets/images/gameover-bg.jpg');
        this.load.image('pc', 'assets/images/pc.png');
        this.load.image('router', 'assets/images/router.png');
        this.load.image('wire', 'assets/images/wire.png');
    }

    create() {
        // Create initial game state
        this.add.image(450, 450, 'gameBackground');
        const router_1 = new RouterObjecttSim(this, 450, 400, 'router1');
        const router_12 = new RouterObjecttSim(this, 450, 400,'router2');
        const router_123 = new RouterObjecttSim(this, 450, 400,'router3');
        const es1 = new EndSystemObjectSim(this, 450, 400, 'pc1');
        const es2 = new EndSystemObjectSim(this, 450, 400, 'pc2');

        const graphics = this.add.graphics();
        const curr_wire = new Phaser.Geom.Line();
        // list of wires\
        let wires = [];

        // deselect if clicked outside of any object
        this.input.on('pointerdown', () => {

            this.drawWires(wires, graphics);

            if (selectedObject)
            {
                selectedObject.setTint('0xffffff');
                selectedObject = null;
            }
            if (selectedObject_2) {
                selectedObject_2.setTint('0xffffff');
                selectedObject_2 = null;
            }

        });

        // draw a wire from the selected object to the mouse

        this.input.on('pointermove', (pointer) => {

            

            
            if (selectedObject && selectedObject_2) {
                // draw a wire from the selected object to the mouse
                console.log("drawing wire");
                graphics.clear();
                graphics.lineStyle(2, 0x00ff00);
                graphics.strokeLineShape(curr_wire.setTo(selectedObject.x, selectedObject.y, selectedObject_2.x, selectedObject_2.y));
                wires.push(new WireObjecttSim(this, selectedObject, selectedObject_2));
                this.drawWires(wires, graphics);

                // deselect the objects
                selectedObject.setTint('0xffffff');
                selectedObject_2.setTint('0xffffff');
                selectedObject = null;
                selectedObject_2 = null;
            }
        });
        

    }

    update() {
        // Update game logic
    }

    drawWires(wires, graphics) {
        if (wires.length > 0) {
            graphics.clear();
            for (let i = 0; i < wires.length; i++) {
                graphics.lineStyle(2, 0x00ff00);
                graphics.strokeLineShape(new Phaser.Geom.Line(wires[i].conn1.x, wires[i].conn1.y, wires[i].conn2.x, wires[i].conn2.y));
            }
        }

    }

}


class WireObjecttSim {

    constructor(name, conn1, conn2) {
        this.name = "id" + Math.random().toString(16).slice(2);
        this.conn1 = conn1;
        this.conn2 = conn2;
    }
}

class RouterObjecttSim extends Phaser.GameObjects.GameObject {

    constructor(scene, x, y, name) {
        super(scene, x, y);
        // Create the router sprite
        this.name = name;
        scene.load.image('router', 'assets/images/router.png');
        const object = scene.add.sprite(x, y, 'router').setSize(150, 150).setInteractive({ pixelPerfect: true, draggable: true });
        
        // move the object
        object.on('drag', function (pointer, dragX, dragY) {
            x = dragX;
            y = dragY;
            this.x = x;
            this.y = y;
        });

        // select the object
        object.on('pointerdown', function (pointer, x,y, event) {
            // check if the pointer is over a object
            // if it is, select the object
            console.log(`${name} clicked`);
            
            // if there is a selected object, deselect it
            if (selectedObject) {
                selectedObject.setTint("0xffffff");    
            }

            if (popUpWindow) {
                popUpWindow.destroy();
                popUpWindow = null; // Reset popUpWindow reference
            }


            if (selectedObject === object) {
                selectedObject = null;
            } else if (selectedObject && selectedObject_2 === null) {
                selectedObject_2 = this;
                console.log(`${name} clicked`);
                this.setTint("0x00ff00");
            } else {
                selectedObject = this;
                this.setTint("0x00ff00");

                popUpWindow = createPopUp(scene, this);
            }

            event.stopPropagation();

        });

        function createPopUp(scene, object) {
            const popUp = scene.add.container(1000, 0);
            const graphics = scene.add.graphics();
            graphics.fillStyle(0xFFFFFF, 0.7);
            graphics.fillRoundedRect(0, 0, 200, 100, 10);
            popUp.add(graphics);

            const nameLabel = scene.add.text(10, 10, `Name: ${name}`, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
            popUp.add(nameLabel);

            const coordinatesLabel = scene.add.text(10, 30, `Coordinates: (${object.x}, ${object.y})`, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
            popUp.add(coordinatesLabel);

            const networkingLabel = scene.add.text(10, 70, `Networking:`, { fontFamily: 'Arial', fontSize: 16, color: '#ffffff' });
            popUp.add(networkingLabel);

            return popUp;
        }
    
    }

    getName() {
        return this.name;
    }

    getCoordinates() {
        return { x: this.x, y: this.y };
    }

}

class EndSystemObjectSim extends Phaser.GameObjects.GameObject {
    constructor(scene, x, y, name) {
        super(scene, x, y)

        scene.load.image('pc', 'assets/images/pc.png');
        const object = scene.add.sprite(x, y, "pc").setSize(150, 150).setInteractive({ pixelPerfect: true, draggable: true });

        object.on('drag', function (pointer, dragX, dragY) {
            x = dragX;
            y = dragY;
            this.x = x;
            this.y = y;
        });

        object.on('pointerdown', function (pointer, x,y, event) {
            // check if the pointer is over a object
            // if it is, select the object
            
            // if there is a selected object, deselect it
            if (selectedObject) {
                selectedObject.setTint("0xffffff");
            }

            if (selectedObject === object) {
                selectedObject = null;
            } else if (selectedObject && selectedObject_2 === null) {
                // there is already a selected object, select this object as the second object
                selectedObject_2 = this;
                this.setTint("0x0000ff");
            } else {
                selectedObject = this;
                this.setTint("0x00ff00");
            }

            event.stopPropagation();

        });

    }


    getName() {
        return this.name;
    }

    getCoordinates() {
        return { x: this.x, y: this.y };
    }

}