# Scene Reconstruction Platforms

Platforms for reconstructing and understanding 3D scenes from various inputs.

## Supported Solution Fields

- [Object Detection](../solutions/object-detection)
- [Semantic Segmentation](../solutions/semantic-segmentation)

## When to Use

- When reconstructing 3D scenes
- When need environment modeling
- When working with multiple views
- When building digital twins

## When Not to Use

- When 2D models suffice
- When single view enough
- When real-time not needed

## Tradeoffs

- **Quality vs Speed**: Better quality needs more processing
- **Detail vs Storage**: More detail needs more storage
- **Accuracy vs Coverage**: Better accuracy needs more views

## Commercial Implementations

- **Agisoft Metashape**

  - Professional reconstruction
  - Multiple input types
  - High accuracy

- **RealityCapture**
  - Fast processing
  - High quality
  - Industry standard

## Common Combinations

- Digital twins
- Virtual environments
- Architecture visualization

## Case Study: Heritage Site Documentation

A museum implemented 3D reconstruction:

### Challenge

- Complex artifacts
- High detail needed
- Archive requirements

### Solution

- Implemented Agisoft
- Custom workflow
- Quality optimization

### Results

- Detailed digital archive
- Better preservation
