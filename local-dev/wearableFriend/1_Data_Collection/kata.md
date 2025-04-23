### AI Engineering Sub-Kata: Data Collection and Labeling System

#### Background

A wearable device with video and audio input can collect a vast amount of data as the user goes about their daily activities. This data can be used to train AI models on various topics, such as recognizing objects, understanding speech in different contexts, and identifying activities or environments.

#### Current Process

Currently, data collection for AI training often requires manual setup, where specific environments, objects, or scenarios are captured in controlled conditions. Labeling the collected data is typically a separate, manual process.

#### Key Challenges

- Continuously collecting high-quality video and audio data without overwhelming the system's storage and processing capabilities.
- Ensuring the data is relevant and diverse enough to train models on different topics.
- Developing a method for efficient and accurate data labeling.

#### Objectives

- Implement a system to capture and store video and audio data continuously or at key moments.
- Develop a mechanism to label the data in real-time or through semi-automated processes.
- Ensure that the data collected covers a wide range of topics and contexts to maximize training utility.

#### Data Sources

- Real-time video and audio input from the device.
- User-provided metadata or contextual information.
- Pre-existing labeled datasets for cross-referencing and validation.

#### Engineering Tasks

- Design a data pipeline to capture and store video and audio efficiently.
- Develop a labeling tool that can either assist in real-time or process data post-capture.
- Implement data management techniques to handle large volumes of data and ensure it remains organized and accessible.

#### Constraints

- Limited storage and processing power on the device.
- Privacy concerns, especially in environments where video and audio capture may be sensitive.
- The need to minimize interruptions to the user’s daily activities.

#### Evaluation Criteria

- The quality and relevance of the collected data.
- Accuracy and efficiency of the data labeling process.
- User satisfaction with the data collection experience.

#### Bonus Considerations

- Implement adaptive data capture, where the system learns to focus on capturing data in new or underrepresented contexts.
- Explore the use of edge computing to process and filter data on-device before storage.
