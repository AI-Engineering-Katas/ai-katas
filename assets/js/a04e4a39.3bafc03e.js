"use strict";(self.webpackChunktech_docs=self.webpackChunktech_docs||[]).push([[5936],{661:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>t,metadata:()=>i,toc:()=>a});const i=JSON.parse('{"id":"tools/search-engines","title":"Search Engines","description":"Enterprise and open-source search engine platforms that provide scalable information retrieval capabilities.","source":"@site/docs/tools/search-engines.md","sourceDirName":"tools","slug":"/tools/search-engines","permalink":"/ai-katas/tools/search-engines","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"Recommendation Engines","permalink":"/ai-katas/tools/recommendation-engines"},"next":{"title":"Statistical Analysis Tools","permalink":"/ai-katas/tools/statistical-analysis-tools"}}');var l=s(4848),r=s(8453);const t={},o="Search Engines",c={},a=[{value:"Supported Solution Fields",id:"supported-solution-fields",level:2},{value:"When to Use",id:"when-to-use",level:2},{value:"When Not to Use",id:"when-not-to-use",level:2},{value:"Tradeoffs",id:"tradeoffs",level:2},{value:"Commercial Implementations",id:"commercial-implementations",level:2},{value:"Common Combinations",id:"common-combinations",level:2},{value:"Case Study: Documentation Portal",id:"case-study-documentation-portal",level:2},{value:"Challenge",id:"challenge",level:3},{value:"Solution",id:"solution",level:3},{value:"Results",id:"results",level:3}];function d(e){const n={a:"a",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.header,{children:(0,l.jsx)(n.h1,{id:"search-engines",children:"Search Engines"})}),"\n",(0,l.jsx)(n.p,{children:"Enterprise and open-source search engine platforms that provide scalable information retrieval capabilities."}),"\n",(0,l.jsx)(n.h2,{id:"supported-solution-fields",children:"Supported Solution Fields"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/similarity-search",children:"Similarity Search"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/neural-search",children:"Neural Search"})}),"\n",(0,l.jsx)(n.li,{children:(0,l.jsx)(n.a,{href:"../solutions/content-based-filtering",children:"Content-based Filtering"})}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-to-use",children:"When to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When you need full-text search capabilities"}),"\n",(0,l.jsx)(n.li,{children:"When you need to handle large document collections"}),"\n",(0,l.jsx)(n.li,{children:"When you need faceted search and filtering"}),"\n",(0,l.jsx)(n.li,{children:"When you need relevance scoring and ranking"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"when-not-to-use",children:"When Not to Use"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"When you only need simple string matching"}),"\n",(0,l.jsx)(n.li,{children:"When your dataset is very small"}),"\n",(0,l.jsx)(n.li,{children:"When you need specialized vector search"}),"\n",(0,l.jsx)(n.li,{children:"When you need real-time updates"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"tradeoffs",children:"Tradeoffs"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Scale vs Complexity"}),": Larger indices require more complex management"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Features vs Performance"}),": More features can impact query speed"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Accuracy vs Speed"}),": Better relevance often means slower queries"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.strong,{children:"Managed vs Self-hosted"}),": Control versus operational overhead"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"commercial-implementations",children:"Commercial Implementations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Elasticsearch"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Open source"}),"\n",(0,l.jsx)(n.li,{children:"Highly scalable"}),"\n",(0,l.jsx)(n.li,{children:"Rich feature set"}),"\n",(0,l.jsx)(n.li,{children:"Strong ecosystem"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Solr"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Open source"}),"\n",(0,l.jsx)(n.li,{children:"Mature platform"}),"\n",(0,l.jsx)(n.li,{children:"Enterprise features"}),"\n",(0,l.jsx)(n.li,{children:"Strong text search"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Typesense"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Modern architecture"}),"\n",(0,l.jsx)(n.li,{children:"Fast implementation"}),"\n",(0,l.jsx)(n.li,{children:"Easy to set up"}),"\n",(0,l.jsx)(n.li,{children:"Good for smaller deployments"}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:["\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Algolia"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Fully managed"}),"\n",(0,l.jsx)(n.li,{children:"Developer friendly"}),"\n",(0,l.jsx)(n.li,{children:"Quick implementation"}),"\n",(0,l.jsx)(n.li,{children:"Strong relevance"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"common-combinations",children:"Common Combinations"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Content management systems"}),"\n",(0,l.jsx)(n.li,{children:"E-commerce platforms"}),"\n",(0,l.jsx)(n.li,{children:"Documentation sites"}),"\n",(0,l.jsx)(n.li,{children:"Knowledge bases"}),"\n",(0,l.jsx)(n.li,{children:"Enterprise search"}),"\n"]}),"\n",(0,l.jsx)(n.h2,{id:"case-study-documentation-portal",children:"Case Study: Documentation Portal"}),"\n",(0,l.jsx)(n.p,{children:"A software company implemented enterprise search for their documentation:"}),"\n",(0,l.jsx)(n.h3,{id:"challenge",children:"Challenge"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Millions of documents"}),"\n",(0,l.jsx)(n.li,{children:"Multiple languages"}),"\n",(0,l.jsx)(n.li,{children:"Complex filtering needs"}),"\n",(0,l.jsx)(n.li,{children:"Real-time updates"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"solution",children:"Solution"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"Implemented Elasticsearch"}),"\n",(0,l.jsx)(n.li,{children:"Custom relevance scoring"}),"\n",(0,l.jsx)(n.li,{children:"Faceted navigation"}),"\n",(0,l.jsx)(n.li,{children:"Automated indexing"}),"\n"]}),"\n",(0,l.jsx)(n.h3,{id:"results",children:"Results"}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"80% faster search times"}),"\n",(0,l.jsx)(n.li,{children:"Improved search relevance"}),"\n",(0,l.jsx)(n.li,{children:"Better user satisfaction"}),"\n",(0,l.jsx)(n.li,{children:"Reduced support tickets"}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},8453:(e,n,s)=>{s.d(n,{R:()=>t,x:()=>o});var i=s(6540);const l={},r=i.createContext(l);function t(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:t(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);