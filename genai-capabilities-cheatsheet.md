# GenAI Capabilities Reference Sheet

## Core Text Understanding & Generation

### Base LLMs

**Description**: Foundation models for understanding and generating human language \
**When to use**: General text generation, understanding, anddialogue \

**Good at**:

- Natural language understanding
- Following complex instructions
- Generating human-like text

**Bad at**:

- Real-time updates
- Consistent factual accuracy
- Specialized domain knowledge without training

### Text Embeddings

**Description**: Convert text into numerical vectors capturing semantic meaning \
**When to use**: Semantic search, clustering, similaritydetection \

**Good at**:

- Capturing semantic relationships
- Enabling efficient similarity searches
- Working with any language
  **Bad at**:
- Preserving word order
- Understanding context beyond input
- Handling very long documents

### Chain-of-Thought Prompting

**Description**: Guide LLMs to show step-by-step reasoning \
**When to use**: Complex problem-solving, debugging, explanationgeneration \

**Good at**:

- Transparent decision making
- Complex reasoning tasks
- Educational explanations
  **Bad at**:
- Very long chains of reasoning
- Handling uncertainty
- Time-efficient processing

### Few-Shot Learning

**Description**: Train models with minimal examples in the prompt \
**When to use**: Quick adaptation to new tasks, formattingconsistency \

**Good at**:

- Pattern matching
- Format consistency
- Quick task adaptation
  **Bad at**:
- Complex tasks requiring many examples
- Generalizing from very few examples
- Handling edge cases

### Zero-shot Classification

**Description**: Categorize content without prior examples \
**When to use**: Dynamic categorization, flexible classificationneeds \

**Good at**:

- Adapting to new categories
- Basic content classification
- Working with clear categories
  **Bad at**:
- Highly nuanced distinctions
- Domain-specific terminology
- Consistent accuracy across categories

## Knowledge & Retrieval

### RAG (Retrieval-Augmented Generation)

**Description**: Enhance LLM responses with external knowledge \
**When to use**: Need accurate, up-to-date, or domain-specificresponses \

**Good at**:

- Reducing hallucinations
- Handling proprietary information
- Providing verifiable responses
  **Bad at**:
- Complex reasoning across documents
- Handling conflicting information
- Managing large context windows

### Semantic Text Search

**Description**: Advanced search understanding meaning, not just keywords \
**When to use**: Information retrieval, document search, contentdiscovery \

**Good at**:

- Understanding search intent
- Handling synonyms and related concepts
- Ranking by relevance
  **Bad at**:
- Exact keyword matching
- Complex boolean queries
- Very large-scale deployments

### Text Summarization

**Description**: Create concise versions of longer texts \
**When to use**: Document processing, content briefs, informationextraction \

**Good at**:

- Identifying key points
- Maintaining core meaning
- Handling different text types
  **Bad at**:
- Preserving all important details
- Technical content accuracy
- Very long documents

### Content Generation with Control

**Description**: Generate text with specific parameters (temperature, sampling) \
**When to use**: Need specific creativity/randomness levels

**Good at**:

- Consistent output control
- Balancing creativity/determinism
- Different writing styles
  **Bad at**:
- Guaranteeing uniqueness
- Perfect reliability at extremes
- Complex creative tasks

## Multimodal Capabilities

### Vision Language Models

**Description**: Process and understand images alongside text \
**When to use**: Image analysis, visual Q&A, content moderation

**Good at**:

- Describing image contents
- Answering questions about images
- Identifying objects/scenes
  **Bad at**:
- Fine detail measurement
- Text extraction from images
- Abstract concept understanding

### Image Generation

**Description**: Create, edit, or modify images from text descriptions \
**When to use**: Design ideation, content creation, image editing\

**Good at**:

- Creating diverse images
- Following style guidelines
- Basic image manipulation
  **Bad at**:
- Perfect accuracy
- Consistent specific details
- Complex sequential edits

### TTS (Text-to-Speech)

**Description**: Convert written text into natural-sounding speech \
**When to use**: Accessibility features, audio content, voiceassistants \

**Good at**:

- Natural prosody
- Multiple voices/languages
- Real-time generation
  **Bad at**:
- Complex emotions
- Rare word pronunciation
- Ambiguous formatting

### STT (Speech-to-Text)

**Description**: Convert spoken audio into written text \
**When to use**: Transcription, voice commands, accessibility

**Good at**:

- Multiple speaker handling
- Real-time transcription
- Common accents
  **Bad at**:
- Heavy background noise
- Technical terminology
- Simultaneous speakers

## Developer Tools & Code

### Function Calling

**Description**: Parse input into structured API calls \
**When to use**: Building AI assistants with external services

**Good at**:

- Structured data extraction
- Following schemas
- Task automation
  **Bad at**:
- Complex decision trees
- Edge cases
- Real-time error recovery

### Structured Output

**Description**: Generate responses in specific formats \
**When to use**: Data extraction, API integration, formatconversion \

**Good at**:

- Consistent structure
- Data transformation
- Schema compliance
  **Bad at**:
- Complex nested structures
- Very large outputs
- Perfect syntax in edge cases

### Code Generation/Completion

**Description**: Generate or suggest code completions \
**When to use**: Development assistance, code conversion,documentation \

**Good at**:

- Common pattern completion
- Basic code generation
- Documentation writing
  **Bad at**:
- Complex algorithms
- Security-critical code
- Framework-specific code

### Model Optimization

**Description**: Optimize models for production deployment \
**When to use**: Production deployment, resource constraints

**Good at**:

- Reducing model size
- Improving inference speed
- Maintaining performance
  **Bad at**:
- Zero impact on accuracy
- Complex model architectures
- Custom hardware optimization

## Customization & Optimization

### Fine-tuning/PEFT

**Description**: Customize models for specific tasks efficiently \
**When to use**: Domain adaptation, specific task optimization

**Good at**:

- Improving specific tasks
- Resource efficiency
- Maintaining base knowledge
  **Bad at**:
- Very small datasets
- Complete behavior changes
- Multiple task optimization

### Knowledge Distillation

**Description**: Create smaller models learning from larger ones \
**When to use**: Model compression, deployment optimization

**Good at**:

- Preserving core capabilities
- Reducing model size
- Improving inference speed
  **Bad at**:
- Matching full model performance
- Complex task transfer
- Very small model targets

## Orchestration & Control

### LLMs as Agents

**Description**: Autonomous LLMs for multi-step tasks \
**When to use**: Complex task automation, workflow orchestration

**Good at**:

- Task breakdown
- Adaptation
- Context maintenance
  **Bad at**:
- Perfect reliability
- Real-world interaction
- Time-sensitive operations

### Prompt Chaining/Orchestration

**Description**: Coordinate multiple AI tasks in sequence \
**When to use**: Complex workflows, multi-step processing

**Good at**:

- Task coordination
- Information flow
- Error handling
  **Bad at**:
- Real-time processing
- Complex dependencies
- Resource optimization

### Ranking Models

**Description**: Score and order items by relevance/quality \
**When to use**: Search optimization, content curation

**Good at**:

- Relative quality comparison
- User feedback learning
- Diverse content handling
  **Bad at**:
- Absolute quality assessment
- Reasoning explanation
- Subjective criteria

### Self-Reflection/Self-Correction

**Description**: Models that can evaluate and improve their own outputs \
**When to use**: Quality assurance, iterative improvement

**Good at**:

- Error detection
- Output improvement
- Consistency checking
  **Bad at**:
- Complex reasoning errors
- Understanding own limitations
- Time-efficient processing

### LLM-as-Judge

**Description**: Use LLMs to evaluate outputs/solutions \
**When to use**: Quality assessment, content moderation

**Good at**:

- Consistency in evaluation
- Multi-criteria assessment
- Feedback generation
  **Bad at**:
- Absolute quality metrics
- Technical evaluations
- Cross-model consistency
