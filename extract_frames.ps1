$ErrorActionPreference = "Stop"

mkdir -Force src\assets\frames | Out-Null

$globalCounter = 1

for ($i = 1; $i -le 5; $i++) {
    Write-Host "Extracting frames from $i.mp4..."
    # Extract exactly 20 frames from each video, skipping the very first few frames just in case
    # -ss 0.5 starts half a second in.
    $ffmpegCmd = "ffmpeg"
    $args = @("-y", "-ss", "0.5", "-i", "src\assets\videos\$i.mp4", "-vf", "fps=10,scale=1280:-1", "-vframes", "20", "-q:v", "2", "src\assets\frames\temp_$i`_%03d.jpg")
    & $ffmpegCmd $args
}

Write-Host "Renaming files sequentially..."
$files = Get-ChildItem src\assets\frames\temp_*.jpg | Sort-Object Name

foreach ($file in $files) {
    $newName = "frame_{0:D4}.jpg" -f $globalCounter
    Rename-Item -Path $file.FullName -NewName $newName
    $globalCounter++
}

Write-Host "Done! Extracted $($globalCounter - 1) frames."
