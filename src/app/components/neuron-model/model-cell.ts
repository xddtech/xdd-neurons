/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

export class ModelCell {
  static size = 1;
  static cellGeometry = new THREE.BoxGeometry(ModelCell.size, ModelCell.size, ModelCell.size);
  static cellMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } )
  static topColor = new THREE.Color(0, 1, 0);
  static bottomColor = new THREE.Color(0, 0, 1);
  static gray1 = new THREE.Color(0.7, 0.7, 0.7);
  static gray2 = new THREE.Color(0.8, 0.8, 0.8);
  static initStaticDone = false;

  static initStatic(): void {
    if (ModelCell.initStaticDone) {
      return;
    }
    ModelCell.initStaticDone = true;
    ModelCell.cellGeometry.faces[4].color = ModelCell.topColor;
    ModelCell.cellGeometry.faces[5].color = ModelCell.topColor;
    ModelCell.cellGeometry.faces[6].color = ModelCell.bottomColor;
    ModelCell.cellGeometry.faces[7].color = ModelCell.bottomColor;
    ModelCell.cellGeometry.faces[0].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[1].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[2].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[3].color = ModelCell.gray1;
    ModelCell.cellGeometry.faces[8].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[9].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[10].color = ModelCell.gray2;
    ModelCell.cellGeometry.faces[11].color = ModelCell.gray2;
  }

  xyz: THREE.Vector3;

  constructor(private appSense: THREE.Scene, xyz?: THREE.Vector3) {
    ModelCell.initStatic();
    if (xyz == null) {
      this.xyz = new THREE.Vector3(0, 0, 0);
    } else {
      this.xyz = xyz;
    }
    this.create();
  }

  create(): void {
    var mesh = new THREE.Mesh(ModelCell.cellGeometry, ModelCell.cellMaterial );
    mesh.matrixAutoUpdate = false;
    mesh.position.x = this.xyz.x;
    mesh.position.y = this.xyz.y;
    mesh.position.z = this.xyz.z;
    mesh.updateMatrix();
    this.appSense.add(mesh);
  }
}