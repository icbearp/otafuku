"""Import both generated GLBs in Blender and validate their named mesh groups."""
import bpy
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "public" / "models"
for filename in ("polo_shirt.glb", "ceramic_set.glb"):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(root / filename))
    names = {obj.name for obj in bpy.data.objects}
    meshes = [obj for obj in bpy.data.objects if obj.type == "MESH"]
    assert len(meshes) >= 5, f"{filename}: too few meshes"
    if filename == "ceramic_set.glb":
        assert {"mesh_clay", "mesh_painted", "mesh_glazed"}.issubset(names), names
    else:
        assert "pique_body" in names and "placket" in names, names
    print(f"VALID {filename}: {len(meshes)} meshes")
