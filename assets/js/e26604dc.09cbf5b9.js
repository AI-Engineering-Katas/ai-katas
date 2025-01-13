"use strict";(self.webpackChunktech_docs=self.webpackChunktech_docs||[]).push([[5293],{222:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>a,default:()=>h,frontMatter:()=>t,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"tools/visual-feature-extractors","title":"Visual Feature Extractors","description":"Tools for extracting meaningful features from visual data.","source":"@site/docs/tools/visual-feature-extractors.md","sourceDirName":"tools","slug":"/tools/visual-feature-extractors","permalink":"/ai-katas/tools/visual-feature-extractors","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"Vector Similarity Search","permalink":"/ai-katas/tools/vector-similarity-search"},"next":{"title":"index","permalink":"/ai-katas/"}}');var l=s(4848),r=s(8453);const t={},a="Visual Feature Extractors",o={},c=[{value:"Supported Solution Fields",id:"supported-solution-fields",level:2},{value:"When to Use",id:"when-to-use",level:2},{value:"When Not to Use",id:"when-not-to-use",level:2},{value:"Tradeoffs",id:"tradeoffs",level:2},{value:"Commercial Implementations",id:"commercial-implementations",level:2},{value:"Common Combinations",id:"common-combinations",level:2},{value:"Case Study: Visual Search System",id:"case-study-visual-search-system",level:2},{value:"Challenge",id:"challenge",level:3},{value:"Solution",id:"solution",level:3},{value:"Results",id:"results",level:3}];function d(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"visual-feature-extractors",children:"Visual Feature Extractors"})}),"\n",(0,l.jsx)(n.p,{children:"Tools for extracting meaningful features from visual data."}),"\n",(0,l.jsx)(n.h2,{id:"supported-solution-fields",children:"Supported Solution Fields"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/object-detection",children:"Object Detection"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/image-classification",children:"Image Classification"})}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-to-use",children:"When to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When extracting visual features"}),"\n",(0,l.jsx)(n.li,{children:"When need embeddings"}),"\n",(0,l.jsx)(n.li,{children:"When analyzing content"}),"\n",(0,l.jsx)(n.li,{children:"When building search systems"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-not-to-use",children:"When Not to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When raw pixels suffice"}),"\n",(0,l.jsx)(n.li,{children:"When simple processing needed"}),"\n",(0,l.jsx)(n.li,{children:"When features are known"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"tradeoffs",children:"Tradeoffs"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Depth vs Speed"}),": Deeper features take longer"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Generality vs Specificity"}),": General features vs task-specific"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Quality vs Resources"}),": Better features need more compute"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"commercial-implementations",children:"Commercial Implementations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"TensorFlow Hub"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Pre-trained feature extractors"}),"\n",(0,l.jsx)(n.li,{children:"Multiple architectures"}),"\n",(0,l.jsx)(n.li,{children:"Easy integration"}),"\n",(0,l.jsx)(n.li,{children:"GPU support"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Timm (PyTorch Image Models)"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Collection of SOTA models"}),"\n",(0,l.jsx)(n.li,{children:"Pre-trained networks"}),"\n",(0,l.jsx)(n.li,{children:"Research focus"}),"\n",(0,l.jsx)(n.li,{children:"Extensive options"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"common-combinations",children:"Common Combinations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Visual search"}),"\n",(0,l.jsx)(n.li,{children:"Content analysis"}),"\n",(0,l.jsx)(n.li,{children:"Similarity matching"}),"\n",(0,l.jsx)(n.li,{children:"Transfer learning"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"case-study-visual-search-system",children:"Case Study: Visual Search System"}),"\n",(0,l.jsx)(n.p,{children:"An e-commerce platform implemented visual search:"}),"\n",(0,l.jsx)(n.h3,{id:"challenge",children:"Challenge"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Large product catalog"}),"\n",(0,l.jsx)(n.li,{children:"Visual similarity needs"}),"\n",(0,l.jsx)(n.li,{children:"Real-time requirements"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"solution",children:"Solution"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Implemented TensorFlow Hub"}),"\n",(0,l.jsx)(n.li,{children:"Feature extraction pipeline"}),"\n",(0,l.jsx)(n.li,{children:"Vector search"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"results",children:"Results"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Improved search accuracy"}),"\n",(0,l.jsx)(n.li,{children:"Better user engagement"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>a});var i=s(6540);const l={},r=i.createContext(l);function t(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);