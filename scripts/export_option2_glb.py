import bpy
import os
import sys

# Args after "--": input_blend output_glb
args = sys.argv
if "--" not in args:
    raise SystemExit("Usage: blender --background <input.blend> --python scripts/export_option2_glb.py -- <output.glb>")

extra = args[args.index("--") + 1 :]
if len(extra) < 1:
    raise SystemExit("Missing output glb path")

output_glb = os.path.abspath(extra[0])

# Clean selected state and export all visible objects.
for obj in bpy.data.objects:
    obj.select_set(False)

bpy.ops.export_scene.gltf(
    filepath=output_glb,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_texcoords=True,
    export_normals=True,
    export_materials="EXPORT",
)

print(f"Exported: {output_glb}")
