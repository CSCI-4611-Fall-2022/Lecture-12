/* Lecture 12
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'

export class MeshViewer extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;
    private cylinder: gfx.Mesh;
    private defaultMaterial: gfx.GouraudMaterial;
    private wireframeMaterial: gfx.WireframeMaterial;

    // GUI variables
    private wireframe: boolean;

    constructor()
    {
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
        this.cylinder = this.createCylinderMesh(20, 3);
        this.defaultMaterial = new gfx.GouraudMaterial();
        this.wireframeMaterial = new gfx.WireframeMaterial();

        this.wireframe = false;
    }

    createScene(): void 
    {
        // Setup camera
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 10)
        this.cameraControls.setDistance(5);

        // Set a black background
        this.renderer.background.set(0, 0, 0);
        
        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.5, 0.5, 0.5));
        directionalLight.position.set(-2, 1, 0)
        this.scene.add(directionalLight);

        // Add an axes display to the scene
        const axes = new gfx.Axes3(4);
        this.scene.add(axes);

        // Add the cylinder mesh to the scene
        this.cylinder.material = this.defaultMaterial;
        this.scene.add(this.cylinder);

        // Create a simple GUI
        const gui = new GUI();
        gui.width = 200;

         // Create a GUI control for the debug mode and add a change event handler
         const debugController = gui.add(this, 'wireframe');
         debugController.name('Wireframe');
         debugController.onChange((value: boolean) => { this.toggleWireframe(value) });
 
    }

    private createCylinderMesh(numSegments: number, height: number): gfx.Mesh
    {
        const cylinder = new gfx.Mesh();

        const vertices: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];

        // Initialize variables for the cylinder circumference
        const angleIncrement = (Math.PI * 2) / numSegments;
        const numVerticesX = numSegments + 1;

        // Create the cylinder barrel vertices
        for(let i=0; i < numVerticesX; i++)
        {
            const angle = i * angleIncrement;

            vertices.push(Math.cos(angle), height/2, Math.sin(angle));
            vertices.push(Math.cos(angle), -height/2, Math.sin(angle));

            normals.push(Math.cos(angle), 0, Math.sin(angle));
            normals.push(Math.cos(angle), 0, Math.sin(angle));
        }

        // Create the cylinder barrel triangles
        for(let i=0; i < numSegments; i++)
        {
            const angle = i * angleIncrement;

            indices.push(i*2, i*2+2, i*2+1);
            indices.push(i*2+1, i*2+2, i*2+3);
        }

        cylinder.setVertices(vertices);
        cylinder.setNormals(normals);
        cylinder.setIndices(indices);
        cylinder.createDefaultVertexColors();

        return cylinder;
    }

    update(deltaTime: number): void 
    {
        // Update the camera orbit controls
        this.cameraControls.update(deltaTime);
    }

    private toggleWireframe(wireframe: boolean)
    {
        if(wireframe)
            this.cylinder.material = this.wireframeMaterial;
        else
            this.cylinder.material = this.defaultMaterial;
    }
}