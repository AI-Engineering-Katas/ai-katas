word doc/coda doc with the following:

- here's what the training is (those 3 bullets you showed yesterday, and a couple more sentences)
- include the fact that you've done this twice already, and this is a further refinement of that
- what you (personally) hope folks will get out of it/why you think it's important
- here's the format/agenda (e.g. pick 3 or 4 hours), 20 people, open invite (include a target audience)
- here's when we should do it (include the fact you know that other AI training is going to happen at some point, and we can work around it)
- here's what you need (e.g. licenses to Cursor, APIs, etc.), set up help, food, etc.
- here's your plan for what's next: (e.g. brownbag, refine, and repeat, etc.)

Enhance Your AI Engineering Skills With System Design Katas

## High Level "what is this"

Here's a brief, comic-form [intro](https://ai-engineering-katas.github.io/ai-katas/intro). Attendees will form groups and whiteboard a solution to a one of [twelve business problems](https://github.com/AI-Engineering-Katas/ai-katas/tree/main/katas). Every kata can be solved with a combination of off-the-shelf, commercially licensed tools available for discovery in the [AI Building Blocks](https://ai-engineering-katas.github.io/ai-katas/) website.

By researching solutions to their business problem, considering the tradeoffs of different approaches, and working with Lee to learn to construct a system design, participants will...

1. Learn how to break a complex problem into bite-sized, AI-shaped solutions
2. Practice being vulnerable, being curious, and communicating unproven ideas
3. Discover that a variety of useful and commercially licensed models (e.g. LLMs, embedding model, keyword extractors, sentiment scorers) can be wrapped in containers and used like any other service in a software solution

## NOSE

### Needs

SEP's clients have and will continue to request AI solutions to business problems that our engineers traditionally solve with deterministic algorithms.
Demand for data-driven solutions increases. SEP's capacity to deliver context-aware applications has not kept pace.
Further, SEP engineers are really smart and judge the time required to learn, vet, and master a new tool to be greater than the time spent accomplishing the task with the tools they know.
You need SEP engineers to engage with business problems that cannot be solved effectively with the tools they have, so that the value proposition for learning new tools becomes clear.

### Objectives

#### template

After this workshop, 20 SEP engineers will...
Be able to map our clients' business problems to AI capabilities and then use the AI Building Blocks site to identify which AI solution fields enable those capabilities
They will have a process for breaking a complex data problem into a clearly defined set of AI-powered solutions.
They will realize that they have already know how to design software solutions that use AI services.
They will have variety of useful and commercially licensed models (e.g. LLMs, embedding models, keyword extractors, sentiment scorers) that they can wrap in containers.
They will have an interactive resource that will allow them to learn the industry terms for the fields that enable capabilities that users want

#### prose

After participating in this workshop, 20 SEP engineers will gain facility in AI solution design and implementation.
They will develop the ability to analyze client business problems and systematically map them to specific AI capabilities, using the [AI Building Blocks](https://ai-engineering-katas.github.io/ai-katas/) site as their guide to match capabilities with appropriate AI solution fields.
SEPeers will possess a structured process for decomposing complex data challenges into simple components that can be developed as AI services.
Through hands-on experience during the workshop, they will discover that their existing software design expertise readily translates to architecting AI-enabled solutions.
The workshop will equip them with access to a curated collection of commercially licensed models - including LLMs, embedding models, and time series classifiers - that can be easily containerized and deployed using their existing DevOps chops.
Additionally, they will have ongoing access to a continually improving resource that bridges the gap between user requirements and industry terminology, enabling them to confidently navigate and communicate within the AI solution space.

### Solution

#### outline

Workshop attendees are introduced to two tools:

- user journey mapping
- the AI Building Blocks site
  Users form groups of four, move to a whiteboard, and recieve a business problem that is best solved with an AI-powered service.

They spend the next two hours consulting with Lee and a co-facilitator as they iterate on an AI system design.

Afterward, every group presents their solutions to the group.

#### prose

The AI Solutions Workshop is a hands-on, collaborative experience designed to bridge the gap between traditional software engineering and AI-powered solutions. The workshop begins with a 30-minute foundational session where attendees are introduced to two essential tools: the AI Building Blocks site, which catalogs AI capabilities and their corresponding solution fields, and user journey mapping, demonstrated through video instruction and a practical walkthrough of a reference implementation.
Following this introduction, the 20 participants divide into five groups of four and receive carefully crafted business problem "katas" that specifically highlight scenarios where traditional algorithmic approaches fall short. For the next two hours, each group engages in a structured design process: they first map their users' current journey, identify opportunities for AI enhancement, and then design a new journey supported by AI capabilities. Throughout this exercise, groups have access to Lee and a co-facilitator who provide guidance on mapping business problems to specific AI capabilities and selecting appropriate solutions from the Building Blocks site.
The workshop culminates in a 60-minute review session where each group presents their solution to their peers. This presentation format serves multiple purposes: it allows engineers to see how their existing software consulting skills translate to AI consulting, exposes them to various practical applications of AI services, and builds confidence in discussing AI solutions using industry-standard terminology. The interactive feedback session also allows participants to discuss the tradeoffs of their approaches, and challenge each other to devise different solutions.

### Evidence

I have run this workshop seven times over Zoom and twice in person, once at SEP and once at a software conference. At every session, participants were excited to share their solutions with each other. They stuck around after the event to debate approaches with folks they hadn't met, and they took photos of systems that other groups designed.
Participants always enjoy the hands-on nature of the workshop, and at the in-person sessions, software engineers have told me that they are going to back to their company to implement the solution they designed.

## What I personally hope attendees will get out it this workshop and why I think it's important

In 2025, the AI tools used to solve the most common business problems have been wrapped into software solutions that an engineer can deploy to a serverless GPU service.

We can discuss behavioral change at SEP through the Motivation, Ability, Prompt (MAP) framework. As a brief introduction, MAP describes three stars that must align for a person to verb a noun:

1. there is a good reason to do it (Motivation)
2. doing it is not so hard (Ability)
3. now would be a good time to do it (Prompt)

This workshop addresses Ability and Prompt.

**Ability:** By breaking down a client problem, understanding their product owner's constraints, and designing an AI solution with containerized services, SEPeers will realize that they already possess 90% of the skills necessary to "do AI Engineering".
**Prompt:** By exploring the trade-offs described in the [AI Building Blocks](https://ai-engineering-katas.github.io/ai-katas/) site, SEPeers gain an intuition for when an AI solution would be appropriate for a problem.

The AI Engineering System Design workshop provides an opportunity for engineers to learn about a new set of tools by designing a solution to a real-world business problem. They'll also gain experience exploring the [AI Building Blocks](https://ai-engineering-katas.github.io/ai-katas/) site, which would enable Architects, Leads, and Staff engineers to answer these questions:

1. What are some AI capabilities that I can add to my product?
2. What commercially available software tools can I use to add those capabilities?

## Format

- Half day workshop
- 4 hours
- 20 people

#### Who?

- Open invitation for makers and designers
- We will send direct invitations to SSEs and SE2s
  - why? SSEs and SE2s are the demographic most likely engage with new tools and spread new ideas to their project teams
- Andrew Dunlap, Zach Brandon, Rob and Jordan have already participated this workshop two or more times. I will give them the option to join as co-facilitators.

## Agenda

## Workshop Prep (30 minutes)

1. AI Building Blocks Intro
1. System Design Intro Slides
1. [Journey Map video](https://www.youtube.com/watch?v=2W13ext26kQ)
   - Actions that a user must take to complete their goal
   - Touchpoints where the user interacts with the system
1. Sample Walk Through of the Reference Site

## Groups and Katas (15 minutes)

1. Split into groups
2. Explain rules
3. Assign katas

#### Exercise (120minutes + two 10minute breaks)

1. Read Kata
2. Write Journey Map of current user process
3. Keeping Capabilities Slideshow in mind, pick a spot on the journey map to improve
4. Write a new journey map for your target
5. Design a system that supports the new journey map
6. Revise your design
7. Prepare a presentation

#### Review (60 minutes)

1. Present solutions
2. Questions, feedback, and emoji responding
3. Announce emoji

## When it should happen

Early March. The AI Practice has no scheduled work after February.

I am aware that there is an "AI to enhance personal productivity" workshop scheduled in the nearish future. I imagine the 20 people who would opt-in for an AI Engineering Kata workshop will opt-in for an "AI to enhance personal productivity" workshop. We should hold the workshops at least two weeks apart.

## Workshop Support

- eight tables in The Studio
- lunch and snacks/drinks

## Post training

- I host a brown bag talking about the workshop that recaps up the katas chosen and the solutions design. This will build hype for an upcoming session
- If attendees enjoy the design session, I can create containerized starter templates for them to implement the AI solutions that they designed
- We run the AI Engineering System Design workshop again the following month for a new group

# Announcement Copy

### Description

There you are, sipping an Old Fashioned and refactoring your codebase, when a wild-eyed product owner knocks on your door and begs your help to implement a RAG app demanded by The Board. When they call, will you be ready to design a solution with GenAI?

We weren't. We tuned into podcasts, watched YouTube videos, ran tutorials, tracked https://aigrant.org/ recipients, read research papers, joined discord servers, debated pipedreams with strangers, and built toy projects until we felt qualified to write GenAI services.

All of that theory and technical practice gave us the coveted "how", but not the "where", "why", or "when" of applying GenAI. To get that good good intuition, we had to write domain-specific business problems and then design solutions that leverage GenAI. The practice worked! It brought confidence to sales calls in domains that we have never worked in and, unexpectedly, made us better at collaborating with each other.

Join us for an interactive solution-design session! We took GenAI use-cases that we built ourselves or saw in the real-world and adapted them into a set of katas.

We'll work in three stages:

1. Preparation: Form a team and pick a kata
2. Design Phase: Collaborate a solution with your team
3. Peer Review Phase: Discuss the tradeoffs of your approach with the group at large

### Pre-requisites

Want to get the most out of our workshop? While optional, exploring these resources beforehand will spark your creativity and improve your experience:

1. Skim the reference material we will use during the workshop at https://ai-engineering-katas.github.io/ai-katas/
2. Deep-dive into any Capability that interests you, explore its Solutions, and check out the related Tools
3. Feel free to chat with AI assistants like ChatGPT or Claude to connect these concepts with your own ideas

Join us ready to learn, whether you've done the prep or not – we'll explore together!

# Cutting

If you'll allow a moment of armchair psychology, in conversations with ambitious founders, excitable product owners, and starry-eyed ML researchers, I've observed that the appeal of AI, and in particular of deep learning, lies in the notion that there can exist a solution to an everyday problem that is both

1. so arcane that only a non-human could find it
2. dramatically more effective than anything a human could come up with

The truth of these statements is irrelevant. The important part is that engineers who observe these notions intelligently assume that in order to deploy an AI solution, they must understand how the solution functions, so that when it breaks they can fix it. That would
