"""Build reference-led, dimensioned GLBs for the two scroll stories in Blender 4.x.

Run: blender --background --python scripts/build_product_models.py
The unseen sides and fabric/ceramic composition remain artistic estimates.
"""
import bpy
import math
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "models"
OUT.mkdir(parents=True, exist_ok=True)
random.seed(20260918)


def reset():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def rgba(hex_color):
    h = hex_color.lstrip("#")
    vals = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return (*[v / 12.92 if v < .04045 else ((v + .055) / 1.055) ** 2.4 for v in vals], 1)


def mat(name, color, roughness=.8, texture=None):
    m = bpy.data.materials.new(name)
    m.diffuse_color = rgba(color)
    m.use_nodes = True
    bsdf = next(node for node in m.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    if texture:
        node = m.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = texture
        m.node_tree.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])
    return m


def image_texture(name, mode, height=512, width=512):
    image = bpy.data.images.new(name, width=width, height=height, alpha=True)
    pixels = [0.0] * (width * height * 4)
    for y in range(height):
        v = y / (height - 1)
        for x in range(width):
            u = x / (width - 1)
            idx = (y * width + x) * 4
            if mode == "pique":
                loop = math.exp(-(((x % 8) - 3.5) ** 2 / 3 + ((y % 10) - 5) ** 2 / 8))
                tone = .87 + .09 * loop + .018 * random.random()
                rgb = (tone, tone, tone)
            else:
                phase = .014 * math.sin(u * 2 * math.pi * 3 + .9) + .010 * math.sin(u * 2 * math.pi * 7)
                cutoff = {"cup": .43, "bowl": .42, "vase": .47}[mode]
                green = v > cutoff + phase
                speck = random.random()
                if green:
                    base = (.115, .19, .145)
                    grain = .78 + .3 * random.random()
                    if speck < .015: grain *= .43
                else:
                    base = (.77, .75, .67)
                    grain = .89 + .17 * random.random()
                    if speck < .023: grain *= .46
                rgb = tuple(min(1, c * grain) for c in base)
            pixels[idx:idx + 4] = (*rgb, 1)
    image.pixels[:] = pixels
    image.pack()
    return image


def object_mesh(name, verts, faces, material, uv=None):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    for poly in data.polygons:
        poly.use_smooth = True
    if uv:
        layer = data.uv_layers.new(name="UVMap")
        for poly in data.polygons:
            for loop_index in poly.loop_indices:
                vertex_index = data.loops[loop_index].vertex_index
                layer.data[loop_index].uv = uv[vertex_index]
    return obj


def grid_surface(name, rows, cols, point, material, uv_point=None):
    verts = []
    uv = []
    for i in range(rows + 1):
        for j in range(cols + 1):
            verts.append(point(i / rows, j / cols))
            uv.append(uv_point(i / rows, j / cols) if uv_point else (j / cols, i / rows))
    faces = []
    for i in range(rows):
        for j in range(cols):
            a = i * (cols + 1) + j
            faces.append((a, a + cols + 1, a + cols + 2, a + 1))
    return object_mesh(name, verts, faces, material, uv)


def curve_tube(name, points, radius, material, resolution=3):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 24
    curve.bevel_depth = radius
    curve.bevel_resolution = resolution
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for node, point in zip(spline.bezier_points, points):
        node.co = point
        node.handle_left_type = node.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def polo():
    reset()
    # Ricoma's XXL laid-flat guide: 78 cm length, 60 cm chest, 52 cm shoulder,
    # 23 cm sleeve. One Blender unit here equals about 33.3 cm.
    pique = image_texture("pique_white_tintable", "pique")
    cloth = mat("navy_pique_tintable", "#ffffff", .96, pique)
    rib = mat("rib_tintable", "#ffffff", .89, pique)
    thread = mat("fine_navy_thread", "#66708a", 1)
    button = mat("smoked_nacre_buttons", "#636c7b", .42)
    opening = mat("shadowed_neck_opening", "#111927", 1)

    def torso(v, u):
        y = -1.17 + v * 2.34
        a = 2 * math.pi * u
        shoulder = max(0, (v - .83) / .17)
        width = (.895 - .045 * math.sin(v * math.pi) - .31 * shoulder)
        depth = .285 - .058 * shoulder
        fold = (.006 * math.sin(a * 9 + v * 7) + .004 * math.sin(a * 17 - v * 11)) * math.sin(v * math.pi)
        x = (width + fold) * math.cos(a)
        z = (depth + fold) * math.sin(a)
        z += .018 * math.sin(a * 3 + v * 8) * (1 - v) * max(0, math.sin(a))
        return (x, y, z)

    grid_surface("pique_body", 104, 128, torso, cloth, lambda v, u: (u * 8, v * 10))

    # A relaxed angled sleeve with a shaped opening, not a straight cylinder.
    for side in (-1, 1):
        def sleeve_point(v, u, side=side):
            a = u * math.tau
            start = Vector((side * .72, .82, 0))
            end = Vector((side * 1.36, .40, .005))
            center = start.lerp(end, v)
            radius = .272 - .028 * v
            center.z += .012 * math.sin(v * 9)
            return (center.x + side * .04 * math.sin(a) * (1 - v), center.y + radius * math.cos(a), center.z + radius * .72 * math.sin(a))
        grid_surface(f"sleeve_{side}", 36, 80, sleeve_point, cloth, lambda v, u: (u * 5, v * 3))
        def cuff_point(v, u, side=side):
            a = u * math.tau
            center = Vector((side * (1.33 + .06 * v), .42 - .04 * v, .005))
            radius = .243 - .003 * v
            return (center.x, center.y + radius * math.cos(a), center.z + radius * .72 * math.sin(a))
        grid_surface(f"cuff_{side}", 5, 80, cuff_point, rib, lambda v, u: (u * 5, v * .5))
        curve_tube(f"sleeve_seam_{side}", [(side * .78, .52, .18), (side * 1.10, .32, .20), (side * 1.37, .22, .11)], .003, thread)

    # Neck stand, two curved collar leaves, inner opening and layered placket.
    def neck(v, u):
        a = u * math.tau
        return (.315 * math.cos(a), 1.105 + .14 * v + .018 * math.sin(a), .194 * math.sin(a))
    grid_surface("neck_stand", 10, 96, neck, rib, lambda v, u: (u * 4, v))
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=.19, depth=.004, location=(0, 1.157, 0))
    bpy.context.object.name = "neck_dark_interior"
    bpy.context.object.scale.x = 1.65
    bpy.context.object.data.materials.append(opening)
    for side in (-1, 1):
        def flap(v, u, side=side):
            inner_x = .04 + .18 * v
            outer_x = .32 + .12 * v
            x = side * (inner_x + (outer_x - inner_x) * u)
            y = 1.22 - .35 * v + .035 * u
            z = .175 + .09 * v + .065 * u + .018 * math.sin(math.pi * u)
            return (x, y, z)
        grid_surface(f"collar_{side}", 22, 24, flap, rib, lambda v, u: (u * 2, v * 2))
        curve_tube(f"collar_stitch_{side}", [(side * .06, 1.21, .183), (side * .20, 1.09, .258), (side * .34, .89, .32), (side * .46, .91, .33)], .0025, thread)
    def placket(v, u):
        return ((u - .5) * .135, .55 + .48 * v, .292 + .017 * u)
    grid_surface("placket", 24, 6, placket, rib)
    for i, y in enumerate((.92, .73)):
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=.026, depth=.013, location=(0, y, .32))
        obj = bpy.context.object
        obj.name = f"button_{i}"
        obj.rotation_euler.x = math.pi / 2
        obj.data.materials.append(button)
        for x in (-.006, .006):
            curve_tube(f"button_hole_{i}_{x}", [(x, y - .007, .33), (x, y + .007, .33)], .0014, opening)
    curve_tube("hem_stitch_front", [(-.86, -1.095, .06), (-.44, -1.115, .25), (0, -1.117, .29), (.44, -1.115, .25), (.86, -1.095, .06)], .0026, thread)
    curve_tube("hem_stitch_back", [(-.86, -1.095, -.06), (-.44, -1.115, -.25), (0, -1.117, -.29), (.44, -1.115, -.25), (.86, -1.095, -.06)], .0026, thread)
    export("polo_shirt.glb")


def lathe(name, profile, material, location, texture_repeat=1):
    count = 128
    vertices, faces, uv = [], [], []
    lo, hi = min(y for _, y in profile), max(y for _, y in profile)
    for i, (r, y) in enumerate(profile):
        for j in range(count + 1):
            a = j / count * math.tau
            deviation = .003 * math.sin(a * 5 + y * 8) + .002 * math.sin(a * 11 - y * 6)
            rr = max(0, r + deviation * math.sin(math.pi * i / (len(profile) - 1)))
            vertices.append((location[0] + rr * math.cos(a), location[1] + y, location[2] + rr * math.sin(a)))
            uv.append((j / count * texture_repeat, (y - lo) / (hi - lo)))
    for i in range(len(profile) - 1):
        for j in range(count):
            a = i * (count + 1) + j
            faces.append((a, a + count + 1, a + count + 2, a + 1))
    return object_mesh(name, vertices, faces, material, uv)


def interpolated_profile(knots, count=96):
    result = []
    for i in range(count + 1):
        t = i / count * (len(knots) - 1)
        k = min(len(knots) - 2, int(t))
        f = t - k
        f = f * f * (3 - 2 * f)
        result.append((knots[k][0] * (1 - f) + knots[k + 1][0] * f,
                       knots[k][1] * (1 - f) + knots[k + 1][1] * f))
    return result


def ceramics():
    reset()
    textures = {item: image_texture(f"forest_glaze_{item}", item) for item in ("cup", "bowl", "vase")}
    stages = (("mesh_clay", .99), ("mesh_painted", .92), ("mesh_glazed", .28))
    # Units are 10 cm. Inner cup ≈ 8.7 cm diameter × 9.5 cm fill height ≈ 500 ml.
    cup = interpolated_profile([(0, -.54), (.28, -.54), (.39, -.52), (.45, -.45), (.46, .45), (.45, .51), (.405, .51), (.395, .44), (.39, -.37), (.30, -.44), (0, -.44)])
    cup = [(r * 1.10, y) for r, y in cup]
    # Reference shows a shallow 8-inch bowl/dish rather than a flat dinner plate.
    bowl = interpolated_profile([(0, -.24), (.52, -.24), (.68, -.21), (.87, -.13), (1.016, .02), (1.016, .055), (.97, .07), (.83, -.04), (.62, -.13), (0, -.14)])
    vase = interpolated_profile([(0, -.9), (.23, -.9), (.43, -.78), (.52, -.48), (.51, -.13), (.43, .25), (.28, .65), (.20, .84), (.22, .9), (.165, .9), (.16, .80), (.29, .37), (.40, -.12), (.38, -.51), (.20, -.79), (0, -.79)])
    for stage, rough in stages:
        group = bpy.data.collections.new(stage)
        bpy.context.scene.collection.children.link(group)
        parent = bpy.data.objects.new(stage, None)
        group.objects.link(parent)
        for kind, profile, loc in (("cup", cup, (-1.48, -.36, .06)), ("bowl", bowl, (0, -.66, .46)), ("vase", vase, (1.45, 0, -.26))):
            if stage == "mesh_clay":
                material = mat(f"{stage}_{kind}", "#aa846d", rough)
            else:
                material = mat(f"{stage}_{kind}", "#ffffff", rough, textures[kind])
            obj = lathe(f"{stage}_{kind}", profile, material, loc)
            bpy.context.collection.objects.unlink(obj)
            group.objects.link(obj)
            obj.parent = parent
        handle_mat = mat(f"{stage}_handle", "#aa846d" if stage == "mesh_clay" else "#344f3c", rough)
        handle = curve_tube(f"{stage}_cup_handle", [(-1.82, .30, .06), (-2.04, .35, .06), (-2.20, .15, .06), (-2.18, -.18, .06), (-2.01, -.30, .06), (-1.84, -.24, .06)], .073, handle_mat, 6)
        handle.location.y = -.36
        bpy.context.collection.objects.unlink(handle)
        group.objects.link(handle)
        handle.parent = parent
        if stage != "mesh_clay":
            for side in (-1, 1):
                ear = curve_tube(f"{stage}_vase_ear_{side}", [(1.45 + side * .40, .52, -.26), (1.45 + side * .60, .54, -.26), (1.45 + side * .61, .35, -.26), (1.45 + side * .45, .30, -.26)], .072, handle_mat, 5)
                bpy.context.collection.objects.unlink(ear)
                group.objects.link(ear)
                ear.parent = parent
    export("ceramic_set.glb")


def export(name):
    # The authored coordinates already use Y as the up axis expected by Three.js.
    bpy.ops.export_scene.gltf(filepath=str(OUT / name), export_format="GLB", export_apply=True, export_yup=False)
    print("EXPORTED", name, (OUT / name).stat().st_size)


polo()
ceramics()
