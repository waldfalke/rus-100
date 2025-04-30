import{j as t}from"./jsx-runtime-DoEZbXM1.js";import{r as p}from"./index-DWtqY3O_.js";import"./jsx-runtime-Bw5QeaCk.js";const a=({title:r,children:o,isOpen:e,onToggle:l})=>t.jsxs("div",{className:"border rounded mb-2",children:[t.jsxs("button",{className:"w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none",onClick:l,"aria-expanded":e,children:[t.jsx("span",{children:r}),t.jsx("span",{children:e?"▲":"▼"})]}),e&&t.jsx("div",{className:"p-4",children:o})]});try{a.displayName="TaskCategoryAccordion",a.__docgenInfo={description:"",displayName:"TaskCategoryAccordion",props:{title:{defaultValue:null,description:"",name:"title",required:!0,type:{name:"string"}},isOpen:{defaultValue:null,description:"",name:"isOpen",required:!0,type:{name:"boolean"}},onToggle:{defaultValue:null,description:"",name:"onToggle",required:!0,type:{name:"() => void"}}}}}catch{}const n={category:"Работа с текстом",items:[{id:"1",title:"№1. Средства связи предложений в тексте"},{id:"2",title:"№2. Определение темы и главной мысли текста"}]},y={title:"Blocks/TaskCategoryAccordion",component:a},s={render:()=>{const[r,o]=p.useState(!0);return t.jsx(a,{title:n.category,isOpen:r,onToggle:()=>o(e=>!e),children:t.jsx("div",{className:"space-y-2 sm:space-y-3",children:n.items.map(e=>t.jsx("div",{className:"bg-white rounded shadow p-3 text-sm text-gray-800",children:e.title},e.id))})})}};var i,c,d;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return <TaskCategoryAccordion title={mockCategory.category} isOpen={isOpen} onToggle={() => setIsOpen(prev => !prev)}>\r
        <div className="space-y-2 sm:space-y-3">\r
          {mockCategory.items.map(item => <div key={item.id} className="bg-white rounded shadow p-3 text-sm text-gray-800">\r
              {item.title}\r
            </div>)}\r
        </div>\r
      </TaskCategoryAccordion>;
  }
}`,...(d=(c=s.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};const x=["Default"];export{s as Default,x as __namedExportsOrder,y as default};
//# sourceMappingURL=TaskCategoryAccordion.stories-C-OMASKZ.js.map
