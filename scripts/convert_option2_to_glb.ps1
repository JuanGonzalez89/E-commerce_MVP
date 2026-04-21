param(
  [Parameter(Mandatory=$true)]
  [string]$BlenderExe
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $BlenderExe)) {
  throw "Blender executable not found: $BlenderExe"
}

$root = Split-Path -Parent $PSScriptRoot
$inputBlend = Join-Path $root "public/models/macbook-option2.blend"
$outputGlb = Join-Path $root "public/models/macbook-option2.glb"
$pythonScript = Join-Path $root "scripts/export_option2_glb.py"

if (-not (Test-Path $inputBlend)) {
  throw "Input blend not found: $inputBlend"
}

& $BlenderExe --background $inputBlend --python $pythonScript -- $outputGlb

if (-not (Test-Path $outputGlb)) {
  throw "GLB export failed"
}

Write-Output "Done: $outputGlb"
