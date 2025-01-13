"use strict";(self.webpackChunktech_docs=self.webpackChunktech_docs||[]).push([[7328],{5168:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"tools/document-retrieval-systems","title":"Document Retrieval Systems","description":"Specialized systems for storing, indexing, and retrieving documents and their metadata.","source":"@site/docs/tools/document-retrieval-systems.md","sourceDirName":"tools","slug":"/tools/document-retrieval-systems","permalink":"/ai-katas/tools/document-retrieval-systems","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"Deep Learning Frameworks","permalink":"/ai-katas/tools/deep-learning-frameworks"},"next":{"title":"Forecasting Frameworks","permalink":"/ai-katas/tools/forecasting-frameworks"}}');var l=s(4848),r=s(8453);const t={},o="Document Retrieval Systems",c={},d=[{value:"Supported Solution Fields",id:"supported-solution-fields",level:2},{value:"When to Use",id:"when-to-use",level:2},{value:"When Not to Use",id:"when-not-to-use",level:2},{value:"Tradeoffs",id:"tradeoffs",level:2},{value:"Commercial Implementations",id:"commercial-implementations",level:2},{value:"Common Combinations",id:"common-combinations",level:2},{value:"Case Study: Legal Document Management",id:"case-study-legal-document-management",level:2},{value:"Challenge",id:"challenge",level:3},{value:"Solution",id:"solution",level:3},{value:"Results",id:"results",level:3}];function a(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"document-retrieval-systems",children:"Document Retrieval Systems"})}),"\n",(0,l.jsx)(n.p,{children:"Specialized systems for storing, indexing, and retrieving documents and their metadata."}),"\n",(0,l.jsx)(n.h2,{id:"supported-solution-fields",children:"Supported Solution Fields"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/similarity-search",children:"Similarity Search"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/content-based-filtering",children:"Content-based Filtering"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/natural-language-processing",children:"Natural Language Processing"})}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-to-use",children:"When to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When you need document-centric search"}),"\n",(0,l.jsx)(n.li,{children:"When metadata management is important"}),"\n",(0,l.jsx)(n.li,{children:"When you need version control"}),"\n",(0,l.jsx)(n.li,{children:"When you need document processing pipelines"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-not-to-use",children:"When Not to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When you only need simple file storage"}),"\n",(0,l.jsx)(n.li,{children:"When real-time search isn't required"}),"\n",(0,l.jsx)(n.li,{children:"When you don't need document processing"}),"\n",(0,l.jsx)(n.li,{children:"When you need general-purpose search"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"tradeoffs",children:"Tradeoffs"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Features vs Complexity"}),": More features mean more complex setup"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Processing vs Speed"}),": Better processing means slower indexing"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Storage vs Access"}),": Better access requires more storage"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Managed vs Self-hosted"}),": Ease of use versus control"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"commercial-implementations",children:"Commercial Implementations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"OpenSearch"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Open source"}),"\n",(0,l.jsx)(n.li,{children:"Document-focused"}),"\n",(0,l.jsx)(n.li,{children:"Good scalability"}),"\n",(0,l.jsx)(n.li,{children:"AWS integration"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"MongoDB Atlas Search"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Integrated search"}),"\n",(0,l.jsx)(n.li,{children:"Document-native"}),"\n",(0,l.jsx)(n.li,{children:"Good performance"}),"\n",(0,l.jsx)(n.li,{children:"Atlas platform"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Azure Cognitive Search"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"AI-enriched search"}),"\n",(0,l.jsx)(n.li,{children:"Document cracking"}),"\n",(0,l.jsx)(n.li,{children:"Managed service"}),"\n",(0,l.jsx)(n.li,{children:"Enterprise focus"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"common-combinations",children:"Common Combinations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Content management"}),"\n",(0,l.jsx)(n.li,{children:"Digital libraries"}),"\n",(0,l.jsx)(n.li,{children:"Legal document systems"}),"\n",(0,l.jsx)(n.li,{children:"Research repositories"}),"\n",(0,l.jsx)(n.li,{children:"Enterprise archives"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"case-study-legal-document-management",children:"Case Study: Legal Document Management"}),"\n",(0,l.jsx)(n.p,{children:"A law firm implemented document retrieval for their case files:"}),"\n",(0,l.jsx)(n.h3,{id:"challenge",children:"Challenge"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Complex document types"}),"\n",(0,l.jsx)(n.li,{children:"Strict security needs"}),"\n",(0,l.jsx)(n.li,{children:"Fast retrieval required"}),"\n",(0,l.jsx)(n.li,{children:"Version tracking needed"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"solution",children:"Solution"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Implemented OpenSearch"}),"\n",(0,l.jsx)(n.li,{children:"Custom security plugins"}),"\n",(0,l.jsx)(n.li,{children:"Automated metadata extraction"}),"\n",(0,l.jsx)(n.li,{children:"Version control integration"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"results",children:"Results"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"70% faster document retrieval"}),"\n",(0,l.jsx)(n.li,{children:"Improved security compliance"}),"\n",(0,l.jsx)(n.li,{children:"Better document organization"}),"\n",(0,l.jsx)(n.li,{children:"Reduced manual filing work"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(a,{...e})}):a(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>o});var i=s(6540);const l={},r=i.createContext(l);function t(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);