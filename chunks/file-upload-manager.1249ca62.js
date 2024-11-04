import{useContext as e,useRef as t,useEffect as i}from"react";import{F as s,u as a,a as r,g as l,E as o,b as m,d as n,A as p,I as d}from"./index.7fb5807e.js";import"react/jsx-runtime";import"@lifesg/react-design-system/text";import"@lifesg/react-design-system/markup";import"react-dom/server";import"@lifesg/react-design-system/media";import"@lifesg/react-design-system/color";import"styled-components";import"@lifesg/react-design-system/button";import"@lifesg/react-design-system/modal";import"@lifesg/react-design-system/alert";import"@lifesg/react-design-system/layout";import"@lifesg/react-design-system/box-container";import"@lifesg/react-design-system/divider";import"@lifesg/react-design-system/text-list";import"@lifesg/react-design-system/popover-v2";import"@lifesg/react-icons";import"@lifesg/react-design-system/tab";import"@lifesg/react-design-system/button-with-icon";import"@lifesg/react-design-system/error-display";import"@lifesg/react-design-system/filter";import"@lifesg/react-design-system/uneditable-section";import"@lifesg/react-design-system/timeline";import"@lifesg/react-design-system/form";import"@lifesg/react-design-system/toggle";import"@lifesg/react-design-system/checkbox";import"@lifesg/react-design-system/input-textarea";import"@lifesg/react-design-system/file-upload";import"@lifesg/react-icons/cross";import"@lifesg/react-design-system/icon-button";import"@lifesg/react-icons/pin-fill";import"@lifesg/react-design-system";import"@lifesg/react-design-system/image-button";import"@lifesg/react-design-system/radio-button";const f=["image/jpeg","image/gif","image/png"],g=g=>{const{compressImages:c,fileTypeRule:u,id:y,maxFileSizeRule:w,upload:I,uploadRule:F,value:U}=g,{files:b,setFiles:R,setCurrentFileIds:E}=e(s),T=a(U),{setValue:D}=r(),L=t();i((()=>{L.current=l()}),[]),i((()=>{b.forEach((async(e,t)=>{try{switch(e.status){case o.INJECTED:await z(e,t);break;case o.NONE:await A(e,t);break;case o.UPLOAD_READY:await M(e,t);break;case o.TO_DELETE:P(t)}}catch(e){h(t)}}));const e=b.filter((({status:e})=>e===o.UPLOADED)),t=e.filter((({addedFrom:e})=>"schema"!==e)).length>0,i=b.filter((({status:e})=>e===o.TO_DELETE)).length>0,s=t||i;E(e.map((({fileItem:e})=>e.id))),D(y,e.map((({dataURL:e,fileItem:t,fileUrl:i,uploadResponse:s})=>({..."base64"===I.type?{dataURL:e}:{},fileId:t.id,fileName:t.name,fileUrl:i,uploadResponse:s}))),{shouldDirty:s,shouldTouch:t})}),[b.map((({fileItem:e,status:t})=>`${e?.id}-${t}`)).join(",")]),i((()=>{void 0!==T&&void 0===U&&b.length&&R([])}),[b,T,R,U]);const h=e=>{R((t=>{const i=[...t],s=t[e];return i[e]={...s,fileItem:{...s.fileItem,id:s.fileItem?.id||l(),name:s.rawFile.name,errorMessage:F?.errorMessage||m.UPLOAD().GENERIC},status:o.ERROR_GENERIC},i}))},O=async(e,t)=>{if(f.includes(t||e.fileItem?.type)){const t=await d.dataUrlToImage(e.dataURL),i=await d.resampleImage(t,{width:94,height:94,crop:!0});return await n.fileToDataUrl(i)}return""},x=async e=>{const{addedFrom:t,dataURL:i,rawFile:s}=e,a=await n.getType(s);if(!(!u.fileType?.length||u.fileType?.includes(a.ext)))return{errorMessage:u.errorMessage||m.UPLOAD().FILE_TYPE(u.fileType||[]),fileType:a,status:o.ERROR_FORMAT};if(w.maxSizeInKb>0){const e=1024*w.maxSizeInKb;if("base64"===I.type&&n.getFilesizeFromBase64(i)>e||"multipart"===I.type&&s.size>e)return{errorMessage:w.errorMessage||m.UPLOAD().MAX_FILE_SIZE(w.maxSizeInKb),fileType:a,status:o.ERROR_SIZE}}return"schema"===t?{fileType:a,status:o.UPLOADED}:{fileType:a,status:o.UPLOAD_READY}},z=async(e,t)=>{let i;if(R((e=>{const i=[...e];return i[t]={...e[t],status:o.INJECTING},i})),e.dataURL){const t=await n.dataUrlToBlob(e.dataURL);i=new File([t],e.rawFile.name)}else if(e.fileUrl){const t=await new p("",void 0,void 0,!1,{responseType:"blob"}).get(e.fileUrl),s=await n.getType(new File([t],e.rawFile.name));i=new File([t],e.rawFile.name,{type:s.mime}),e.dataURL=await n.fileToDataUrl(i)}const{errorMessage:s,fileType:a}=await x({...e,rawFile:i}),r=await O(e,a.mime);R((m=>{const p=[...m];return p[t]={...e,fileItem:{errorMessage:s,id:e.fileItem?.id||l(),name:n.deduplicateFileName(b.map((({fileItem:e})=>e?.name)),t,i.name),progress:1,size:i.size,type:a.mime,thumbnailImageDataUrl:r},rawFile:i,status:o.UPLOADED},p}))},A=async(e,t)=>{const i=await v(e),s=await n.fileToDataUrl(i.rawFile),{errorMessage:a,fileType:r,status:o}=await x({dataURL:s,...i});R((e=>{const m=[...e];return m[t]={...i,dataURL:s,fileItem:{errorMessage:a,id:l(),name:n.deduplicateFileName(b.map((({fileItem:e})=>e?.name)),t,i.rawFile.name),size:i.rawFile.size,type:r.mime,progress:0},status:o},m}))},M=async(e,t)=>{R((e=>{const i=[...e];return i[t]={...e[t],status:o.UPLOADING},i}));const i=new FormData;i.append("sessionId",L.current||""),i.append("fileId",e.fileItem.id),i.append("slot",e.slot.toString()),"base64"===I.type?i.append("dataURL",e.dataURL):"multipart"===I.type&&i.append("file",e.rawFile,e.fileItem?.name);const s=await new p("",void 0,void 0,!0).post(I.url,i,{headers:{"Content-Type":"base64"===I.type?"application/json":"multipart/form-data"},onUploadProgress:e=>{const{loaded:i,total:s}=e;R((e=>{if(!e[t])return e;const a=[...e];return a[t]={...e[t],fileItem:{...e[t].fileItem,progress:i/s}},a}))}}),a=await O(e);R((e=>{if(!e[t])return e;const i=[...e];return i[t]={...e[t],fileItem:{...e[t].fileItem,progress:1,thumbnailImageDataUrl:a},fileUrl:s?.data?.fileUrl,status:o.UPLOADED,uploadResponse:s},i}))},P=e=>{R((t=>t.filter(((t,i)=>i!==e))))},v=async e=>{if(w.maxSizeInKb>0&&c){const t=1024*w.maxSizeInKb;if(e.rawFile.size>t){const t=await n.getType(e.rawFile);if(f.includes(t.mime)){let t=await d.compressImage(e.rawFile,{fileSize:w.maxSizeInKb});return t instanceof Blob&&(t=n.blobToFile(t,{name:e.rawFile.name,lastModified:e.rawFile.lastModified})),{...e,rawFile:t}}}}return e};return null};export{g as default};
//# sourceMappingURL=file-upload-manager.1249ca62.js.map